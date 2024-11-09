const weights = {
    "energy_density": 0.05, "cetane_number": 0.05, "octane_number": 0.05, "flash_point": 0.05,
    "viscosity": 0.05, "sulfur_content": 0.1, "thermal_efficiency": 0.05, "carbon_intensity": 0.15,
    "feedstock_sourcing": 0.05, "water_usage": 0.05, "blending_ratio": 0.05, "carbon_footprint": 0.15,
    "EROI": 0.05, "co2_emissions": 0.05, "nox_emissions": 0.05, "pm_emissions": 0.05,
    "co_emissions": 0.05, "ch4_emissions": 0.05
};

// const weights = {
//     "energy_density": 0.0435, "cetane_number": 0.0435, "octane_number": 0.0435, "flash_point": 0.0435,
//     "viscosity": 0.0435, "sulfur_content": 0.0870, "thermal_efficiency": 0.0435, "carbon_intensity": 0.1304,
//     "feedstock_sourcing": 0.0435, "water_usage": 0.0435, "blending_ratio": 0.0435, "carbon_footprint": 0.1304,
//     "EROI": 0.0435, "co2_emissions": 0.0435, "nox_emissions": 0.0435, "pm_emissions": 0.0435,
//     "co_emissions": 0.0435, "ch4_emissions": 0.0435
// };

const ranges = {
    "energy_density": [0, 35], "cetane_number": [40, 60], "octane_number": [85, 100],
    "flash_point": [40, 60], "viscosity": [1, 4], "sulfur_content": [0, 10],
    "thermal_efficiency": [25, 35], "carbon_intensity": [20, 50], "water_usage": [0, 5],
    "blending_ratio": [0, 50], "carbon_footprint": [0, 80], "EROI": [0, 10],
    "co2_emissions": [0, 100], "nox_emissions": [0, 100], "pm_emissions": [0, 100],
    "co_emissions": [0, 100], "ch4_emissions": [0, 100]
};



const normalizedWeights = {
    "energy_density": 4.35, "cetane_number": 4.35, "octane_number": 4.35, "flash_point": 4.35,
    "viscosity": 4.35, "sulfur_content": 8.7, "thermal_efficiency": 4.35, "carbon_intensity": 13.04,
    "feedstock_sourcing": 4.35, "water_usage": 4.35, "blending_ratio": 4.35, "carbon_footprint": 13.04,
    "EROI": 4.35, "co2_emissions": 4.35, "nox_emissions": 4.35, "pm_emissions": 4.35,
    "co_emissions": 4.35, "ch4_emissions": 4.35
};



function normalize(paramValue, minValue, maxValue, isInverse = false) {
    return isInverse 
        ? Math.max(0, 10 - ((paramValue - minValue) / (maxValue - minValue) * 10)) 
        : Math.max(0, Math.min(10, (paramValue - minValue) / (maxValue - minValue) * 10));
}

let pieChart; // Declare variables to store chart instances
let barChart;

function calculateScore() {
    const form = document.getElementById('score-form');
    const params = {
        energy_density: parseFloat(document.getElementById('energy_density').value),
        cetane_number: parseFloat(document.getElementById('cetane_number').value),
        octane_number: parseFloat(document.getElementById('octane_number').value),
        flash_point: parseFloat(document.getElementById('flash_point').value),
        viscosity: parseFloat(document.getElementById('viscosity').value),
        sulfur_content: parseFloat(document.getElementById('sulfur_content').value),
        thermal_efficiency: parseFloat(document.getElementById('thermal_efficiency').value),
        carbon_intensity: parseFloat(document.getElementById('carbon_intensity').value),
        feedstock_sourcing: parseFloat(document.getElementById('feedstock_sourcing').value),
        water_usage: parseFloat(document.getElementById('water_usage').value),
        blending_ratio: parseFloat(document.getElementById('blending_ratio').value),
        carbon_footprint: parseFloat(document.getElementById('carbon_footprint').value),
        EROI: parseFloat(document.getElementById('EROI').value),
        co2_emissions: parseFloat(document.getElementById('co2_emissions').value),
        nox_emissions: parseFloat(document.getElementById('nox_emissions').value),
        pm_emissions: parseFloat(document.getElementById('pm_emissions').value),
        co_emissions: parseFloat(document.getElementById('co_emissions').value),
        ch4_emissions: parseFloat(document.getElementById('ch4_emissions').value),
        
    };

    const normalizedScores = {};
    let totalScore = 0;

    for (let param in params) {
        const value = params[param];
        const weight = weights[param];

        if (!ranges[param]) {
            console.warn(`Range for parameter '${param}' is not defined.`);
            continue;
        }

        const [min, max] = ranges[param];
        const isInverse = ["viscosity", "sulfur_content", "carbon_intensity", "carbon_footprint", 
                           "co2_emissions", "nox_emissions", "pm_emissions", "co_emissions", 
                           "ch4_emissions"].includes(param);
        const normalizedValue = normalize(value, min, max, isInverse);
        
        normalizedScores[param] = normalizedValue * weight;
        totalScore += normalizedScores[param];
    }

    document.getElementById('total-score').textContent = totalScore.toFixed(2);
    document.getElementById('score-display').classList.remove("hidden");

    const pieLabels = Object.keys(normalizedScores);
    const pieData = Object.values(normalizedScores);

    const pieChartCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy(); // Destroy the previous pie chart instance if it exists
    pieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
            labels: pieLabels,
            datasets: [{
                label: "Parameter Contribution",
                data: pieData,
                backgroundColor: [
                    '#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#95A5A6',
                    '#7B7D7D', '#4D5656', '#5D6D7E', '#839192', '#ABB2B9',
                    '#616A6B', '#566573', '#2E4053', '#1C2833', '#AAB7B8',
                    '#909497', '#4D5656', '#2C3E50'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(2)}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            }
        }
    });

    const barLabels = ["SAF", "Traditional Jet Fuel", "Electric", "Hydrogen", "Hybrid", "Biofuel"];
    const barData = [totalScore, 50, 75, 60, 80, 45];

    const barChartCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy(); // Destroy the previous bar chart instance if it exists
    barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                label: "Fuel Sustainability Score",
                data: barData,
                backgroundColor: '#2C3E50'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Create a table to show coefficients and weights
    const table = document.getElementById('score-table');
    table.innerHTML = `
        <tr>
            <th>Parameter</th>
            <th>Weight</th>
            <th>Normalized Score</th>
        </tr>
    `;

    for (let param in normalizedScores) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${param.replace(/_/g, ' ')}</td>
            <td>${normalizedWeights[param]}%</td>
            <td>${normalizedScores[param].toFixed(2)}</td>
        `;
        table.appendChild(row);
    }
}

