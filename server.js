const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");

app.use(express.json());

const supabase = createClient(
  "https://wpcnlaugoyrzxwolayzx.supabase.co",
    "sb_publishable_EJ4zT90Fl1fV1sj7kCvkFQ_QvaedcTw"
    );
    app.get("/", (req, res) => {
      res.send("🔥 Server OK");
      });

      app.post("/score", async (req, res) => {
        try {
            const { playerName, kills, deaths, accuracy } = req.body;

                const score = (kills * 10) + (accuracy * 20) - (deaths * 5);

                    await supabase.from("leaderboard").insert([
                          { player: playerName, score }
                              ]);

                                  res.json({ playerName, score });

                                    } catch (err) {
                                        console.error(err);
                                            res.status(500).send("Error");
                                              }
                                              });

                                              const PORT = process.env.PORT || 3000;
                                              app.listen(PORT, () => console.log("Running..."));
