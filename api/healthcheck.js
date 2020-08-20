var http = require("http");

var options = {  
    host : "0.0.0.0",
    port : "5000",
    timeout : 2000
};

var healthcheck = http.request(options, (res) => {  
    console.log(`HEALTHCHECK STATUS: ${res.statusCode}`);
    if (res.statusCode == 200) {
        process.exit(0);
    }
    else {
        process.exit(1);
    }
});

healthcheck.on('error', function(err) {  
    process.exit(1);
});

healthcheck.end(); 