module.exports = {
    open: function (port) {
        port.on('open', () => {
            console.log('port open. Data rate: ' + port.baudRate);
        });
    },

    receive: function (parser) {
        parser.on('data', (data) => {
            console.log(data);
        });
    },

    close: function (port) {
        port.on('close', () => {
            console.log('port closed.');
        });

    },

    error: function (port) {
        port.on('error', (error) => {
            console.log('Serial port error: ' + error);
        });
    }

};

/*
function readSerialData(data) {
    console.log(data);
}

function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}*/