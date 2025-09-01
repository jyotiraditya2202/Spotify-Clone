import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";


const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build
app.use(express.static(path.join(__dirname, "client/build")));

// ✅ API route comes BEFORE catch-all
app.get("/api/trending", async (req, res) => {
  try {
    const response = await fetch("https://api.deezer.com/chart/0/tracks?limit=100&index=0");
    const data = await response.json();

    // Deezer's response is in data.data
    const topTracks = data.data.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      posterUrl: track.album.cover_medium,
      preview: track.preview,
    }));

    res.json(topTracks);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to fetch trending songs" });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

// ✅ React fallback (AFTER API route)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../../spotify(prod)", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
