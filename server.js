const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");

app.use(express.json());

// 🔗 Supabase
const supabase = createClient(
  "YOUR_SUPABASE_URL",
    "YOUR_SUPABASE_KEY"
    );

    // 🟢 Route رئيسية
    app.get("/", (req, res) => {
      res.send("🔥 Game Server Running");
      });

      // 🧠 AI Score
      function calculateScore(kills, deaths, accuracy) {
        return (kills * 10) + (accuracy * 20) - (deaths * 5);
        }

        // 🎮 استقبال بيانات اللاعب
        app.post("/score", async (req, res) => {
          const { playerName, kills, deaths, accuracy } = req.body;

            const score = calculateScore(kills, deaths, accuracy);

              // 🗄️ تخزين في leaderboard
                await supabase.from("leaderboard").insert([
                    {
                          player: playerName,
                                score: score
                                    }
                                      ]);

                                        res.json({
                                            player: playerName,
                                                score: score,
                                                    message: "Saved + AI calculated 🔥"
                                                      });
                                                      });

                                                      // 🏆 leaderboard
                                                      app.get("/leaderboard", async (req, res) => {
                                                        const { data } = await supabase
                                                            .from("leaderboard")
                                                                .select("*")
                                                                    .order("score", { ascending: false })
                                                                        .limit(10);

                                                                          res.json(data);
                                                                          });

                                                                          app.listen(3000, () => console.log("Server running"));