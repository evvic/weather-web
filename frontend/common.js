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
                  <a class="nav-link" href="/last500.html">Last 500</a>
            </li>
            <li class="nav-item">
                  <a class="nav-link" href="/datadump.html">Datadump</a>
            </li>
            
            <li class="nav-item">
                  <a class="nav-link" href="/temp.html">-temp-</a>
            </li>
            
        </ul>
        
</nav>
`;

const navbarElement = document.getElementById("navbar-element");
navbarElement.innerHTML=navbarHtml;

/*
    Navbar ends
*/

/*
    Footer starts
*/

const footerHtml = `
<footer  style="background-color: #EAEDED">
    <div class="container">
        <!-- Copyright -->
        <div class="footer-copyright text-center py-3 text-black-50">Eric Brown 2020 
            <a target="_blank" href="https://github.com/evvic" class="text-info">GitHub</a>
        </div>
        <!-- Copyright -->
    </div>
</footer>
`;

const footerElement = document.getElementById("footer-element");
footerElement.innerHTML=footerHtml;

/*
    Footer ends
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
        return "°C (Celsius)";
    }
    if(datatype == "wind_speed") {
        return "km/h";
    }
    if(datatype == "wind_direction") {
        return "° (degrees)";
    }
    if(datatype == "humidity_in") {
        return "g.kg-1 (grams of water vapor per kg of air)";
    }
    if(datatype == "humidity_out") {
        return "g.kg-1 (grams of water vapor per kg of air)";
    }
    if(datatype == "light") {
        return "lx (Lux)";
    }
    if (datatype == "rain") {
        return "mm/h (millimeters/hour)";
    }
}

function formatTableDate(timeVal) {
    var date = new Date(timeVal);

    const shortMonths = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]

    const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ]

    //format mins with correct :00
    if(date.getMinutes() < 10) { var mins = "0" + date.getMinutes(); }
    else { var mins = date.getMinutes(); }

    //format secs with correct :00
    if(date.getSeconds() < 10) { var secs = "0" + date.getSeconds(); }
    else { var secs = date.getSeconds(); }

    var forDate = `${date.getHours()}:${mins}:${secs} ${days[date.getDay()]} ${shortMonths[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    return forDate;
}

function formattedInterval(interval) {

}

/////////////////////////////////////////
//      JSON time reformatted
/////////////////////////////////////////

function returnFormattedHour(jsonTime) {
        // JSON encoded date
    var json = "2020-04-25T11:07:48.404Z";
    console.log(json);

    //var dateStr = JSON.parse(json);  
    //console.log(dateStr); // 2014-01-01T23:28:56.782Z
            
    var date = new Date(json);
    console.log(date);
    console.log("Hour: " + date.getHours());  // Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time)
    console.log("Day of the month (1-31): " + date.getDate());
    console.log("Month  (0-11): " + date.getMonth());
    console.log("Minutes: " + date.getMinutes());
}

///////////////////////////////////////////////////////
//      Chart.js setup below
///////////////////////////////////////////////////////

function formatLabelString(interval) {
    //labelling x-axis

    // "now" interval
    if(interval == 0) {
        console.log("interval == " + interval + "     in formatLabelString");
        return 'Time in hours (past to current)';
    }
    // less than a week intervals
    else if(interval < 168 && interval > 0) {
        console.log("interval == " + interval + "      in formatLabelString");
        return 'Hours (past to current)';
    }
    // week or over intervals
    else {
        console.log("interval == " + interval + "      in formatLabelString");
        return 'Hours & Days (past to current)';
    }

}

function formatChartTitle(datatype, interval) {
    //displays a different title depending on interval (esp. if interval = now)

    const formalDataType = datatypeToOfficial(datatype);

    var inter;

    // "Now" title
    if(interval == 0) {
        inter = "Last 20 Values";
    }
    // regular interval title
    else if(interval > 0 && interval < 168) {
        inter = `${interval} Hours`;
    }
    else {
        inter = `${interval / 24} Days`;
    }

    console.log(`${formalDataType} Over ${inter}`);
    return `${formalDataType} Over ${inter}`;
}

function formatChartTimeAxis(timeVal, interval) {
    // 15:00 Tue Jan

    const shortMonths = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]

      const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ]

    var date = new Date(timeVal);

    //console.log(date);
    //console.log("Hour: " + date.getHours());  // Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time)
    //console.log("Day of the month (1-31): " + date.getDate());
    //console.log("Month  (0-11): " + date.getMonth());
    //console.log("Minutes: " + date.getMinutes());
    var UTC_offset = date.getTimezoneOffset() / 60; //originally gives offset in mins, convert to hours

    //format mins with correct :00
    if(date.getMinutes() < 10) { var mins = "0" + date.getMinutes(); }
    else { var mins = date.getMinutes(); }

    var strDate = date.getHours() + ":" + mins + " " + days[date.getDay()];

    //if interval >= week, also display month
    if(interval >= 168)  { 
        //168 = weeks in hours
        strDate = strDate +  " " + shortMonths[date.getMonth()];
    }

    return strDate;
}

function addData(index, timeVal, dataVal) {
    ///https://www.youtube.com/watch?v=De-zusP8QVM

    var interval = document.getElementById("interval").value

    //  Y-axis (data value)
    weatherChart.data.datasets[0].data[index] = dataVal;

    //  X-axis (time)
    weatherChart.data.labels[index] = formatChartTimeAxis(timeVal, interval);
    
    weatherChart.update();
    // console.log("addData() updated...");
}

function resetData() {
    console.log("resetData()");
    weatherChart.data.datasets[0].data = [];
    weatherChart.data.labels = [];
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateWeatherChart() {
    console.log("updateWeatherChart()");

    //update datasets -> label, background color & border color
    weatherChart.data.datasets[0].label = `${document.getElementById("datatype").value} values`;
    weatherChart.data.datasets[0].backgroundColor = datatypeToColor(document.getElementById("datatype").value);
    weatherChart.data.datasets[0].hoverBorderColor = datatypeToColor(document.getElementById("datatype").value);

    //update options -> Title Text
    weatherChart.options.title.text = formatChartTitle(document.getElementById("datatype").value, document.getElementById("interval").value);
    weatherChart.options.scales.yAxes[0].scaleLabel.labelString = datatypeToUnit(document.getElementById("datatype").value);
    weatherChart.options.scales.xAxes[0].scaleLabel.labelString = formatLabelString(document.getElementById("interval").value);

    weatherChart.update();
}
