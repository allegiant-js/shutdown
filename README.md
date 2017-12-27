# shutdown

> Simple graceful shutdown helper library.
>> There be 🐲 here! The API and functionality are being cemented, anything before a 1.0.0 release is subject to change.

```js
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
```

### Copyright & License

Copyright &copy; 2017 Allegiant. Distributed under the terms of the MIT License, see [LICENSE](https://github.com/allegiant-js/shutdown/blob/master/LICENSE)

Availble via [npm](https://www.npmjs.com/package/@allegiant/shutdown) or [github](https://github.com/allegiant-js/shutdown).