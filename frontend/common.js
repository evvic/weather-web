console.log("Loading common.js...");

/*
    Load navbar to #navbar-element
*/

const navbarHtml = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="/">Navbar</a>
        <ul class="navbar-nav">
            <li class="nav-item active">
                 <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/graph.html">Graphing</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/latest_values.html">Latest Values</a>
            </li>
            <li class="nav-item">
                  <a class="nav-link" href="/datadump.html">Datadump</a>
            </li>
        </ul>
 
</nav>
`;

const navbarElement = document.getElementById("navbar-element");
navbarElement.innerHTML=navbarHtml;
/*
    Navbar ends
*/

/////////////////////////////////////////////
//      Cleanup data types functions below
/////////////////////////////////////////////

function datatypeToOfficial(datatype) {
    if(datatype == "temperature") {
        return "Temperature";
    }
    if(datatype == "wind_speed") {
        return "Wind Speed";
    }
    if(datatype == "wind_direction") {
        return "Wind Direction";
    }
    if(datatype == "humidity_in") {
        return "Humidity In";
    }
    if(datatype == "humidity_out") {
        return "Humidity Out";
    }
    if(datatype == "light") {
        return "Light";
    }
    if (datatype == "rain") {
        return "Rain";
    }
}

function datatypeToColor(datatype) {
    if(datatype == "temperature") {
        return 'rgba(255, 154, 162, 0.6)'; //reddish?
    }
    if(datatype == "wind_speed") {
        return 'rgba(181, 234, 215, 0.6)'; //Magic Mint
    }
    if(datatype == "wind_direction") {
        return 'rgba(226, 240, 203, 0.6)'; //Dirty White
    }
    if(datatype == "humidity_in") {
        return 'rgba(255, 218, 193, 0.6)'; //Very Pale Orange
    }
    if(datatype == "humidity_out") {
        return 'rgba(255, 183, 178, 0.6)'; //Melon
    }
    if(datatype == "light") {
        //return 'rgba(255, 255, 216, 0.6)'; //Light Yellow
        return 'rgba(253, 253, 175, 0.8)'; //Patel Yellow (more visible)
    }
    if (datatype == "rain") {
        return 'rgba(173, 216, 230, 0.6)'; //Light Blue
    }
}

function datatypeToUnit(datatype) { //returns appropriate unit of datatype
    if(datatype == "temperature") {
        return "(Celsius) °C";
    }
    if(datatype == "wind_speed") {
        return "km/h";
    }
    if(datatype == "wind_direction") {
        return "(degrees) °";
    }
    if(datatype == "humidity_in") {
        return "(grams of water vapor per kg of air) g.kg-1";
    }
    if(datatype == "humidity_out") {
        return "(grams of water vapor per kg of air) g.kg-1";
    }
    if(datatype == "light") {
        return "lx (Lux)";
    }
    if (datatype == "rain") {
        return "mm/h (millimeters/hour)";
    }
}

function returnFormattedHour(index) {
    /*
        THIS WORKS!
        BUT, CHECK THE TABLE SYNCHRONIZATION, WILL PROBABLY NEED TO 
        PASS labelVal and parse date out of the string to be most accurate
    */
    var d = new Date();
    var n = d.getHours();

    var adjHour =  n - (document.getElementById("interval").value - index);

    while(adjHour < 0) {
        adjHour += 24;
    }

    return adjHour + ":00";
}

///////////////////////////////////////////////////////
//      Chart.js setup below
///////////////////////////////////////////////////////

function addData(index, labelVal, dataVal) {
    ///https://www.youtube.com/watch?v=De-zusP8QVM

    weatherChart.data.datasets[0].data[index] = dataVal;
    
    if(index == document.getElementById("interval").value) {
        weatherChart.data.labels[index] = 'LIVE NOW';
    }
    else {
        //weatherChart.data.labels[index] =  returnFormattedHour(index);
        weatherChart.data.labels[index] = `${document.getElementById("interval").value - index}:00`; //"11:00 AM";
    }
    
    weatherChart.update();
    console.log("addData() updated...");
}

function resetData() {
    console.log("resetData()");
    weatherChart.data.datasets[0].data = [];
    weatherChart.data.labels = [];
}

function updateWeatherChart() {
    console.log("updateWeatherChart()");

    //update datasets -> label, background color & border color
    weatherChart.data.datasets[0].label = `${document.getElementById("datatype").value} values`;
    weatherChart.data.datasets[0].backgroundColor = datatypeToColor(document.getElementById("datatype").value);
    weatherChart.data.datasets[0].hoverBorderColor = datatypeToColor(document.getElementById("datatype").value);

    //update options -> Title Text
    weatherChart.options.title.text = `${datatypeToOfficial(document.getElementById("datatype").value)} Over ${document.getElementById("interval").value} Hours`;
    weatherChart.options.scales.yAxes[0].scaleLabel.labelString = datatypeToUnit(document.getElementById("datatype").value);

    weatherChart.update();
}

var canvas = document.getElementById('mychart');

var data = {
    labels : [],
    datasets: [
        {
            lineTension: 0.3,
            label:`${document.getElementById("datatype").value} values`,
            data : [],

            backgroundColor:datatypeToColor(document.getElementById("datatype").value), //cahnegs all bar colors
            hoverBorderWidth:10,
            hoverBorderColor:datatypeToColor(document.getElementById("datatype").value),
        }
    ]
};

var options = {
    showLines: true,
    responsive: true,
    title:{
        display:true,
        text:`${datatypeToOfficial(document.getElementById("datatype").value)} Over ${document.getElementById("interval").value} Hours`, 
        fontSize:30
    },
    legend:{
        display:true, //false doesn't display legend
        position:'top',
        labels:{
            fontColor:'#420'
        }
    },
    layout:{
        padding:{
            left:15, //adds whitespace pixels to the left
            right:15,
            bottom:15,
            top:15,
        }
    },
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: datatypeToUnit(document.getElementById("datatype").value)
            }
        }],
        xAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Hours (past to current)'
            }
        }]
    },
    tooltips:{
        enabled:true
    }
};

// Create weatherChart with defaults, empty
var weatherChart = Chart.Line(canvas,{
    data:data,
    options:options,
});