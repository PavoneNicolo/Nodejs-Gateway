//const serialport = require('serialport');// include the library
//const SerialPort = require('@serialport/stream');
const serialportLibEvents = require('./lib/serialport-library-events/serial-events');
const config = require('./lib/config/init-config');

const portName = process.argv[2];// get port name from the command line
const serialOptions = {baudRate: 9600, dataBits: 8, stopBits: 2, parity: 'odd'};

//const myPort = new SerialPort(portName, serialOptions);
const myPort = config.portConfig(portName, serialOptions);
//const Readline = SerialPort.parsers.Readline; // make instance of Readline parser
//const parser = new Readline(); // make a new parser to read ASCII lines
const parser = config.getParser(); // make a new parser to read ASCII lines

myPort.pipe(parser); // pipe the serial stream to the parser

// start serialport events listeners
serialportLibEvents.open(myPort);
serialportLibEvents.receive(parser);
serialportLibEvents.close(myPort);
serialportLibEvents.error(myPort);

//myPort.write("ciao");

