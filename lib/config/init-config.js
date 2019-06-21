const serialport = require('serialport');
const SerialPort = require('@serialport/stream');
const mqtt = require('mqtt');
const readline = require('readline');
const validator = require('validator');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
                        // in case of multiple serial connected, choose one
                        console.log("Which port do you want to use?");

                        for (let i = 0; i < ports.length; i++) {
                            console.log('[' + i + ']' + ports[i].comName);
                        }

                        rl.on('line', (input) => {
                            if (validator.isInt(input) && input.length == 1) {
                                let index = parseInt(input, 10);
                                resolve(ports[index].comName);
                            } else {
                                reject('Port not valid.');
                            }
                        });
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