// Bench Strength Chart

let benchChart;
let benchDetailChart;
let benchData = [];

// Initialize the Bench Chart with data
window.initBenchChart = function(data) {
    benchData = data;
    
    // Process data to evaluate bench strength
    const benchStrengthData = calculateBenchStrength(data);
    
    // Create the pie chart for team bench strength
    createBenchPieChart(benchStrengthData);
    
    // Set up the container for the bench detail chart (initially empty)
    setupBenchDetailChartContainer();
};

function calculateBenchStrength(data) {
    // Define bench players as those with < 25 minutes per game
    const BENCH_THRESHOLD = 25;
    
    // Group data by team and calculate bench contributions
    const teamBenchStats = {};
    
    // First, categorize players as starters or bench
    const playerCategories = {};
    data.forEach(game => {
        if (!playerCategories[game.Player]) {
            playerCategories[game.Player] = {
                totalMP: 0,
                games: 0
            };
        }
        
        playerCategories[game.Player].totalMP += game.MP;
        playerCategories[game.Player].games++;
    });
    
    // Determine if each player is a bench player
    Object.keys(playerCategories).forEach(player => {
        const avgMP = playerCategories[player].totalMP / playerCategories[player].games;
        playerCategories[player].isBench = avgMP < BENCH_THRESHOLD;
    });
    
    // Calculate bench points by team
    data.forEach(game => {
        const team = game.Tm;
        const isBenchPlayer = playerCategories[game.Player].isBench;
        
        if (!teamBenchStats[team]) {
            teamBenchStats[team] = {
                benchPTS: 0,
                totalPTS: 0,
                benchPlayers: {}
            };
        }
        
        teamBenchStats[team].totalPTS += game.PTS;
        
        if (isBenchPlayer) {
            teamBenchStats[team].benchPTS += game.PTS;
            
            if (!teamBenchStats[team].benchPlayers[game.Player]) {
                teamBenchStats[team].benchPlayers[game.Player] = {
                    totalPTS: 0,
                    totalGmSc: 0,
                    games: 0
                };
            }
            
            teamBenchStats[team].benchPlayers[game.Player].totalPTS += game.PTS;
            teamBenchStats[team].benchPlayers[game.Player].totalGmSc += game.GmSc;
            teamBenchStats[team].benchPlayers[game.Player].games++;
        }
    });
    
    // Calculate bench contribution percentage and prepare data for chart
    const benchStrength = Object.keys(teamBenchStats).map(team => {
        const stats = teamBenchStats[team];
        const benchContributionPct = (stats.benchPTS / stats.totalPTS) * 100;
        
        return {
            team,
            benchContributionPct,
            benchPlayers: Object.keys(stats.benchPlayers).map(player => {
                const playerStats = stats.benchPlayers[player];
                return {
                    player,
                    avgPTS: playerStats.totalPTS / playerStats.games,
                    avgGmSc: playerStats.totalGmSc / playerStats.games
                };
            })
        };
    });
    
    // Sort by bench contribution percentage and take top 5
    return benchStrength.sort((a, b) => b.benchContributionPct - a.benchContributionPct).slice(0, 5);
}

function createBenchPieChart(data) {
    const ctx = document.getElementById('benchChart').getContext('2d');
    
    benchChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(d => d.team),
            datasets: [{
                data: data.map(d => d.benchContributionPct),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)}% bench contribution`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Top 5 Teams with Highest Bench Contribution'
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const teamName = data[index].team;
                    showBenchDetailChart(teamName, data[index].benchPlayers);
                    window.handleBenchPieClick(teamName);
                }
            }
        }
    });
}

function setupBenchDetailChartContainer() {
    const detailChartElement = document.getElementById('benchDetailChart');
    detailChartElement.innerHTML = '<canvas id="teamBenchDetailChart"></canvas>';
}

function showBenchDetailChart(teamName, benchPlayers) {
    const detailChartElement = document.getElementById('benchDetailChart');
    detailChartElement.style.display = 'block';
    
    if (benchDetailChart) {
        benchDetailChart.destroy();
    }
    
    // Sort bench players by average points
    const sortedPlayers = benchPlayers.sort((a, b) => b.avgPTS - a.avgPTS);
    
    const ctx = document.getElementById('teamBenchDetailChart').getContext('2d');
    
    benchDetailChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedPlayers.map(p => p.player),
            datasets: [
                {
                    label: 'Avg Points',
                    data: sortedPlayers.map(p => p.avgPTS),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Avg Game Score',
                    data: sortedPlayers.map(p => p.avgGmSc),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${teamName} Bench Player Statistics`
                }
            }
        }
    });
}
