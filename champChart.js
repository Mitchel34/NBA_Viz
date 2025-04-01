// Championship Prediction Chart

let champChart;
let champData = [];
let filteredChampData = [];

// Initialize the Championship Chart with data
window.initChampChart = function(data) {
    champData = data;
    filteredChampData = [...data]; // Initially, all data is shown
    
    // Create the bubble chart
    createChampBubbleChart();
};

// Filter the championship chart by conference
window.filterChampChartByConference = function(conference) {
    if (conference === 'all') {
        filteredChampData = [...champData];
    } else {
        filteredChampData = champData.filter(team => team.conference.toLowerCase() === conference);
    }
    
    updateChampChart();
};

function createChampBubbleChart() {
    const ctx = document.getElementById('champChart').getContext('2d');
    
    champChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Teams',
                data: prepareChampChartData(filteredChampData),
                backgroundColor: function(context) {
                    const value = context.raw.winPct;
                    return value > 0.6 ? 'rgba(75, 192, 192, 0.6)' : 
                           value > 0.5 ? 'rgba(54, 162, 235, 0.6)' : 
                           'rgba(255, 99, 132, 0.6)';
                },
                borderColor: function(context) {
                    const value = context.raw.winPct;
                    return value > 0.6 ? 'rgba(75, 192, 192, 1)' : 
                           value > 0.5 ? 'rgba(54, 162, 235, 1)' : 
                           'rgba(255, 99, 132, 1)';
                },
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Points Scored Per Game'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Points Allowed Per Game'
                    },
                    reverse: true // Lower is better for points allowed
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const teamData = context.raw;
                            return [
                                `Team: ${teamData.team}`,
                                `Win%: ${(teamData.winPct * 100).toFixed(1)}%`,
                                `Points Scored: ${teamData.x.toFixed(1)}`,
                                `Points Allowed: ${teamData.y.toFixed(1)}`
                            ];
                        }
                    }
                }
            },
            onHover: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const teamData = champChart.data.datasets[0].data[index];
                    window.handleChampBubbleHover(teamData);
                }
            }
        }
    });
}

function prepareChampChartData(data) {
    return data.map(team => ({
        x: team.avgPointsScored,
        y: team.avgPointsAllowed,
        r: team.winPct * 20, // Size based on win percentage
        team: team.team,
        winPct: team.winPct,
        conference: team.conference
    }));
}

function updateChampChart() {
    champChart.data.datasets[0].data = prepareChampChartData(filteredChampData);
    champChart.update();
}
