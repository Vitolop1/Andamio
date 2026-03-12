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

loadEnvFile();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tempPassword = process.argv[2] || "Andamio2026!";

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

const { data: profiles, error: profilesError } = await supabase
  .from("profiles")
  .select("email, full_name, role")
  .in("role", ["admin", "profesional"])
  .order("created_at", { ascending: true });

if (profilesError) {
  throw profilesError;
}

const { data: authUsersData, error: authUsersError } =
  await supabase.auth.admin.listUsers();

if (authUsersError) {
  throw authUsersError;
}

const authUsers = authUsersData.users ?? [];

for (const profile of profiles ?? []) {
  const existingUser = authUsers.find((user) => user.email === profile.email);

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: profile.full_name,
        role: profile.role,
      },
    });

    if (error) {
      throw error;
    }

    console.log(`Actualizado: ${profile.email}`);
    continue;
  }

  const { error } = await supabase.auth.admin.createUser({
    email: profile.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: profile.full_name,
      role: profile.role,
    },
  });

  if (error) {
    throw error;
  }

  console.log(`Creado: ${profile.email}`);
}

console.log("");
console.log("Usuarios listos.");
console.log(`Password temporal: ${tempPassword}`);
