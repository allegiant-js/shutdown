const Shutdown = require('../index');

var live=false;

Shutdown(onShutdown);
function onShutdown(req=false, finished) {
    console.log("Shut down triggered... ", req); // eslint-disable-line
    if (live !== false) {
        clearInterval(live);
        finished();
    }
}

live = setInterval(function () { 
    console.log("tick"); // eslint-disable-line
}, 1000); 

process.on('finished', function() {
    console.log("finish triggered"); // eslint-disable-line
});
