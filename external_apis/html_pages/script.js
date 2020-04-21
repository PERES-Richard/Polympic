const userId = document.getElementById("userId");
const duration = document.getElementById("duration");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
let intervalID;

document.getElementById("form").addEventListener("submit", function(e){
    e.preventDefault();
    let params = {
        "address": "localhost:4000",
        "uuid": userId.value,
        "duration": duration.value,
        "service": "pompier"
    };
    $.ajax({
        url: 'http://localhost:80/service_api/request_user_position',
        type: 'POST',
        data: params,
        success: function(data){
            user = {
                uuid: data.uuid,
                latitude: data.latitude,
                longitude: data.longitude
            }
            $.ajax({
                url: 'http://localhost:4000/polympic/user_position',
                type: 'POST',
                data: user,
                success: function(data){
                    intervalID = setInterval(get_current_user, 1000);
                }
            });
        }
    });
});

function get_current_user() {
    $.ajax({
        url: 'http://localhost:4000/current_user',
        type: 'GET',
        success: function(data){
            latitude.innerHTML = "Latitude : " + data.latitude;
            longitude.innerHTML = "Longitude : " + data.longitude;
        }
    });
}