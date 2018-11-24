function marker_submit() {

    var name = document.getElementById("m_name").value;
    var type = document.getElementById("m_type").value;
    var location = document.getElementById("m_location").value;
    var intro = document.getElementById("m_intro").value;
    var lat = document.getElementById("m_lat").value;
    var lng = document.getElementById("m_lng").value;
    var contactEmail = document.getElementById("m_contactEmail").value;
    var contactPhone = document.getElementById("m_contactPhone").value;
    var version = document.getElementById("m_version").value;



    $.post("/addmarker", {
            name: name,
            tool: type,
            location: location,
            lat: lat,
            lng: lng,
            intro: intro,
            contactEmail: contactEmail,
            contactPhone: contactPhone,
            version: version
        },
        function (data, status) {
        });
}

function logmein() {
    document.getElementById("login-form").submit();
    
}

function fetchJSON(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


// function maketoolchart() {

//     var ehrv = 0,
//         toolkitv = 0,
//         radiologyv = 0;
var ehr_value = function(){
    var j = JSON.parse(fetchJSON("/api/markers/ehr"));
    return j.length;
};
var toolkit_value = function(){
    var j = JSON.parse(fetchJSON("/api/markers/toolkit"));
    return j.length;
};
var rad_value = function(){
    var j = JSON.parse(fetchJSON("/api/markers/radiology"));
    return j.length;
};
//     var tk = 0
//     $.getJSON("/api/markers/toolkit", function (data) {
//         data.forEach(function (marker) {
//             tk++;
//     });
//     });
//     var rad = 0
//     $.getJSON("/api/markers/radiology", function (data) {
//         data.forEach(function (marker) {
//             rad++;
//     });
//     });
//     return [ehr , tk ,rad];

    
// };
// console.log(usedtool());
        // for (var marker in json) {
        //     // if (marker.tool == "ehr") {
        //     //     ehrv += 1;
        //     //     console.log("EHR");
        //     // } else if (marker.tool == "toolkit") {
        //     //     toolkitv += 1;
        //     // } else if (marker.tool == "radiology") {
        //     //     radiologyv += 1;
        //     // }
        //     console.log(marker, json[marker]);
        // }
        // Object.keys(json).forEach(function(k){
        //     console.log(k + ' - ' + json[k]);
        // });


//     console.log(ehrv, toolkitv, radiologyv);

    var ctx = document.getElementById('toolchart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: ["EHR", "Toolkit", "Radiology"],
            datasets: [{
                label: "Products Used",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [ehr_value(), toolkit_value(), rad_value()],
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
// }
// maketoolchart();