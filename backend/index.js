require("./config");
const express = require("express");
const cors = require("cors");
const moviesRouter = require("./routes/movies");
const authRouter = require("./routes/auth");
const reviewsRouter = require("./routes/reviews");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5001", "http://localhost"] }));
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/auth", authRouter);
app.use("/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.send("Backend active");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
