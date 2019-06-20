const serialport = require('serialport');// include the library
const SerialPort = require('@serialport/stream');
const serialportLibEvents = require('./lib/serialport-library-events/serial-events');
const config = require('./lib/config/init-config');

const portName = process.argv[2];// get port name from the command line
const parser = config.getParser(); // make a new parser to read ASCII lines
const serialOptions = {baudRate: 9600, dataBits: 8, stopBits: 2, parity: 'odd', autoOpen: false, parser: parser};
const serialPort = config.portConfig(portName, serialOptions);

// start serialport events listeners
serialportLibEvents.open(serialPort);
serialportLibEvents.receive(serialPort);
serialportLibEvents.close(serialPort);
serialportLibEvents.error(serialPort);

//myPort.write("ciao");

