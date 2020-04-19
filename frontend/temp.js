console.log("Loading temp.js...");


/*
let myChart = document.getElementById('myChart').getContext('2d');

let massPopChart = new myChart(myChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels:[''],
        datasets:[],

    },
    options:{}
})
*/

function getAmount() { 

    //remove old data from table    
    //$("tbody").children().remove();

    //get weather datatype
    const datatype = document.getElementById("datatype").value;

    //get time interval (in hours)
    const interval = document.getElementById("interval").value;

    // Find the first <tbody> element on the page
    const tableBody = document.getElementsByTagName("tbody")[0];
    // Define an asynchronous function using arrow syntax

    const getDataModern = async () => {
        // Todo: fetch data

        //remove old data from table    
        $("tbody").children().remove();

        //fetch data using modern Fetch api
        const data = await fetch(`http://webapi19sa-1.course.tamk.cloud/v1/weather/${datatype}/${interval}`);
        //keyword 'await' can only be used inside async function

        //get actual JSON data 
        const dataJson = await data.json();
        //.json() is an async funciton

        console.log("dataJson", dataJson);

        //last count
        var i = 0;

        //'for of' loop for iterating dataJson
        for (rowData of dataJson) {
            //Insert new row to table
            const newRow = tableBody.insertRow(-1);
            //default is -1
            //(-1) is so each next row of data won't be added OVER another row, with -1 it will be put at the end of the table

            const cellKeys = Object.keys(rowData); //Output: ["id", "device_id", "date_time", "data"]



            const dataname = datatypeToOfficial(datatype); //change to more formal style
            const newCell = newRow.insertCell(-1);
            newCell.textContent = dataname;

            for(cellKey of cellKeys) {
                
                const newCell = newRow.insertCell(-1); //(-1) want to insert at the end of the row

                switch(cellKey) {
                    //If data cell, dig key&value from sub object
                    case "data":
                        const key = Object.keys(rowData[cellKey])[0];
                        const value = rowData[cellKey][key];
                        newCell.textContent = `${key}: ${value}`;
                        break;
                    //for other cells, copy the value to the cell
                    default:
                        newCell.textContent = rowData[cellKey];
                }
            }
            

        }
    };

    getDataModern();

    getChart();
} 

getAmount();


function getChart() {

    //get weather datatype
    const datatype = document.getElementById("datatype").value;
    const dataname = datatypeToOfficial(datatype); //change to more formal style

    //get time interval (in hours)
    const interval = document.getElementById("interval").value;

    let myChart = document.getElementById('mychart').getContext('2d');

    
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    

    let massPopChart = new Chart(myChart, {
        type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
            labels:['temperature', 'humidity', 'wind_speed'],
            datasets:[{
                label:'weather_types',
                data:[
                    69,
                    420,
                    360
                ],
                // backgroundColor:'green' //cahnegs all bar colors
                
                backgroundColor:[
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 192, 192, 0.6)',
                    'rgba(255, 102, 255, 0.6)',
                ], //change each specific bar color as array
                hoverBorderWidth:1,
                hoverBorderColor:'#777',

                
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



// Function for button when clicked
const clickmeButton = document.getElementById("update");
clickmeButton.addEventListener('click', getAmount);

