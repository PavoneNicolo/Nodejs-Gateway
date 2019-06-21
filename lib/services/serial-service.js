module.exports = {
    open: (port) => {
        port.open(() => {
            console.log('Port ' + port.path + ' open... \nSerial settings:');
            console.dir(port.settings);
        });
    },

    //
    send: (port, message) => {

        // quando mi arriva un comando via MQTT devo rigirarlo in seriale al device
    },

    receive: (port, mqttClient) => {
        port.on('data', (data) => {
            // ricevo in seriale dati di ACK comando/accoppiamento e dati dei sensori
            // mando i dati via MQTT in cloud su un db
            // mqttClient.publish('topic', 'messaggio');
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