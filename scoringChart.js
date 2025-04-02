// Scoring Leader Chart

let scoringChart;
let scoringData = [];
let activePlayerFilters = {};

// Initialize the Scoring Chart with data
window.initScoringChart = function(data) {
    scoringData = data;
    
    // Format dates properly - convert string dates to Date objects
    scoringData.forEach(game => {
        if (typeof game.Date === 'string') {
            game.Date = new Date(game.Date);
        }
    });
    
    // Get the top 5 scoring players
    const topScoringPlayers = getTopScoringPlayers(data, 5);
    
    // Initialize all players as active
    topScoringPlayers.forEach(player => {
        activePlayerFilters[player] = true;
    });
    
    // Create the player toggle checkboxes
    createPlayerToggleOptions(topScoringPlayers);
    
    // Create the scoring line chart
    createScoringLineChart(topScoringPlayers);
};

function getTopScoringPlayers(data, count) {
    // Group data by player and calculate average points
    const playerScoring = {};
    
    data.forEach(game => {
        if (!playerScoring[game.Player]) {
            playerScoring[game.Player] = {
                totalPTS: 0,
                games: 0
            };
        }
        
        playerScoring[game.Player].totalPTS += game.PTS;
        playerScoring[game.Player].games++;
    });
    
    // Calculate average PTS and sort players
    const sortedPlayers = Object.keys(playerScoring).map(player => ({
        player,
        avgPTS: playerScoring[player].totalPTS / playerScoring[player].games
    }))
    .sort((a, b) => b.avgPTS - a.avgPTS)
    .slice(0, count);
    
    return sortedPlayers.map(p => p.player);
}

function createPlayerToggleOptions(players) {
    const container = document.getElementById('playerToggle');
    if (!container) return;
    
    container.innerHTML = '';
    
    players.forEach(player => {
        const label = document.createElement('label');
        label.className = 'player-toggle';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.addEventListener('change', function() {
            togglePlayerData(player, this.checked);
        });
        
        const colorSpan = document.createElement('span');
        colorSpan.className = 'color-dot';
        colorSpan.style.backgroundColor = getPlayerColor(player);
        
        label.appendChild(checkbox);
        label.appendChild(colorSpan);
        label.appendChild(document.createTextNode(player));
        
        container.appendChild(label);
    });
}

function createScoringLineChart(players) {
    const ctx = document.getElementById('scoringChart').getContext('2d');
    
    const datasets = players.map(player => {
        const playerData = processPlayerScoringData(player);
        return {
            label: player,
            data: playerData,
            backgroundColor: getPlayerColor(player),
            borderColor: getPlayerColor(player),
            pointRadius: 2,
            tension: 0.2
        };
    });
    
    scoringChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'MMM d, yyyy',
                        displayFormats: {
                            day: 'MMM d'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Game Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Points'
                    },
                    suggestedMin: 0
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const date = new Date(context[0].parsed.x);
                            return date.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            });
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

function processPlayerScoringData(playerName) {
    return scoringData
        .filter(game => game.Player === playerName)
        .sort((a, b) => new Date(a.Date) - new Date(b.Date))
        .map(game => ({
            x: game.Date,
            y: game.PTS
        }));
}

function getPlayerColor(playerName) {
    // Generate a deterministic color based on player name
    let hash = 0;
    for (let i = 0; i < playerName.length; i++) {
        hash = playerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const playerColors = {
        'LeBron James': 'rgba(85, 37, 130, 0.8)',       // Lakers purple
        'Kevin Durant': 'rgba(229, 95, 32, 0.8)',       // Suns orange
        'Giannis Antetokounmpo': 'rgba(0, 71, 27, 0.8)', // Bucks green
        'Stephen Curry': 'rgba(29, 66, 138, 0.8)',      // Warriors blue
        'Nikola Jokić': 'rgba(13, 34, 64, 0.8)',        // Nuggets blue
        'Luka Dončić': 'rgba(0, 83, 188, 0.8)',         // Mavericks blue
        'Joel Embiid': 'rgba(237, 23, 76, 0.8)',        // 76ers red
        'Jayson Tatum': 'rgba(0, 122, 51, 0.8)',        // Celtics green
        'Donovan Mitchell': 'rgba(134, 0, 56, 0.8)',    // Cavaliers wine
        'Shai Gilgeous-Alexander': 'rgba(0, 125, 195, 0.8)' // Thunder blue
    };
    
    // Use predefined color or generate one
    return playerColors[playerName] || `hsl(${hash % 360}, 70%, 50%)`;
}

function togglePlayerData(playerName, isActive) {
    activePlayerFilters[playerName] = isActive;
    
    // Find the dataset index
    const datasetIndex = scoringChart.data.datasets.findIndex(
        dataset => dataset.label === playerName
    );
    
    if (datasetIndex > -1) {
        scoringChart.data.datasets[datasetIndex].hidden = !isActive;
        scoringChart.update();
    }
    
    // Call global handler if defined
    if (window.handleScoringToggle) {
        window.handleScoringToggle(playerName, isActive);
    }
}
