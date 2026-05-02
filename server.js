const express = require("express");
const app = express();

app.use(express.json());

// 🧠 AI scoring function
function calculateScore(kills, deaths, accuracy) {
    return (kills * 10) + (accuracy * 20) - (deaths * 5);
}
app.get("/", (req, res) => {
      res.send("🔥 Server is running perfectly!");
})
// 🎮 استقبال بيانات اللاعب
app.post("/score", (req, res) => {
    const { playerName, kills, deaths, accuracy } = req.body;

    const score = calculateScore(kills, deaths, accuracy);

    console.log(playerName, score);

    res.json({
        player: playerName,
        score: score,
        message: "AI score calculated 🔥"
    });
});

app.listen(3000, () => console.log("Server running"));
