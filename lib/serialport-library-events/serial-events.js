module.exports = {
    open: function (port) {
        port.open(() => {
            console.log('port open. Data rate: ' + port.baudRate);
        });
    },

    receive: function (port) {
        port.on('data', (data) => {
            console.log(data.toString());
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