var map = L.map('map').setView([0, 0], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

$.getJSON("/api/markers", function (data) {
    data.forEach(function (marker) {
        // marker.forEach(function(marker){
        var micon, i = 0;
        if (marker.tool == "ehr") {
            var micon = L.icon({
                iconUrl: '/static/ehr.png',
                iconSize: [32, 32],
                iconAnchor: [32, 16],
                popupAnchor: [-16, -16],
            });
            var infobox = '<div class="ibox"><div class="ibox-text">' +
                '<p class="m-title">' + marker.name + '</p>' +
                '<small class="m-id">ID : ' + marker.id + '</small>' +
                '<p class="m-tool"><b>LH EHR (v' + marker.version + ') </b></p>' +
                '<p class="m-intro">' + marker.intro + '</p>' +
                '<p class="m-location"><b>Location : ' + marker.location + '</b></p>' +
                // '<script>if (marker.contactPhone){document.getElementById("contactphone").style.display = "block"}</script>' +
                '<p class="m-phone"><b>Call : ' + marker.phone + '</b></p>' +
                '<p class="m-email"><b>Contact at: <a href=mailto:' + marker.email + '>' + marker.email + '</a></b></p>' +
                '</div>' +
                '</div>';
                L.marker([marker.lat , marker.lng] ,{icon : micon} ).addTo(map)
                .bindPopup(infobox);

        } else if (marker.tool == "toolkit") {
            var micon = L.icon({
                iconUrl: '/static/toolkit.png',
                iconSize: [32, 32],
                iconAnchor: [32, 16],
                popupAnchor: [-16, -16],
            });
            var infobox =
                '<div class="ibox"><div class="ibox-text">' +
                '<p class="m-title">' + marker.name + '</p>' +
                '<small class="m-id">ID : ' + marker.id + '</small>' +
                '<p class="m-tool"><b>LH Toolkit (v' + marker.version + ') </b></p>' +
                '<p class="m-intro">' + marker.intro + '</p>' +
                '<p class="m-location"><b>Location : ' + marker.location + '</b></p>' +
                // '<script>if (marker.contactPhone){document.getElementById("contactphone").style.display = "block"}</script>' +
                '<p class="m-phone"><b>Call : ' + marker.phone + '</b></p>' +
                '<p class="m-email"><b>Contact at: <a href=mailto:' + marker.email + '>' + marker.email + '</a></b></p>' +
                '</div>' +
                '</div>';
                L.marker([marker.lat , marker.lng] ,{icon : micon} ).addTo(map)
                .bindPopup(infobox);

        } else if (marker.tool == "radiology") {
            var micon = L.icon({
                iconUrl: '/static/radiology.png',
                iconSize: [32, 32],
                iconAnchor: [32, 16],
                popupAnchor: [-16, -16],
            });
            var infobox =
                '<div class="ibox"><div class="ibox-text">' +
                '<p class="m-title">' + marker.name + '</p>' +
                '<small class="m-id">ID : ' + marker.id + '</small>' +
                '<p class="m-tool"><b>LH Radiology (v' + marker.version + ') </b></p>' +
                '<p class="m-intro">' + marker.intro + '</p>' +
                '<p class="m-location"><b>Location : ' + marker.location + '</b></p>' +
                // '<script>if (marker.contactPhone){document.getElementById("contactphone").style.display = "block"}</script>' +
                '<p class="m-phone"><b>Call : ' + marker.phone + '</b></p>' +
                '<p class="m-email"><b>Contact at: <a href=mailto:' + marker.email + '>' + marker.email + '</a></b></p>' +
                '</div>' +
                '</div>';
                L.marker([marker.lat , marker.lng] ,{icon : micon} ).addTo(map)
                .bindPopup(infobox);
                
        }

        i++;
        console.log(i);
        // });
    });
});

function toggle_legend(){
    var l = document.getElementById("legend");
    if (l.style.display == "none"){
        l.style.display = "block";
    }else {
        l.style.display = "none";
    }
}