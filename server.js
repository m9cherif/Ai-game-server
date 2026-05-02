const express = require("express");
const app = express();

app.use(express.json());

// 🌐 اختبار السيرفر
app.get("/", (req, res) => {
  res.send("🔥 Game Server is running!");
});

// 🎮 استقبال بيانات اللاعب
app.post("/score", (req, res) => {
  const { playerName, kills } = req.body;

  console.log("Player:", playerName, "Kills:", kills);

  res.json({
    message: "Score received ✅",
    player: playerName,
    kills: kills
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
