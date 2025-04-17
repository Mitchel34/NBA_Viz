// Trade Impact Chart - Luka Doncic and Anthony Davis

let pointsMinutesChart;
let recordChart;
let tradeImpactData = [];
let selectedTeam = null;
let selectedPlayer = null;

// Team colors
const teamColors = {
    'LAL': {
        primary: 'rgba(85, 37, 130, 0.8)',    // Lakers purple
        secondary: 'rgba(253, 185, 39, 0.8)'  // Lakers gold
    },
    'DAL': {
        primary: 'rgba(0, 83, 188, 0.8)',     // Mavericks blue
        secondary: 'rgba(0, 43, 92, 0.8)'     // Mavericks navy
    }
};

// Initialize the Trade Impact Chart with data
window.initTradeImpactChart = function(data) {
    tradeImpactData = data;
    console.log("Trade impact data loaded:", data);

    // Create the stacked bar chart showing points and minutes
    createPointsMinutesChart(data.playerStats);

    // Create the record line chart
    createRecordLineChart(data.teamRecords, data.tradeDate);

    // Set up filter options (only for these two players)
    setupFilterOptions(data.playerStats);
    
    // Add title to clarify the date range
    const container = document.getElementById('tradeImpactContainer');
    if (container) {
        const dateInfo = document.createElement('div');
        dateInfo.className = 'date-info';
        dateInfo.textContent = `Performance data after ${new Date(data.tradeDate).toLocaleDateString()}`;
        dateInfo.style.textAlign = 'center';
        dateInfo.style.fontSize = '0.8rem';
        dateInfo.style.fontStyle = 'italic';
        dateInfo.style.color = '#666';
        dateInfo.style.marginBottom = '0.5rem';
        container.prepend(dateInfo);
    }
};

function createPointsMinutesChart(playerData) {
    const ctx = document.getElementById('pointsMinutesChart').getContext('2d');
    
    // Deduplicate to ensure there's only one Luka entry
    let uniquePlayers = [];
    let lukaData = null;

    // Filter for just Luka and Anthony Davis and handle duplicates
    playerData.forEach(player => {
        const name = player.player.toLowerCase();
        if (name.includes('luka')) {
            // Standardize to just "Luka Doncic" regardless of accents
            if (!lukaData) {
                player.player = "Luka Doncic";
                lukaData = player;
            }
        } else if (name.includes('anthony davis')) {
            uniquePlayers.push(player);
        }
    });

    // Add Luka's data if it exists
    if (lukaData) {
        uniquePlayers.unshift(lukaData);
    }

    pointsMinutesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: uniquePlayers.map(p => p.player),
            datasets: [
                {
                    label: 'Points Per Game',
                    data: uniquePlayers.map(p => p.ppg),
                    backgroundColor: uniquePlayers.map(p => teamColors[p.team].primary),
                    borderColor: uniquePlayers.map(p => teamColors[p.team].primary.replace('0.8', '1')),
                    borderWidth: 1
                },
                {
                    label: 'Minutes Per Game',
                    data: uniquePlayers.map(p => p.mpg),
                    backgroundColor: uniquePlayers.map(p => teamColors[p.team].secondary),
                    borderColor: uniquePlayers.map(p => teamColors[p.team].secondary.replace('0.8', '1')),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Luka Doncic vs Anthony Davis - Performance Comparison'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const playerData = uniquePlayers[context.dataIndex];
                            return [
                                `Team: ${playerData.team}`,
                                `Games: ${playerData.games}`,
                                `FG%: ${(playerData.fgPct * 100).toFixed(1)}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: 'Points / Minutes' } 
                },
                x: { 
                    title: { display: true, text: 'Player' } 
                }
            }
        }
    });
}

function createRecordLineChart(teamRecords, tradeDate) {
    const ctx = document.getElementById('recordChart').getContext('2d');
    
    // Filter to only include Lakers and Mavericks records after the trade date
    const lakersData = teamRecords
        .filter(r => r.team === 'LAL' && new Date(r.date) >= new Date(tradeDate))
        .map(r => ({ x: new Date(r.date), y: r.wins / r.games }));
    
    const mavsData = teamRecords
        .filter(r => r.team === 'DAL' && new Date(r.date) >= new Date(tradeDate))
        .map(r => ({ x: new Date(r.date), y: r.wins / r.games }));

    recordChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                { 
                    label: 'Lakers (Luka Doncic)', // Removed accent mark
                    data: lakersData, 
                    borderColor: teamColors.LAL.primary,
                    backgroundColor: teamColors.LAL.primary.replace('0.8', '0.2'),
                    tension: 0.2
                },
                { 
                    label: 'Mavericks (Anthony Davis)', // UPDATED: Davis now on Mavericks
                    data: mavsData, 
                    borderColor: teamColors.DAL.primary,
                    backgroundColor: teamColors.DAL.primary.replace('0.8', '0.2'),
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Team Performance After Feb 1, 2025 Trade' // UPDATED: Clarified this is post-trade
                }
            },
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
                    title: { display: true, text: 'Date' } 
                },
                y: { 
                    title: { display: true, text: 'Win Percentage' },
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            }
        }
    });
}

function setupFilterOptions(playerData) {
    const container = document.getElementById('playerFilter');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Add a heading
    const heading = document.createElement('h3');
    heading.textContent = 'Compare Players:';
    heading.style.fontSize = '0.8rem';
    heading.style.marginRight = '0.5rem';
    container.appendChild(heading);
    
    // Deduplicate players for filter buttons
    let addedLuka = false;
    const deduplicatedPlayers = [];
    
    playerData.forEach(player => {
        const name = player.player.toLowerCase();
        if (name.includes('luka') && !addedLuka) {
            player.player = "Luka Doncic";
            deduplicatedPlayers.push(player);
            addedLuka = true;
        } else if (name.includes('anthony davis')) {
            deduplicatedPlayers.push(player);
        }
    });
    
    // Create buttons for each player
    deduplicatedPlayers.forEach(player => {
        const button = document.createElement('button');
        button.textContent = player.player.split(' ')[0]; // Show first name only
        button.style.backgroundColor = teamColors[player.team].primary;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '3px 8px';
        button.style.borderRadius = '4px';
        button.style.fontSize = '0.7rem';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            highlightPlayer(player.player, player.team);
            if (window.handleTradeImpactSelection) {
                window.handleTradeImpactSelection(player.player, player.team);
            }
        });
        
        container.appendChild(button);
    });
}

function highlightPlayer(playerName, teamCode) {
    selectedPlayer = playerName;
    selectedTeam = teamCode;
    pointsMinutesChart.update();
    recordChart.update();
}

function highlightTeam(teamCode) {
    selectedTeam = teamCode;
    pointsMinutesChart.update();
    recordChart.update();
}
