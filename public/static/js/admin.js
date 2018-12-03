function logmein() {
    document.getElementById("login-form").submit();

}

function fetchJSON(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

var ehr_value = function () {
    var j = JSON.parse(fetchJSON("/api/markers/product/ehr"));
    return j.length;
};
var toolkit_value = function () {
    var j = JSON.parse(fetchJSON("/api/markers/product/toolkit"));
    return j.length;
};
var rad_value = function () {
    var j = JSON.parse(fetchJSON("/api/markers/product/radiology"));
    return j.length;
};

var ehr_p_value = function () {
    var j = JSON.parse(fetchJSON("/api/markers/product/ehr/pnum"));
    if (!j.patients){
        return 0;
    }else{
    return j.patients;
    }
};

var toolkit_p_value = function () {
    var j = JSON.parse(fetchJSON("/api/markers/product/toolkit/pnum"));
    if (!j.patients){
        return 0;
    }else{
    return j.patients;
    }
};
var rad_p_value = function () {
    var j = JSON.parse(fetchJSON("/api/markers/product/radiology/pnum"));
    if (!j.patients){
        return 0;
    }else{
    return j.patients;
    }
};

var ctx = document.getElementById('toolchart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'horizontalBar',

    // The data for our dataset
    data: {
        labels: ["EHR", "Toolkit", "Radiology"],
        datasets: [{
            label: "Total Products Used",
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

