const serialService = require('./services/serial/serial-service');
const initConfig = require('./config/init-config');
const event = require('./services/event-emitter/event-emitter');
const brokerURL = 'mqtt://192.168.101.122'; // TODO spostare roba MQTT su un file mqtt-service
//const brokerURL = 'mqtt://127.0.0.1'; TODO da usare quando il codice è caricato nel raspberry
const options = {
    username: 'gateway',
    password: 'gateway'
};

const eventEmitter = event.commonEmitter;

eventEmitter.on('enablePolling', polling);
eventEmitter.on('discoveryMode', discovery);

// initialize serial port
serialService.serialPortInit()
// start serial port event-emitter listeners
    .then(() => {
        //eventEmitter.emit('discoveryMode', 2);
        serialService.open();
        serialService.receive();
        serialService.close();
        serialService.error();
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

let find = true;

// polling verrà richiamata da un event emitter quando finirò di ricevere il dato
function polling() {
    console.log('polling lets go');
    while (true) {
        // controllo la coda dei comandi
        // se trovo un comando di entrare in discovery mode
        /*eventEmitter.emit('discoveryMode', 1);
        break;*/

        // se trovo un comando lo mando in seriale
        if (find) {
            writeAndDrain('invio comando ricevuto dall\'utente', () => {
                console.log("comando inviato!");
                // una volta mandato il dato faccio il break e aspetto di ricevere una risposta
                // parte un timer per il timeout
                // break; //trovare un altro modo per uscire dal polling
                //return;
            })
            //find = false;
            break
        } else {
            // controllo la coda dei collect
            // se trovo qualcosa lo mando in seriale
            writeAndDrain(' invio comando di collect', () => {
                console.log("collect!");
                // una volta mandato il dato faccio il break e aspetto di ricevere una risposta
                // parte un timer per il timeout
                // break; //trovare un altro modo per uscire dal polling
                //return;
            });
            //find = true;
            break
        }
    }
}

function discovery(step) {
    switch (step) {
        case 1: // mando 255 finchè qualcuno non risponde con un altro 255
            // writeAndDrain(255, discovery(1));
            // timer per il timeout
            console.log("step uno");
            break;
        case 2: // mando l'indirizzo e aspetto la configurazione
            // timer per il timeout
            console.log("step due");
            break;
        default: //pacco
            console.log("default")
            break;
    }
}

function writeAndDrain(data, callback) {
    serialService.send(data);
    serialService.drain(callback);
}
