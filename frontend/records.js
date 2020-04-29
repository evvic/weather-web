console.log("Loading records.js...");

///////////////////////////////////////////////////////
//      datatype card function calls/definitions
///////////////////////////////////////////////////////

function temperatureCard() {
    const datatype = "temperature";
    loadMax(datatype);
    loadMin(datatype);
}

function wind_speedCard() {
    const datatype = "wind_speed";
    loadMax(datatype);
    loadMin(datatype);
}

function rainCard() {
    const datatype = "rain";
    loadMax(datatype);
    loadMin(datatype);
}

function lightCard() {
    const datatype = "light";
    loadMax(datatype);
    loadMin(datatype);
}

function humidity_inCard() {
    const datatype = "humidity_in";
    loadMax(datatype);
    loadMin(datatype);
}

function humidity_outCard() {
    const datatype = "humidity_out";
    loadMax(datatype);
    loadMin(datatype);
}
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

function loadMin(datatype) {
    const min = "min";
    const element = document.querySelector(`div#min${datatype}`);

    getData(datatype, min).then(posts => {
      const template = getTemplate(posts, min, datatype);
  
      element.innerHTML = template;
    });
}

function loadMax(datatype) {
    const max = "max";
    const element = document.querySelector(`div#max${datatype}`);

    getData(datatype, max).then(posts => {
      const template = getTemplate(posts, max, datatype);
  
      element.innerHTML = template;
    });
}

function loadCurrent(datatype) {
    const max = "max";
    const element = document.querySelector(`div#max${datatype}`);
    
    getData(datatype, max).then(posts => {
      const template = getTemplate(posts, max, datatype);
  
      element.innerHTML = template;
    });
}
  
async function getData(datatype, record) {
    const url = `http://webapi19sa-1.course.tamk.cloud/v1/weather/stat/${record}/${datatype}`;
    const response = await fetch(url);
  
    return await response.json();
}
  
function getTemplate(posts, record, datatype) {
    switch(record) {
        case "max":
            var rows = posts.map(postToRowViewMax).join("");
            break;
        case "min":
            var rows = posts.map(postToRowViewMin).join("");
            break;
        default:
            console.log("defualt in switch gettemplate()");
            break;
    }
      
    return `
    <table>  
        <tbody>
            <t>
                <td>${rows + ` ${datatypeToUnitRaw(datatype)}`}</td>
            </tr>
        </tbody>
    </table>`;
}
  
function postToRowViewMax(post) {
    return `Max: ${post.max}`;
}

function postToRowViewMin(post) {
    return `Min: ${post.min}`;
}
  
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

temperatureCard();
wind_speedCard();
rainCard();
lightCard();
humidity_inCard();
humidity_outCard();

