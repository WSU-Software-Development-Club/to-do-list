const { getSupabaseClient } = require("../database/supabaseClient");
const { validatePassword } = require("../util/helpers");

async function signup(req, res) {
  try {
    const { email, password, data: userMetadata } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.error });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:
          userMetadata && typeof userMetadata === "object" ? userMetadata : {},
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    if (err.message?.includes("Missing SUPABASE")) {
      return res.status(503).json({ error: "Supabase is not configured" });
    }
    console.error(err);
    return res.status(500).json({ error: "Signup failed" });
  }
}

module.exports = { signup };
