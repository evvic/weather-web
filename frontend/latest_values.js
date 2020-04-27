console.log("Loading latest_values.js...");

function getAmount() { 
    //remove old data from table    
    //$("tbody").children().remove();

    var amount = document.getElementById("last").value;
    // Find the first <tbody> element on the page
    const tableBody = document.getElementsByTagName("tbody")[0];
    // Define an asynchronous function using arrow syntax

    var index;

    console.log("start amount = " + amount);

    switch(amount) {
        case "1":
            index = amount;
            amount = 19;
            break;
        case "10":
            index = amount;
            amount = 10;
            break;
        case "20":
            index = amount;
            amount = 0;
            break;
        default:
            console.log("Error, in default of switch statement.");
    }

    console.log("end amount = " + amount);

    //get weather datatype
    const datatype = document.getElementById("datatype").value;

    const getDataModern = async () => {
        // Todo: fetch data

        //remove old data from table    
        $("tbody").children().remove();

        //fetch data using modern Fetch api
        /*if(datatype == "all") {
            const data = await fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather");
            console.log("in if");
        } */

        const data = await fetch(`http://webapi19sa-1.course.tamk.cloud/v1/weather/${datatype}`);
        
        //keyword 'await' can only be used inside async function

        //get actual JSON data 
        const dataJson = await data.json();
        //.json() is an async funciton

        console.log("dataJson", dataJson);

        //last count
        var i = 0;

        //'for of' loop for iterating dataJson
        /*
            CHanged use of slice. Slice data from amount to 20 (20 is max)
            Because the latest values are near the end (/max) so must slice the beginning off, not the end
        */
        for (rowData of dataJson.slice(amount, 20)) {
            //Insert new row to table
            const newRow = tableBody.insertRow(-1);
            //default is -1
            //(-1) is so each next row of data won't be added OVER another row, with -1 it will be put at the end of the table

            const cellKeys = Object.keys(rowData); //Output: ["#", "device_id", "date_time", "data", "unit"]

            //incrementing #
            i++;
            
            const newCell = newRow.insertCell(-1);
            newCell.textContent = index;

            var j = 0; //~~~~~~~~~~~~~~~
            var stuff;
            for(cellKey of cellKeys) {
                
                
                const newCell = newRow.insertCell(-1); //(-1) want to insert at the end of the row

                switch(cellKey) {
                    //If data cell, dig key&value from sub object
                    case "data":
                        const key = Object.keys(rowData[cellKey])[0];
                        const value = rowData[cellKey][key];
                        newCell.textContent = `${key}: ${value}`;
                        //console.log("Counting case data: " + j % 4); //~~~~~~
                        break;
                    //for other cells, copy the value to the cell
                    default:
                        newCell.textContent = rowData[cellKey];
                        //stuff = rowData[cellKey];
                        //console.log("Counting default: " + j % 4 + "    Data: " + stuff);//~~~~~~~~~~~~~
                }
                j++; //~~~~~~~~~~~~~~~~~~~~~~~~
            } 
            index--;
            const newerCell = newRow.insertCell(-1);
            newerCell.textContent = datatypeToUnit(datatype);    
        }
    };

getDataModern();
} 

getAmount();

// Function for button when clicked
/*
const clickmeButton = document.getElementById("update");
clickmeButton.addEventListener('click', getAmount);
*/