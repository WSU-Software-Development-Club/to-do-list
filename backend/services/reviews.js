const {
  getSupabaseServiceClient,
} = require("../database/supabaseClient");
const { parseRequiredInt } = require("../util/helpers");

async function createReview(req, res) {
  const { tmdb_movie_id, movie_title, rating, body } = req.body ?? {};
  const userId = req.user?.id;

  const movieIdResult = parseRequiredInt(tmdb_movie_id, "tmdb_movie_id");
  if (!movieIdResult.ok) {
    return res.status(400).json({ error: movieIdResult.error });
  }
  if (movieIdResult.value < 1) {
    return res.status(400).json({ error: "tmdb_movie_id must be positive" });
  }

  const ratingResult = parseRequiredInt(rating, "rating");
  if (!ratingResult.ok) {
    return res.status(400).json({ error: ratingResult.error });
  }
  if (ratingResult.value < 1 || ratingResult.value > 10) {
    return res.status(400).json({ error: "rating must be between 1 and 10" });
  }

  let movieTitle = null;
  if (movie_title !== undefined && movie_title !== null) {
    if (typeof movie_title !== "string") {
      return res.status(400).json({ error: "movie_title must be a string" });
    }
    const trimmed = movie_title.trim();
    movieTitle = trimmed.length > 0 ? trimmed : null;
  }

  let reviewBody = null;
  if (body !== undefined && body !== null) {
    if (typeof body !== "string") {
      return res.status(400).json({ error: "body must be a string" });
    }
    const trimmed = body.trim();
    reviewBody = trimmed.length > 0 ? trimmed : null;
  }

  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch (err) {
    if (err.message?.includes("Missing SUPABASE")) {
      return res.status(503).json({ error: "Supabase is not configured" });
    }
    throw err;
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      tmdb_movie_id: movieIdResult.value,
      movie_title: movieTitle,
      rating: ratingResult.value,
      body: reviewBody,
    })
    .select(
      "id, user_id, tmdb_movie_id, movie_title, rating, body, created_at, updated_at, likes"
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: error.message });
    }
    console.error("reviews insert:", error);
    return res.status(400).json({ error: error.message ?? "Failed to create review" });
  }

  return res.status(201).json({ review: data });
}

module.exports = { createReview };
