import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const seedUsers = [
  {
    email: "editor@muse.agency",
    password: "MuseEditor!2026#Ops",
    profile: {
      full_name: "Amara Lewis",
      title: "Content Producer",
      company: "Muse",
      role: "editor",
    },
  },
  {
    email: "admin@muse.agency",
    password: "MuseAdmin!2026#Ops",
    profile: {
      full_name: "Robert Loterh",
      title: "Operations Director",
      company: "Muse",
      role: "admin",
    },
  },
];

async function getUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw error;
  }

  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function upsertUser(seedUser) {
  const existing = await getUserByEmail(seedUser.email);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      email: seedUser.email,
      password: seedUser.password,
      email_confirm: true,
      user_metadata: {
        full_name: seedUser.profile.full_name,
        title: seedUser.profile.title,
        company: seedUser.profile.company,
        role: seedUser.profile.role,
      },
      app_metadata: {
        role: seedUser.profile.role,
        title: seedUser.profile.title,
        company: seedUser.profile.company,
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: seedUser.email,
    password: seedUser.password,
    email_confirm: true,
    user_metadata: {
      full_name: seedUser.profile.full_name,
      title: seedUser.profile.title,
      company: seedUser.profile.company,
      role: seedUser.profile.role,
    },
    app_metadata: {
      role: seedUser.profile.role,
      title: seedUser.profile.title,
      company: seedUser.profile.company,
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function upsertProfile(user, profile) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: profile.full_name,
      title: profile.title,
      company: profile.company,
      role: profile.role,
    },
    { onConflict: "id" }
  );

  if (error) {
    throw error;
  }
}

async function main() {
  for (const seedUser of seedUsers) {
    const user = await upsertUser(seedUser);
    await upsertProfile(user, seedUser.profile);
    console.log(`Seeded ${seedUser.profile.role} user: ${seedUser.email}`);
  }

  console.log("Supabase auth seed complete.");
}

main().catch((error) => {
  console.error("Supabase auth seed failed:", error.message);
  process.exit(1);
});
