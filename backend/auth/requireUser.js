const { getSupabaseClient } = require("../database/supabaseClient");

/**
 * Requires Authorization: Bearer <access_token>. Sets req.user from Supabase.
 */
async function requireUser(req, res, next) {
  const header = req.headers.authorization;
  const token =
    typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice(7).trim()
      : null;

  if (!token) {
    return res.status(401).json({ error: "Authorization required" });
  }

  try {
    const supabase = getSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err.message?.includes("Missing SUPABASE")) {
      return res.status(503).json({ error: "Supabase is not configured" });
    }
    console.error(err);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

module.exports = { requireUser };
