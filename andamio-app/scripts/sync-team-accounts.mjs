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

const accounts = [
  {
    profileId: "11111111-1111-1111-1111-111111111111",
    legacyEmails: ["valentina@andamio.app", "emilia@andamio.app"],
    email: "emimaidanacornejo@gmail.com",
    fullName: "Lic. Emilia Maidana",
    role: "admin",
    password: "Emilia2026",
  },
  {
    profileId: "11111111-1111-1111-1111-111111111112",
    legacyEmails: ["natalia@andamio.app", "rosario@andamio.app"],
    email: "rosario@andamio.app",
    fullName: "Prof. Rosario Maidana",
    role: "profesional",
    password: "Rosario2026",
  },
  {
    profileId: "11111111-1111-1111-1111-111111111113",
    legacyEmails: ["rocio@andamio.app", "agustina@andamio.app"],
    email: "agustina@andamio.app",
    fullName: "Prof. Agustina Esquiu",
    role: "profesional",
    password: "Agustina2026",
  },
  {
    profileId: "11111111-1111-1111-1111-111111111114",
    legacyEmails: ["admin@andamio.app"],
    email: "admin@andamio.app",
    fullName: "Admin Andamio",
    role: "admin",
    password: "Admin2026",
  },
];

const { data: authUsersData, error: authUsersError } =
  await supabase.auth.admin.listUsers();

if (authUsersError) {
  throw authUsersError;
}

const authUsers = authUsersData.users ?? [];

for (const account of accounts) {
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: account.profileId,
    email: account.email,
    full_name: account.fullName,
    role: account.role,
  });

  if (profileError) {
    throw profileError;
  }

  const existingUser = authUsers.find(
    (user) =>
      user.email === account.email ||
      account.legacyEmails.includes(user.email ?? ""),
  );

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: {
        full_name: account.fullName,
        role: account.role,
      },
    });

    if (error) {
      throw error;
    }

    console.log(`Actualizada: ${account.email}`);
    continue;
  }

  const { error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      full_name: account.fullName,
      role: account.role,
    },
  });

  if (error) {
    throw error;
  }

  console.log(`Creada: ${account.email}`);
}

console.log("");
console.log("Cuentas del equipo sincronizadas.");
for (const account of accounts) {
  console.log(`${account.email} -> ${account.password}`);
}
