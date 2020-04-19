console.log("Loading temp.js...");

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

    console.log("going to fetch json data");
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
        //////////////////////////////////

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
                    console.log("case: default");
                    newCell.textContent = rowData[cellKey];

                        //array for graph
                        //index odd gives data values
                    if(index % 2 == 1) {
                        //from there
                        dataVal = rowData[cellKey];
                        //addData('weatherChart', index, rowData[cellKey]);
                        //console.log(dataArr + " at " + index); //being wierd but working
                    }
                    //index even gives date values
                    else {
                        timeVal = rowData[cellKey];
                    // console.log(timeArr + " at " + index); //being wierd but working
                    }
            }              
            index++;
        }
        console.log("addData(" + i + ", " + timeVal + ", " + dataVal + ")");
        addData(i, timeVal, dataVal);
        i++;
    }
};

getDataModern();

//Chart.js original chart
/*

function getChart(datatype, interval) {

    console.log("In getChart()");

    const dataname = datatypeToOfficial(datatype); //change to more formal style

    let myChart = document.getElementById('mychart').getContext('2d');
    
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let dataArr = [5, 10, 8, 12, 6, 7, 15, 20, 13];
    let timeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    let weatherChart = new Chart(myChart, {
        type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
            labels : timeArr,
            datasets:[{
                lineTension: 0.3,
                label:`${dataname} values`,
                data : dataArr,
                backgroundColor:datatypeToColor(datatype), //cahnegs all bar colors
                hoverBorderWidth:10,
                hoverBorderColor:datatypeToColor(datatype),
            }]

        },
        options:{
            title:{
                display:true,
                text:`${dataname} Over ${interval} Hours`, 
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
                    left:10, //adds whitespace pixels to the left
                    right:10,
                    bottom:10,
                    top:10,
                }
            },
            tooltips:{
                enabled:true
            }
        }
    })
}

*/


/*
    // Function for button when clicked
    const clickmeButton = document.getElementById("update");
    clickmeButton.addEventListener('click', getAmount);
*/