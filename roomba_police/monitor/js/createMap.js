var hosturl = "https://XXXXX.execute-api.ap-northeast-1.amazonaws.com/test"
var apiurl = hosturl + "/datas/"

//-------------------------------------------
// monitorRoomba()
//    execute query to DynamoDB
//-------------------------------------------
function monitorRoomba() {
    console.log("monitorRoomba() start");
    res = $.get(apiurl, function(){

        }).done(function(data){
            jsonData = JSON.stringify(data);
            console.log(jsonData);
            if(data.length > 0){
                setImg(data[0].location);
            }
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        });
}
//-------------------------------------------
// traceRoomba()
//    execute query to DynamoDB
//-------------------------------------------
function traceRoomba() {
    console.log("traceRoomba() start");
    $(".roomba").css("transition-duration", (1000/$("#speed").val()) + "ms");
    res = $.get(apiurl, {date:$("#date").val(), startTime:$("#time").val(), duration:$("#duration").val()},function(){

        }).done(function(data){
            jsonData = JSON.stringify(data);
            console.log(jsonData);
            moveRoomba(data, 0);
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        });
}

function moveRoomba(data, index) {
    if(data.length > index){
        var location = data[index].location
        setImg(location);
    }

    if(data.length > index+1){
        var dateStr = data[index].date;
        var timeStr = data[index].time;
        var nextDateStr = data[index+1].date;
        var nextTimeStr = data[index+1].time;
        var date = new Date(dateStr.replace(/-/g, '/') + " " + timeStr.substr(0,8)); // Convert to YYYY/MM/DD HH:MM:SS
        var nextDate = new Date(nextDateStr.replace(/-/g, '/') + " " + nextTimeStr.substr(0,8)); // Convert to YYYY/MM/DD HH:MM:SS

        var waitTime = (nextDate.getTime() - date.getTime()) / $("#speed").val();
        setTimeout(moveRoomba, waitTime, data, index+1);
    }
}
//-------------------------------------------
// setImg()
//-------------------------------------------
function setImg(location) {
    console.log("setImg() start");
    var x = location % 10;
    var y = Math.floor(location / 10);

    var new_top = (y * 55 + 30) + "px";
    var new_left = (x * 50 + 50) + "px";

    $(".roomba").css({"top":new_top,"left":new_left});
}
