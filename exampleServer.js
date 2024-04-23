/*
 *
 * Please note, that this sample serves for the BASIC and the PLUS asset! It contains Emits, that will not work with the BASIC asset.
 * These emits are commented accordingly below.
 * 
 */

const io = require('socket.io')(8123, { //8123 is the local port we are binding the demo server to
  pingInterval: 30005,		//An interval how often a ping is sent
  pingTimeout: 5000,		//The time a client has to respont to a ping before it is desired dead
  upgradeTimeout: 3000,		//The time a client has to fullfill the upgrade
  allowUpgrades: true,		//Allows upgrading Long-Polling to websockets. This is strongly recommended for connecting for WebGL builds or other browserbased stuff and true is the default.
  cookie: false,			//We do not need a persistence cookie for the demo - If you are using a load balöance, you might need it.
  serveClient: true,		//This is not required for communication with our asset but we enable it for a web based testing tool. You can leave it enabled for example to connect your webbased service to the same server (this hosts a js file).
  allowEIO3: false,			//This is only for testing purpose. We do make sure, that we do not accidentially work with compat mode.
  cors: {
    origin: "*"				//Allow connection from any referrer (most likely this is what you will want for game clients - for WebGL the domain of your sebsite MIGHT also work)
  }
});


//This funciton is needed to let some time pass by between conversation and closing. This is only for demo purpose.
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

// App Code starts here

console.log('Starting Socket.IO v4 demo server, listening on port 8123');

io.on('connection', (socket) => {
	console.log('[' + (new Date()).toUTCString() + '] game connecting');
	
    socket.on('KnockKnock', (data) => {
		console.log('[' + (new Date()).toUTCString() + '] game knocking... Answering "Who\'s there?"...');
        socket.emit('WhosThere');
    });

    socket.on('ItsMe', async (data) => {
		console.log('[' + (new Date()).toUTCString() + '] received game introduction. Welcoming the guest...');
        socket.emit('Welcome', 'Hi customer using unity' + data.version + ', this is the backend microservice. Thanks for buying our asset. (No data is stored on our server)');
        socket.emit('TechData', {
			podName: 'Local Test-Server',
			timestamp: (new Date()).toUTCString()
		});
    });
	
	socket.on('SendNumbers', async (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Client is asking for random number array');
		socket.emit('RandomNumbers', [ Math.ceil((Math.random() * 100)), Math.ceil((Math.random() * 100)), Math.ceil((Math.random() * 100)) ]);
	});
	
  //This is only applying to the PLUS asset!
	socket.on('DemoAck', async (data, callback) => {
    if (typeof callback != "function") return;
		console.log('[' + (new Date()).toUTCString() + '] Client is sending a DemoAck with data: ' + data);
	  callback("Received acknowledgement request at " + (new Date()).toUTCString() + " UTC");
    console.log('[' + (new Date()).toUTCString() + '] DemoAck callback finished');
	});

  //This is only applying to the PLUS asset!
	socket.on('BinRequest', async (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Client is sending binary data. Verifying...');
    let decoded = data.toString();
    if (decoded == 'Hello Server') {
      console.log('[' + (new Date()).toUTCString() + '] Data was valid.');
      //This is only applying to the PLUS asset!
      socket.emit('BinResponse', Buffer.from("The delivered data was valid!"));
    } else {
      console.log('[' + (new Date()).toUTCString() + '] Data was invalid.');
      //This is only applying to the PLUS asset!
      socket.emit('BinResponse', Buffer.from("The delivered data was invalid: " + decoded));
    }
	});
	
	socket.on('Goodbye', async (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Client said "' + data + '" - The server will disconnect the client in five seconds. You can now abort the process (and restart it afterwards) to see an auto reconnect attempt.');
		await sleep(5000); //This is only for demo purpose.
		socket.disconnect(true);
	});
	
	


	//##### PingPong Examples #####
	
    socket.on('PING', async (data) => {
		console.log('[' + (new Date()).toUTCString() + '] incoming PING #' + data + ' answering PONG with some jitter...');
		await sleep(Math.random() * 2000);
        socket.emit('PONG', data);
    });
	
	//This applies to the PLUS asset only (Acknowledgements)
	socket.on('PingV2', async (data, callback) => {
    if (typeof callback != "function") return;
	  callback(1); //The 1 is a dummy payload here
	});
	
	
	
	
	

	socket.on('disconnect', (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Bye, client ' + socket.id);
	});
	
});

