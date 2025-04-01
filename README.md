# NBA_Viz

Game Plan
* File Structure Change:/my-web-app
* ├── index.html
* ├── styles.css
* ├── control.js          # Interaction logic
* ├── mvpChart.js        # Visualization 1 (Engineer 1)
* ├── champChart.js      # Visualization 2 (Engineer 2)
* ├── scoringChart.js    # Visualization 3 (Engineer 3)
* ├── benchChart.js      # Visualization 4 (Engineer 4)
* ├── data/              # JSON files from Python
* └── server.py          # (Optional) Python server
* 
* Development: Each engineer works on their own chart file, fetching data from the processed JSON files and integrating interactions via control.js.

## Dataset Information

This project uses the ["NBA Player Stats Season 2425"](https://www.kaggle.com/datasets/eduardopalmieri/nba-player-stats-season-2425) dataset from Kaggle. The data is downloaded automatically when running the server.

## Setup and Installation

1. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

2. Set up Kaggle API credentials:
   - Create a Kaggle account if you don't have one
   - Go to your account settings (https://www.kaggle.com/account)
   - Create a new API token (this will download a kaggle.json file)
   - Place this file in `~/.kaggle/kaggle.json` (or `%USERPROFILE%\.kaggle\kaggle.json` on Windows)
   - Ensure the file permissions are secure: `chmod 600 ~/.kaggle/kaggle.json`

3. Run the server:
   ```
   python server.py
   ```

4. Open a browser and navigate to:
   ```
   http://localhost:5000
   ```

## Four Visualizations: Brief Descriptions
1. `mvpChart.js` - “Who Will Be the League MVP?”
* Engineer 1’s Task: Create a bar chart to predict the MVP based on a custom “MVP Score.”
* Description:
    * Calculate an MVP Score per player (e.g., PTS * 0.4 + AST * 0.3 + TRB * 0.2 + GmSc * 0.1, averaged over games).
    * Display the top 10 players by this score in a bar chart.
    * Data Used: Player, PTS, AST, TRB, GmSc, aggregated by player across all games.
    * Interactivity: Click a bar to display a small line chart of the player’s GmSc over time (last 10 games).
* Purpose: Highlight the standout performer likely to win MVP based on stats and consistency.
2. `champChart.js` - “Which Team Will Win the Championship?”
* Engineer 2’s Task: Build a scatter chart to predict the championship-winning team.
* Description:
    * Plot teams by average points scored (PTS summed per team, divided by games) vs. average points allowed (calculated from Opp and Res if possible, or inferred).
    * Use bubble size to represent win percentage (derived from Res).
    * Data Used: Tm, PTS, Res, aggregated by team.
    * Interactivity: Hover shows team name, wins, and key stats; dropdown filters by conference (e.g., East/West, if conference data is derivable).
* Purpose: Identify the team with the best balance of offense, defense, and wins.
3. `scoringChart.js` - “Which Player Will Lead the League in Scoring?”
* Engineer 3’s Task: Develop a line chart to predict the scoring leader.
* Description:
    * Plot the top 5 players by average PTS per game over time (using Data as the x-axis).
    * Show trends for the season to date.
    * Data Used: Player, PTS, Data, aggregated by player and sorted by total points.
    * Interactivity: Toggle players on/off with checkboxes; zoom into specific date ranges.
* Purpose: Reveal who’s on track to dominate the scoring title based on consistency and volume.
4. `benchChart.js` - “Which Team Has the Best Bench Strength?”
* Engineer 4’s Task: Design a pie chart to evaluate bench performance.
* Description:
    * Define “bench players” as those with MP < 25 minutes per game (adjustable threshold).
    * Calculate total PTS from bench players per team, then show the top 5 teams’ bench contributions as a pie chart.
    * Data Used: Tm, MP, PTS, filtered for bench players and aggregated by team.
    * Interactivity: Click a slice to show a bar chart of individual bench players’ average PTS and GmSc.
* Purpose: Showcase which team’s reserves could tip the scales in critical games.

Notes for Engineers
* Data Prep: The Python backend should preprocess the dataset into four JSON files (e.g., mvp_data.json, champ_data.json, etc.) tailored to each chart’s needs.
* Control.js: Each engineer should define interaction functions in their file (e.g., handleMVPClick) and hook them into control.js for centralized event handling.
* Collaboration: Ensure chart IDs in index.html match each script (e.g., ).

Next Steps
* Dataset Check: Verify the exact Kaggle dataset (e.g., “2024-2025 NBA Player Stats”) and let me know its identifier if you’ve got it!
* Engineer Kickoff: Want me to provide a starter code snippet for any of the four files (e.g., mvpChart.js with Chart.js setup)?
* Client Feedback: Ready to simulate client input once you’ve got a prototype?
* Hosting: Render or Fly.io
