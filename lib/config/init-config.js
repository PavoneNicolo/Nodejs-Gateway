const serialport = require('serialport');// include the library
const SerialPort = require('@serialport/stream');

module.exports = {
    portConfig: (portName, serialOptions) => {
        return new SerialPort("COM3", serialOptions);
    },
    getParser: () => {
        new SerialPort.parsers.Readline('\r\n');
    }

};