const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");

app.use(express.json());

// Use environment variables for safety. Fallback to your current values for quick testing.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://wpcnlaugoyrzxwolayzx.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_EJ4zT90Fl1fV1sj7kCvkFQ_QvaedcTw";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Basic healthcheck
app.get("/", (req, res) => {
  res.send("🔥 Server OK");
});

// Helper to coerce numeric inputs and avoid NaN
function toNum(v) {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// ---- Leaderboard dashboard endpoints ----

// Add player
app.post("/api/players", async (req, res) => {
  try {
    const { player } = req.body;
    if (!player || String(player).trim() === "") {
      return res.status(400).json({ error: "Player name is required" });
    }

    // Normalize numeric inputs
    const kills = toNum(req.body.kills);
    const deaths = toNum(req.body.deaths);
    const accuracy = toNum(req.body.accuracy);

    const score = kills * 10 + accuracy * 20 - deaths * 5;

    console.log("Inserting player:", { player, kills, deaths, accuracy, score });

    const { data, error } = await supabase
      .from("leaderboard")
      .insert([{ player, kills, deaths, accuracy, score }])
      .select("*");

    console.log("Supabase insert result:", { data, error });

    if (error) {
      return res.status(500).json({ error: error.message || "Database error" });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("POST /api/players error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// List players
app.get("/api/players", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.log("Supabase select error:", error);
      return res.status(500).json({ error: error.message || "Database error" });
    }

    res.json(data);
  } catch (err) {
    console.error("GET /api/players error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update player
app.put("/api/players/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const kills = toNum(req.body.kills);
    const deaths = toNum(req.body.deaths);
    const accuracy = toNum(req.body.accuracy);

    const score = kills * 10 + accuracy * 20 - deaths * 5;

    console.log("Updating player id:", id, { kills, deaths, accuracy, score });

    const { data, error } = await supabase
      .from("leaderboard")
      .update({ kills, deaths, accuracy, score })
      .eq("id", id)
      .select("*");

    console.log("Supabase update result:", { data, error });

    if (error) {
      return res.status(500).json({ error: error.message || "Database error" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("PUT /api/players/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete player
app.delete("/api/players/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    console.log("Deleting player id:", id);

    const { data, error } = await supabase
      .from("leaderboard")
      .delete()
      .eq("id", id)
      .select("*");

    console.log("Supabase delete result:", { data, error });

    if (error) {
      return res.status(500).json({ error: error.message || "Database error" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({ message: "Player deleted" });
  } catch (err) {
    console.error("DELETE /api/players/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Keep server listen at the end
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}...`));
