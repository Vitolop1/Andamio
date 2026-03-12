import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const contents = fs.readFileSync(envPath, "utf8");

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalIndex = line.indexOf("=");

    if (equalIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalIndex).trim();
    const value = line.slice(equalIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

function buildPortalEmail(firstName, lastName, studentId) {
  const first = slugify(firstName) || "alumno";
  const last = slugify(lastName) || "andamio";
  return `${first}.${last}.${studentId.slice(0, 6)}@alumnos.andamio.app`;
}

function buildPortalPassword(firstName) {
  const safe = `${firstName || "Alumno"}`.trim();
  const normalized = safe.charAt(0).toUpperCase() + safe.slice(1).toLowerCase();
  return `${normalized}2026`;
}

function buildFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

loadEnvFile();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local.",
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const [{ data: students, error: studentsError }, { data: accounts }, { data: authUsersData, error: authUsersError }] =
  await Promise.all([
    supabase.from("students").select("id, first_name, last_name"),
    supabase
      .from("student_portal_accounts")
      .select("student_id, profile_id, email"),
    supabase.auth.admin.listUsers(),
  ]);

if (studentsError) {
  throw studentsError;
}

if (authUsersError) {
  throw authUsersError;
}

const accountMap = new Map((accounts ?? []).map((account) => [account.student_id, account]));
const authUsers = authUsersData.users ?? [];

for (const student of students ?? []) {
  const email = buildPortalEmail(student.first_name, student.last_name, student.id);
  const password = buildPortalPassword(student.first_name);
  const fullName = buildFullName(student.first_name, student.last_name);
  const existingAccount = accountMap.get(student.id);
  const existingUser = authUsers.find(
    (user) => user.email === email || user.email === existingAccount?.email,
  );

  let profileId = existingAccount?.profile_id ?? existingUser?.id;

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "alumno",
      },
    });

    if (error) {
      throw error;
    }
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "alumno",
      },
    });

    if (error || !data.user) {
      throw error ?? new Error(`No se pudo crear el acceso para ${fullName}.`);
    }

    profileId = data.user.id;
  }

  if (!profileId) {
    throw new Error(`No se pudo resolver el perfil para ${fullName}.`);
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: profileId,
    full_name: fullName,
    email,
    role: "alumno",
  });

  if (profileError) {
    throw profileError;
  }

  const { error: accountError } = await supabase
    .from("student_portal_accounts")
    .upsert({
      student_id: student.id,
      profile_id: profileId,
      email,
      initial_password: password,
    });

  if (accountError) {
    throw accountError;
  }

  console.log(`${fullName}: ${email} -> ${password}`);
}

console.log("");
console.log("Accesos de alumnos sincronizados.");
