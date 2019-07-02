const initConfig = require('./../../config/init-config');
const event = require('./../event-emitter/event-emitter');
const serialOptions = {baudRate: 9600, dataBits: 8, stopBits: 2, parity: 'odd', autoOpen: false};

const eventEmitter = event.commonEmitter;
let serialPort;

module.exports = {
    serialPortInit: () => {
        return new Promise((resolve, reject) => {
            initConfig.serial.getPortName()
            // configure serial port
                .then((port) => {
                    console.log('Port ' + port + ' selected...');
                    serialPort = initConfig.serial.portConfig(port, serialOptions);
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                })
        })

    },
    open: () => {
        serialPort.open(() => {
            console.log('Port ' + serialPort.path + ' open... \nSerial settings:');
            console.dir(serialPort.settings);
        });
    },

    send: (message) => {
        // quando invio comandi in seriale, questa funzione
        serialPort.write(message);
    },

    drain: (callback) => {
        serialPort.drain(callback);
    },

    receive: () => {
        serialPort.on('data', (data) => {
            // metto su una coda il dato che il consumer provvederà ad elaborare (serial-data-process) --- in caso di discovery mode scrivo prima 255 poi la configurazione
            if (data != 255) {
                console.log(data.toString());
                eventEmitter.emit('enablePolling');
            } else {
                eventEmitter.emit('discoveryMode', 2);
            }

        });
    },

    close: () => {
        serialPort.on('close', () => {
            console.log('Port ' + port.path + ' closed.');
        });
    },

    error: () => {
        serialPort.on('error', (error) => {
            console.log('Serial port error: ' + error);
        });
    }

};