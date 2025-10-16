import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend calls
app.use(cors());

// Serve static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

const API_KEY = "a30ac13ab0dcea9b99490ccde6479883a9a4e5eb6400decd4d83c3c9b5b123d8";

app.get("/lookup/:barcode", async (req, res) => {
  const barcode = req.params.barcode;
  try {
    const response = await fetch(`https://go-upc.com/api/v1/code/${barcode}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("API failed");

    const data = await response.json();
    res.json(data.product || { error: "Product not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product info" });
  }
});

// Serve index.html for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
