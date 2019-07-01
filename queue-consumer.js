const serialService = require('./services/serial/serial-service');
const initConfig = require('./config/init-config');
const events = require('events');

const serialOptions = {baudRate: 9600, dataBits: 8, stopBits: 2, parity: 'odd', autoOpen: false};
const brokerURL = 'mqtt://192.168.101.122';
//const brokerURL = 'mqtt://127.0.0.1'; TODO da usare quando il codice è caricato nel raspberry
const options = {
    username: 'gateway',
    password: 'gateway'
};
const eventEmitter = new events.EventEmitter();
eventEmitter.on('enablePolling', polling());
eventEmitter.on('discoveryMode', discovery(step));

// L'INDEX E' COLUI CHE INVIA I MESSAGGI IN SERIALE
let serialPort;

// find USB serial port
initConfig.serial.getPortName()
// configure serial port
    .then((port) => {
        console.log('Port ' + port + ' selected...');
        serialPort = initConfig.serial.portConfig(port, serialOptions);
    })
    // start serial port events listeners
    .then(() => {
        serialService.open(serialPort);
        serialService.receive(serialPort);
        serialService.close(serialPort);
        serialService.error(serialPort);
    })
    // MQTT INIT
    .then(() => {
        mqttClient = initConfig.MQTT.connect(brokerURL, options);
        return mqttClient;
    })
    .then((mqttClient) => {
        mqttClient.on('message', function (topic, message) {
            // salvo il comando sulla coda dei comandi (topic + message) per inviarlo dopo in polling()
            console.log(message.toString());
        })
    })
    .then(() => {
        // logica di consumo dalle due code
        polling();
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });


// polling verrà richiamata da un event emitter quando finirò di ricevere il dato
function polling() {
    while (true) {
        // controllo la coda dei comandi
        // se trovo un comando di entrare in discovery mode
        eventEmitter.emit('discoveryMode', 1);
        break;
        // se trovo qualcosa lo mando in seriale
        writeAndDrain('invio comando ricevuto dall\'utente', () => {
            console.log("comando inviato!");
            // una volta mandato il dato faccio il break e aspetto di ricevere una risposta
            // parte un timer per il timeout
            break;
        });

        // controllo la coda dei collect
        // se trovo qualcosa lo mando in seriale
        writeAndDrain('invio comando di collect', () => {
            console.log("collect!");
            // una volta mandato il dato faccio il break e aspetto di ricevere una risposta
            // parte un timer per il timeout
            break;
        });
    }
}

function writeAndDrain(data, callback) {
    serialService.send(serialPort, 'ciao');
    serialPort.drain(callback);
}

// entro in discovery mode
function discovery(step) {
    // logica discovery mode
    switch (step) {
        case 1: // mando 255 finchè qualcuno non risponde con un altro 255
            // writeAndDrain(255, discovery(1));
            // timer per il timeout
            break;
        case 2: // mando l'indirizzo e aspetto la configurazione
            // timer per il timeout
            break;
        default: //pacco
            break;
    }
}