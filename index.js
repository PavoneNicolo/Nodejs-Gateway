const serialService = require('./lib/services/serial-service');
const initConfig = require('./lib/config/init-config');

// INIT

let serialPort;
let mqttClient;

// find USB serial port
initConfig.serial.getPortName()
// configure serial port
    .then((port) => {
        console.log('Port ' + port + ' selected...');
        const serialOptions = {baudRate: 9600, dataBits: 8, stopBits: 2, parity: 'odd', autoOpen: false};
        serialPort = initConfig.serial.portConfig(port, serialOptions);
    })
    // MQTT INIT
    .then(() => {
        const brokerURL = 'mqtt://192.168.101.122';
        //const brokerURL = 'mqtt://127.0.0.1'; TODO da usare quando il codice è caricato nel raspberry
        const options = {
            username: 'gateway',
            password: 'gateway'
        };
        mqttClient = initConfig.MQTT.connect(brokerURL, options);
    })
    // start serial port events listeners
    .then(() => {
        serialService.open(serialPort);
        serialService.receive(serialPort, mqttClient);
        serialService.close(serialPort);
        serialService.error(serialPort);
    })
    .then(() => {
        mqttClient.on('message', function (topic, message) {
            // giro il comando in seriale al device giusto
            // serialService.send(serialPort, message);
            console.log(message.toString());
        })
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });