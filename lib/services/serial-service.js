module.exports = {
    open: (port) => {
        port.open(() => {
            console.log('Port ' + port.path + ' open... \nSerial settings:');
            console.dir(port.settings);
        });
    },

    send: (port, message) => {
        // quando mi arriva un comando via MQTT devo rigirarlo in seriale al device
        // mando i dati ad un db in cloud per salvarli e mostrarli nella dashboard
    },

    receive: (port, mqttClient) => {
        port.on('data', (data) => {
            // quando un comando/accoppiamento è stato eseguito mando la conferma sui topic di conferma
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