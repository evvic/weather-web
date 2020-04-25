console.log("Loading graph.js...");

// initiazlization
const getDataModern = async () => {
    console.log("In getDataModern()");

    resetData(); //clears data and labels from chart
    updateWeatherChart();

    //get weather datatype
    const datatype = document.getElementById("datatype").value;

    //get time interval (in hours)
    const interval = document.getElementById("interval").value;

    // Find the first <tbody> element on the page
    const tableBody = document.getElementsByTagName("tbody")[0];
    // Define an asynchronous function using arrow syntax

    //remove old data from table    
    $("tbody").children().remove();

    console.log("going to fetch json data... " + interval + " hours of " + datatype);
    //fetch data using modern Fetch api
    const data = await fetch(`http://webapi19sa-1.course.tamk.cloud/v1/weather/${datatype}/${interval}`);
    //keyword 'await' can only be used inside async function

    //get actual JSON data 
    const dataJson = await data.json();
    //.json() is an async funciton

    console.log("dataJson", dataJson);

    //last count
    var index = 0; //counts time & data separately
    var i = 0;     //counts time & data together (half as fast)

    //variables that are passed into addData()
    var dataVal; 
    var timeVal;

    console.log("Entering 1st for loop getDataModern()");
    //'for of' loop for iterating dataJson
    for (rowData of dataJson) {
        //Insert new row to table
        const newRow = tableBody.insertRow(-1); // default is -1
        //(-1) is so each next row of data won't be added OVER another row, with -1 it will be put at the end of the table

        const cellKeys = Object.keys(rowData); //Output: ["id", "device_id", "date_time", "data"]

        // making data type name in table
            const dataname = datatypeToOfficial(datatype); //change to more formal style
            const newCell = newRow.insertCell(-1);
            newCell.textContent = dataname;

        for(cellKey of cellKeys) {
            
            //let dataArr = []; //array for grabbing data tp put in graph
            const newCell = newRow.insertCell(-1); //(-1) want to insert at the end of the row

            switch(cellKey) {
                //If data cell, dig key&value from sub object
                case "data":
                    const key = Object.keys(rowData[cellKey])[0];

                    console.log("case: data");
                    //array for graph

                    const value = rowData[cellKey][key];
                    newCell.textContent = `${key}: ${value}`;

                    break;
                //for other cells, copy the value to the cell
                default:
                    newCell.textContent = rowData[cellKey];

                    // index odd gives data values
                    if(index % 2 == 1) {
                        dataVal = rowData[cellKey];
                    }
                    // index even gives date values
                    else {
                        timeVal = rowData[cellKey];
                    }
            }              
            index++;
        }
        //console.log("addData(" + i + ", " + timeVal + ", " + dataVal + ")");
        addData(i, timeVal, dataVal);
        i++;
    }
};

//////////////////////////////////////////////
//      Chart.js from common
//////////////////////////////////////////////

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

////////////////////////////////////////////
//      Chart.js bar <-> line
//////////////////////////////////////////////

    // .click functions for buttons
    $("#line").click(function() {
        console.log(".click(func) line");
        console.log("datatype in .click: " + document.getElementById("datatype").value);
        changeChart('line'); //calls change function
    });
    
    $("#bar").click(function() {
        console.log(".click(func) bar");
        console.log("datatype in .click: " + document.getElementById("datatype").value);
        changeChart('bar'); //calls change function
    });

// default chart configurations to load
var configChartDefaults = {
    type: 'line',
    data: data,
    options: options,
  };
  
// changes chart type and updates its contents
function changeChart(newType) {
    var i = 0;
    console.log("In change()");
    var ctx = document.getElementById("mychart").getContext("2d");
  
    // Remove the old chart and all its event handles
    if (weatherChart) {
      weatherChart.destroy();
      console.log("destroyed weatherChart");
    }

    // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
    var temp = jQuery.extend(true, {}, configChartDefaults);    
    temp.type = newType;
    weatherChart = new Chart(ctx, temp); //BUG IS IN THIS

    //must fix data type; possible bug in temp
    updateWeatherChart();

    if(weatherChart.data.datasets[0].data.length != document.getElementById("interval").value) {
        console.log("BUG! " + weatherChart.data.datasets[0].data.length + " != " + document.getElementById("interval").value);
        getDataModern();
    }
};

//////////////////////////////////////
//        Function calls
//////////////////////////////////////

getDataModern();
