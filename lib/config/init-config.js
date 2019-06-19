const serialport = require('serialport');// include the library
const SerialPort = require('@serialport/stream');

module.exports = {
    portConfig: (portName, serialOptions) => {
        return new SerialPort(portName, serialOptions);
    },
    getParser: () => {
        const Readline = SerialPort.parsers.Readline; // make instance of Readline parser
        return new Readline();
    }

};