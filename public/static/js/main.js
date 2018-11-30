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
        if (marker.product == "ehr") {
            var micon = L.icon({
                iconUrl: '/static/imgs/ehr.png',
                iconSize: [32, 32],
                iconAnchor: [32, 16],
                popupAnchor: [-16, -16],
            });
            var infobox = '<div class="ibox"><div class="ibox-text">' +
                '<p class="m-title"><b><i class="fa fa-hospital-o"></i>&nbsp' + marker.name + '</b></p>' +
                '<p class="m-tool"><b>LH EHR (v' + marker.version + ') </b></p>' +
                '<p class="m-intro">' + marker.intro + '</p>' +
                '<p class="m-location"><b>Address : ' + marker.address + " , " + marker.country + '</b></p>' +
                '<p class="m-location"><b><i class="fa fa-users"></i> Patients  : ' + marker.pnum + '</b></p>' +
                '<p class="m-phone"><i class="fa fa-phone"></i><b> Call : ' + marker.phone + '</b></p>' +
                '<p class="m-email"><b>Contact at: <a href=mailto:' + marker.email + '>' + marker.email + '</a></b></p>' +
                '<p class="m-email"><b>Website: <a href=' + marker.website + '>' + marker.website + '</a></b></p>' +
                '</div>' +
                '</div>';
            L.marker([marker.lat, marker.lng], {
                    icon: micon
                }).addTo(map)
                .bindPopup(infobox);

        } else if (marker.product == "toolkit") {
            var micon = L.icon({
                iconUrl: '/static/imgs/toolkit.png',
                iconSize: [32, 32],
                iconAnchor: [32, 16],
                popupAnchor: [-16, -16],
            });
            var infobox = '<div class="ibox"><div class="ibox-text">' +
                '<p class="m-title"><b><i class="fa fa-hospital-o"></i>&nbsp' + marker.name + '</b></p>' +
                '<p class="m-tool"><b>LH EHR (v' + marker.version + ') </b></p>' +
                '<p class="m-intro">' + marker.intro + '</p>' +
                '<p class="m-location"><b>Address : ' + marker.address + " , " + marker.country + '</b></p>' +
                '<p class="m-location"><b><i class="fa fa-users"></i> Patients  : ' + marker.pnum + '</b></p>' +
                '<p class="m-phone"><i class="fa fa-phone"></i><b> Call : ' + marker.phone + '</b></p>' +
                '<p class="m-email"><b>Contact at: <a href=mailto:' + marker.email + '>' + marker.email + '</a></b></p>' +
                '<p class="m-email"><b>Website: <a href=' + marker.website + '>' + marker.website + '</a></b></p>' +
                '</div>' +
                '</div>';
            L.marker([marker.lat, marker.lng], {
                    icon: micon
                }).addTo(map)
                .bindPopup(infobox);

        } else if (marker.product == "radiology") {
            var micon = L.icon({
                iconUrl: '/static/imgs/radiology.png',
                iconSize: [32, 32],
                iconAnchor: [32, 16],
                popupAnchor: [-16, -16],
            });
            var infobox = '<div class="ibox"><div class="ibox-text">' +
                '<p class="m-title"><b><i class="fa fa-hospital-o"></i>&nbsp' + marker.name + '</b></p>' +
                '<p class="m-tool"><b>LH EHR (v' + marker.version + ') </b></p>' +
                '<p class="m-intro">' + marker.intro + '</p>' +
                '<p class="m-location"><b>Address : ' + marker.address + " , " + marker.country + '</b></p>' +
                '<p class="m-location"><b><i class="fa fa-users"></i> Patients  : ' + marker.pnum + '</b></p>' +
                '<p class="m-phone"><i class="fa fa-phone"></i><b> Call : ' + marker.phone + '</b></p>' +
                '<p class="m-email"><b>Contact at: <a href=mailto:' + marker.email + '>' + marker.email + '</a></b></p>' +
                '<p class="m-email"><b>Website: <a href=' + marker.website + '>' + marker.website + '</a></b></p>' +
                '</div>' +
                '</div>';
            L.marker([marker.lat, marker.lng], {
                    icon: micon
                }).addTo(map)
                .bindPopup(infobox);

        }

        i++;
        // });
    });
});

function toggle_legend() {
    var l = document.getElementById("legend");
    if (l.style.display == "none") {
        l.style.display = "block";
    } else {
        l.style.display = "none";
    }
}