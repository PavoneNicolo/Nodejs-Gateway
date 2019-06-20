const serialport = require('serialport');
const SerialPort = require('@serialport/stream');
const mqtt = require('mqtt');

module.exports.serial = {
    getPortName: () => {
        return new Promise((resolve, reject) => {
            serialport.list((err, ports) => {
                switch (ports.length) {
                    case 0:
                        reject('No serial port detected.');
                        break;
                    case 1:
                        resolve(ports[0].comName);
                        break;
                    default:
                        reject('Multiple serial ports detected.');
                        break;
                }
            });
        });
    },
    portConfig: (portName, serialOptions) => {
        return new SerialPort(portName, serialOptions);
    }


};

module.exports.MQTT = {
    connect: (brokerURL, options) => {
        let client = mqtt.connect(brokerURL, options);

        client.on('connect', function () {
            console.log('Connected to the MQTT broker...');
            // mi sottoscrivo ai topic adatti a ricevere comandi
            client.subscribe('plutoo');
            client.subscribe('ciccio');
            client.subscribe('plutssoo');
            client.subscribe('a');
            client.subscribe('plusstoo');
            client.subscribe('plucastoo');
            client.subscribe('plucactoo');
            client.subscribe('plcautoo');
            client.subscribe('plcautoo');
            //client.subscribe('#');
        });

        return client;
    }
};