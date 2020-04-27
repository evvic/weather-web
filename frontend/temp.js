console.log("Loading temp.js...");

/*
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

*/

function show() {
    let click = document.getElementById('drop-content');
    if(click.style.display === 'none'){
     click.style.display = 'block';
    } else {
     click.style.display = 'none';
    }
}show();