// MVP Prediction Chart

let mvpChart;
let mvpDetailChart;
let mvpData = [];

// Initialize the MVP Chart with data
window.initMVPChart = function(data) {
    mvpData = data;
    
    // Calculate MVP scores for each player
    const processedData = calculateMVPScores(data);
    
    // Create the main bar chart
    createMVPBarChart(processedData);
    
    // Set up the container for the detail chart (initially empty)
    setupDetailChartContainer();
};

function calculateMVPScores(data) {
    // Group by player and calculate the average MVP score
    const playerStats = {};
    
    data.forEach(game => {
        if (!playerStats[game.Player]) {
            playerStats[game.Player] = {
                games: 0,
                totalPTS: 0,
                totalAST: 0,
                totalTRB: 0,
                totalGmSc: 0,
                gameScores: [] // Store individual game scores for the detail chart
            };
        }
        
        playerStats[game.Player].games++;
        playerStats[game.Player].totalPTS += game.PTS;
        playerStats[game.Player].totalAST += game.AST;
        playerStats[game.Player].totalTRB += game.TRB;
        playerStats[game.Player].totalGmSc += game.GmSc;
        
        // Store the game score with date for the detail chart
        playerStats[game.Player].gameScores.push({
            date: game.Date,
            score: game.GmSc
        });
    });
    
    // Calculate MVP score and average stats
    const mvpScores = Object.keys(playerStats).map(player => {
        const stats = playerStats[player];
        const avgPTS = stats.totalPTS / stats.games;
        const avgAST = stats.totalAST / stats.games;
        const avgTRB = stats.totalTRB / stats.games;
        const avgGmSc = stats.totalGmSc / stats.games;
        
        // MVP Score formula: PTS * 0.4 + AST * 0.3 + TRB * 0.2 + GmSc * 0.1
        const mvpScore = (avgPTS * 0.4) + (avgAST * 0.3) + (avgTRB * 0.2) + (avgGmSc * 0.1);
        
        return {
            player,
            mvpScore,
            avgPTS,
            avgAST,
            avgTRB,
            avgGmSc,
            gameScores: stats.gameScores.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10) // Last 10 games
        };
    });
    
    // Sort by MVP score and take the top 10
    return mvpScores.sort((a, b) => b.mvpScore - a.mvpScore).slice(0, 10);
}

function createMVPBarChart(data) {
    const ctx = document.getElementById('mvpChart').getContext('2d');
    
    mvpChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.player),
            datasets: [{
                label: 'MVP Score',
                data: data.map(d => d.mvpScore),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'MVP Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Player'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const playerData = data[context.dataIndex];
                            return [
                                `PTS: ${playerData.avgPTS.toFixed(1)}`,
                                `AST: ${playerData.avgAST.toFixed(1)}`,
                                `TRB: ${playerData.avgTRB.toFixed(1)}`,
                                `GmSc: ${playerData.avgGmSc.toFixed(1)}`
                            ];
                        }
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const playerName = data[index].player;
                    showPlayerDetailChart(playerName, data[index].gameScores);
                    window.handleMVPBarClick(playerName);
                }
            }
        }
    });
}

function setupDetailChartContainer() {
    const detailChartElement = document.getElementById('mvpDetailChart');
    detailChartElement.innerHTML = '<canvas id="playerDetailChart"></canvas>';
}

function showPlayerDetailChart(playerName, gameScores) {
    const detailChartElement = document.getElementById('mvpDetailChart');
    detailChartElement.style.display = 'block';
    
    if (mvpDetailChart) {
        mvpDetailChart.destroy();
    }
    
    const ctx = document.getElementById('playerDetailChart').getContext('2d');
    
    mvpDetailChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: gameScores.map(g => g.date),
            datasets: [{
                label: `${playerName} - Game Score (Last 10 Games)`,
                data: gameScores.map(g => g.score),
                fill: false,
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1,
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Game Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Game Date'
                    }
                }
            }
        }
    });
}
