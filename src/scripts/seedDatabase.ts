// src/scripts/seedDatabase.ts
import { supabase } from "../config/supabase";
import { UserRole } from "../config/supabase";

async function seedDatabase() {
  try {
    // Check if SUDO user exists
    const {
      data,
      count,
      error: countError,
    } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", UserRole.SUDO)
      .limit(1);

    if (countError) {
      throw countError;
    }

    if (count && count > 0) {
      console.log("SUDO user already exists");
      return;
    }

    // Create SUDO user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: process.env.SUDO_EMAIL || "sudo@example.com",
      password: process.env.SUDO_PASSWORD || "StrongPassword123!",
      options: {
        data: {
          first_name: "Super",
          last_name: "Admin",
          role: UserRole.SUDO,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("No user data returned from auth signup");
    }

    // Create user record
    const { error: userError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: process.env.SUDO_EMAIL || "sudo@example.com",
        first_name: "Super",
        last_name: "Admin",
        role: UserRole.SUDO,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (userError) {
      throw userError;
    }

    console.log("✅ SUDO user created successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase().catch((error) => {
  console.error("Fatal error during database seeding:", error);
  process.exit(1);
});
