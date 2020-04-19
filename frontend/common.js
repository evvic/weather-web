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
                  <a class="nav-link" href="/datadump.html">Datadump</a>
             </li>
            <li class="nav-item">
                <a class="nav-link" href="/latest_values.html">Latest Values</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/temp.html">Chart</a>
            </li>
        </ul>
 
</nav>
`;

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

//add chart to common once it makes more sense
/*
function getChart() {
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
                text:'Weather Types and Stuff', 
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

const navbarElement = document.getElementById("navbar-element");
navbarElement.innerHTML=navbarHtml;
/*
    Navbar ends
*/