const events = require('events');
const eventEmitter = new events.EventEmitter();

module.exports = {
    open: (port) => {
        port.open(() => {
            console.log('Port ' + port.path + ' open... \nSerial settings:');
            console.dir(port.settings);
        });
    },

    send: (port, message) => {
        // quando invio comandi in seriale, questa funzione
        port.write(message);
    },

    receive: (port) => {
        port.on('data', (data) => {
            // metto su una coda il dato che il consumer provvederà ad elaborare (serial-data-process) --- in caso di discovery mode scrivo prima 255 poi la configurazione
            if (data != 255) {
                eventEmitter.emit('enablePolling');
            } else {
                eventEmitter.emit('discoveryMode', 2);
            }
            console.log(data.toString());
        });
    },

    close: (port) => {
        port.on('close', () => {
            console.log('Port ' + port.path + ' closed.');
        });
    },

    error: (port) => {
        port.on('error', (error) => {
            console.log('Serial port error: ' + error);
        });
    }

};