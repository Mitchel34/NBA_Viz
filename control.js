// Central interaction logic for NBA visualization

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application when the DOM is fully loaded
    initializeApp();
});

function initializeApp() {
    // Set up event listeners for cross-chart interactions
    setupEventListeners();
    
    // Load data for all charts
    loadAllData();
}

function setupEventListeners() {
    // Conference filter for championship chart
    const conferenceSelect = document.getElementById('conferenceSelect');
    if (conferenceSelect) {
        conferenceSelect.addEventListener('change', function() {
            window.filterChampChartByConference(this.value);
        });
    }
}

function loadAllData() {
    // Fetch all the required JSON data files
    Promise.all([
        fetch('data/mvp_data.json').then(response => response.json()),
        fetch('data/champ_data.json').then(response => response.json()),
        fetch('data/scoring_data.json').then(response => response.json()),
        fetch('data/bench_data.json').then(response => response.json())
    ])
    .then(([mvpData, champData, scoringData, benchData]) => {
        // Initialize all charts with their respective data
        if (window.initMVPChart) window.initMVPChart(mvpData);
        if (window.initChampChart) window.initChampChart(champData);
        if (window.initScoringChart) window.initScoringChart(scoringData);
        if (window.initBenchChart) window.initBenchChart(benchData);
        
        console.log('All charts initialized successfully');
    })
    .catch(error => {
        console.error('Error loading data:', error);
        document.body.innerHTML += `
            <div style="color: red; text-align: center; padding: 20px;">
                Error loading data. Please make sure the server is running and data files are available.
            </div>
        `;
    });
}

// Global handler functions that can be called from individual chart files
window.handleMVPBarClick = function(playerName) {
    console.log(`MVP bar clicked for player: ${playerName}`);
    // This function will be implemented in mvpChart.js but is referenced here
};

window.handleChampBubbleHover = function(teamData) {
    console.log(`Championship bubble hovered for team: ${teamData.team}`);
    // This function will be implemented in champChart.js but is referenced here
};

window.handleScoringToggle = function(playerName, isActive) {
    console.log(`Scoring toggle for ${playerName}: ${isActive}`);
    // This function will be implemented in scoringChart.js but is referenced here
};

window.handleBenchPieClick = function(teamName) {
    console.log(`Bench pie slice clicked for team: ${teamName}`);
    // This function will be implemented in benchChart.js but is referenced here
};
