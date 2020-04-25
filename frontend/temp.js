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

// Copy an existing select element
var cloned = $('select[name="select1"]').clone();

// Each time someone changes a select
$('select.questions').live('change',function() {
    // Get the current values, then reset the selects to their original state
    var hidden,[];
    $('select.questions').each(function() {
        hidden.push($(this).val());
        $(this).html(cloned.html());
    });
    // Look through the selects
    for (var i in hidden) {
        $('select.questions').each(function() {
            // If this is not the current select
            if ((parseInt(i)) != $(this).parent().index()) {
                // Remove the ones that were selected elsewhere
                $(this).find('option[value="'+hidden[i]+'"]').not('option[value="0"]').remove();
            } else {
                // Otherwise, just select the right one
                $(this).find('option[value="'+hidden[i]+'"]').not('option[value="0"]').attr('selected','selected');
            }
        });
    }
});