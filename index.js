/*
Note about shutdown function:
    Only call finished if you're actually done with your cleanup / tear-down routines.    
    This tells the library that you've handled everything you want or need to and are ready to exit.
    Once finished is called, it will not be called again. The lib cleans up handlers and exits immediately at this point.
*/
function finished() {
    process.removeListener('exit', exitHandler);
    process.removeListener('SIGINT', sigintHandler);
    process.removeListener('uncaughtException', uncaughtExceptionHandler);
    process.removeListener('unhandledRejection', unhandledPromiseRejectionHandler);
    process.emit('finished');
    process.exit();
}

function shutdown(req, next=false) {
    process.emit('shutdown', req, next !== false ? next : finished);
}

function exitHandler() {
    console.log("Process Exit: gracefully shutting down..."); // eslint-disable-line
    shutdown(false);
}

function sigintHandler() {
    console.log("Received signal SIGINT"); // eslint-disable-line
    shutdown(2);
}

function uncaughtExceptionHandler(e) {
    console.log("Uncaught Exception...\n", e.stack); // eslint-disable-line
    shutdown(99);
}

function unhandledPromiseRejectionHandler(e, p) {
    console.log('Unhandled Rejection at: Promise', p, 'Reason:', e, e.stack); // eslint-disable-line
}

function install(callback) {
    if (typeof callback !== 'function')
        throw new Error("Shutdown: callbacks must be functions");

    process.on('shutdown', callback);
}

if (typeof process.shutdown === 'undefined') {
    process.on('exit', exitHandler);
    process.on('SIGINT', sigintHandler);
    process.on('uncaughtException', uncaughtExceptionHandler);
    process.on('unhandledRejection', unhandledPromiseRejectionHandler);
    process.shutdown = function(err=false) {
        shutdown(err);
    };

    /*
       SIGINT is a POSIX Signal, which some versions of windows pays no mind to support.
       This emulates the signals behavior on windows only. That's why the require is buried in an if.
       If the platform isn't windows, this won't do anything. On Windows 10 this behavior varies as to if it's needed.
    */
    if (process.platform.slice(0,3) == 'win') {
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on("SIGINT", function () {
            process.emit('SIGINT');
        });
    }
}

exports = module.exports = install;
