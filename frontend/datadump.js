console.log("Loading datadump.js...");

// Find the first <tbody> element on the page
const tableBody = document.getElementsByTagName("tbody")[0];
// Define an asynchronous function using arrow syntax

const getDataModern = async () => {
    // Todo: fetch data

    //fetch data using modern Fetch api
    const data = await fetch("http://bowd9-api.course.tamk.cloud/v1/weather");
    //OG: http://webapi19sa-1.course.tamk.cloud/v1/weather
    //keyword 'await' can only be used inside async function

    //get actual JSON data 
    const dataJson = await data.json();
    //.json() is an async funciton

    console.log("dataJson", dataJson);

    //'for of' loop for iterating dataJson
    for (rowData of dataJson) {
        //Insert new row to table
        const newRow = tableBody.insertRow(-1);
        //default is -1
        //(-1) is so each next row of data won't be added OVER another row, with -1 it will be put at the end of the table

        const cellKeys = Object.keys(rowData); //Output: ["id", "device_id", "date_time", "data"]

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