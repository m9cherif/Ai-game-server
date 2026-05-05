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

                const score = (kills * 10);

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
app.post("/score", async (req, res) => {
  try {
    const { playerName, kills } = req.body;

    const score = kills * 10;

    const { error } = await supabase
      .from("leaderboard")
      .insert([{ player: playerName, score }]);

    if (error) {
      console.log(error);
      return res.status(500).send("DB error");
    }

    res.json({ playerName, score });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});
app.get("/leaderboard", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      return res.status(500).send(error.message);
    }

    res.json(data);

  } catch (err) {
    res.status(500).send("Server error");
  }
});

// NEW: Dashboard Page
app.get("/m9cherif3m9cherif3", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Player Management Dashboard</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
          color: #00ff88;
          text-shadow: 0 0 10px #00ff88;
        }
        .form-section {
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid #00ff88;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #00ff88;
          font-weight: bold;
        }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #00ff88;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          font-size: 14px;
        }
        input:focus {
          outline: none;
          box-shadow: 0 0 10px #00ff88;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 15px;
        }
        .form-row-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        button {
          padding: 12px 20px;
          background: #00ff88;
          color: #000;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        button:hover {
          background: #00cc6f;
          transform: scale(1.05);
        }
        button.delete {
          background: #ff3333;
          color: #fff;
        }
        button.delete:hover {
          background: #cc0000;
        }
        button.update {
          background: #ffaa00;
          color: #000;
        }
        button.update:hover {
          background: #ff8800;
        }
        button.cancel {
          background: #666;
          color: #fff;
        }
        button.cancel:hover {
          background: #555;
        }
        .table-section {
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid #00ff88;
          border-radius: 10px;
          padding: 20px;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #00ff88;
          color: #000;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #00ff88;
        }
        tr:hover {
          background: rgba(0, 255, 136, 0.1);
        }
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        .action-buttons button {
          padding: 6px 12px;
          font-size: 12px;
        }
        .message {
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 5px;
          text-align: center;
        }
        .success {
          background: rgba(0, 255, 136, 0.2);
          border: 1px solid #00ff88;
          color: #00ff88;
        }
        .error {
          background: rgba(255, 51, 51, 0.2);
          border: 1px solid #ff3333;
          color: #ff3333;
        }
        .edit-mode {
          background: rgba(255, 170, 0, 0.1);
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
          table {
            font-size: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎮 Player Management Dashboard</h1>
        
        <div id="message"></div>
        
        <div class="form-section">
          <h2>Add New Player</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="playerName">Player Name</label>
              <input type="text" id="playerName" placeholder="Enter player name">
            </div>
            <div class="form-group">
              <label for="kills">Kills</label>
              <input type="number" id="kills" placeholder="0" value="0" min="0">
            </div>
            <div class="form-group">
              <label for="deaths">Deaths</label>
              <input type="number" id="deaths" placeholder="0" value="0" min="0">
            </div>
            <div class="form-group">
              <label for="accuracy">Accuracy (%)</label>
              <input type="number" id="accuracy" placeholder="0" value="0" min="0" max="100">
            </div>
          </div>
          <div class="form-row-actions">
            <button onclick="addPlayer()">➕ Add Player</button>
            <button class="cancel" onclick="clearForm()">🔄 Clear</button>
          </div>
        </div>

        <div class="table-section">
          <h2>Players List</h2>
          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>Accuracy (%)</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="playersTable">
              <tr>
                <td colspan="6" style="text-align: center; color: #888;">Loading players...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <script>
        let editingId = null;

        async function loadPlayers() {
          try {
            const response = await fetch('/api/players');
            const players = await response.json();
            const tbody = document.getElementById('playersTable');
            
            if (players.length === 0) {
              tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #888;">No players yet</td></tr>';
              return;
            }

            tbody.innerHTML = players.map(player => \`
              <tr class="\${editingId === player.id ? 'edit-mode' : ''}">
                <td>\${player.player}</td>
                <td><input type="number" class="kill-input-\${player.id}" value="\${player.kills}" min="0" style="width: 60px;"></td>
                <td><input type="number" class="death-input-\${player.id}" value="\${player.deaths}" min="0" style="width: 60px;"></td>
                <td><input type="number" class="accuracy-input-\${player.id}" value="\${player.accuracy}" min="0" max="100" style="width: 60px;"></td>
                <td>\${Math.round(player.score)}</td>
                <td>
                  <div class="action-buttons">
                    <button class="update" onclick="updatePlayer(\${player.id})">💾 Save</button>
                    <button class="delete" onclick="deletePlayer(\${player.id})">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            \`).join('');
          } catch (error) {
            console.error('Error loading players:', error);
            showMessage('Error loading players', 'error');
          }
        }

        async function addPlayer() {
          const playerName = document.getElementById('playerName').value.trim();
          const kills = parseInt(document.getElementById('kills').value) || 0;
          const deaths = parseInt(document.getElementById('deaths').value) || 0;
          const accuracy = parseInt(document.getElementById('accuracy').value) || 0;

          if (!playerName) {
            showMessage('Please enter a player name', 'error');
            return;
          }

          try {
            const response = await fetch('/api/players', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ player: playerName, kills, deaths, accuracy })
            });

            if (!response.ok) throw new Error('Failed to add player');
            
            showMessage('✅ Player added successfully!', 'success');
            clearForm();
            loadPlayers();
          } catch (error) {
            console.error('Error:', error);
            showMessage('Error adding player', 'error');
          }
        }

        async function updatePlayer(id) {
          const kills = parseInt(document.querySelector(\`.kill-input-\${id}\`).value) || 0;
          const deaths = parseInt(document.querySelector(\`.death-input-\${id}\`).value) || 0;
          const accuracy = parseInt(document.querySelector(\`.accuracy-input-\${id}\`).value) || 0;

          try {
            const response = await fetch(\`/api/players/\${id}\`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ kills, deaths, accuracy })
            });

            if (!response.ok) throw new Error('Failed to update player');
            
            showMessage('✅ Player updated successfully!', 'success');
            loadPlayers();
          } catch (error) {
            console.error('Error:', error);
            showMessage('Error updating player', 'error');
          }
        }

        async function deletePlayer(id) {
          if (!confirm('Are you sure you want to delete this player?')) return;

          try {
            const response = await fetch(\`/api/players/\${id}\`, {
              method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete player');
            
            showMessage('✅ Player deleted successfully!', 'success');
            loadPlayers();
          } catch (error) {
            console.error('Error:', error);
            showMessage('Error deleting player', 'error');
          }
        }

        function clearForm() {
          document.getElementById('playerName').value = '';
          document.getElementById('kills').value = '0';
          document.getElementById('deaths').value = '0';
          document.getElementById('accuracy').value = '0';
        }

        function showMessage(text, type) {
          const messageDiv = document.getElementById('message');
          messageDiv.textContent = text;
          messageDiv.className = \`message \${type}\`;
          setTimeout(() => messageDiv.textContent = '', 4000);
        }

        // Load players on page load
        loadPlayers();
      </script>
    </body>
    </html>
  `);
});

// NEW: API Endpoints for dashboard
app.post("/api/players", async (req, res) => {
  try {
    const { player, kills, deaths, accuracy } = req.body;
    
    if (!player) {
      return res.status(400).json({ error: "Player name is required" });
    }

    const score = (kills * 10) + (accuracy * 20) - (deaths * 5);

    const { data, error } = await supabase
      .from("leaderboard")
      .insert([{ player, kills, deaths, accuracy, score }])
      .select();

    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/players", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { kills, deaths, accuracy } = req.body;

    const score = (kills * 10) + (accuracy * 20) - (deaths * 5);

    const { data, error } = await supabase
      .from("leaderboard")
      .update({ kills, deaths, accuracy, score })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/players/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("leaderboard")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Player deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
