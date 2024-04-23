const io = require('socket.io')(8124, { //8124 is the local port we are binding the pingpong server to
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


//This funciton is needed to let some time pass by
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// App Code starts here

console.log('Starting Socket.IO auth sample server');

io.use((socket, next) => {
  //At this point, socket.handshake.auth id the object our callback created on the client side
  if (socket.handshake.auth.supersecret == 'UnityAuthenticationSample') {
	//Auth succeeded
	console.log('[' + (new Date()).toUTCString() + '] ACCEPTING an incoming connection...');
	next();
	return;
  }
  
  console.log('[' + (new Date()).toUTCString() + '] rejecting an incoming connection, because ' + socket.handshake.auth.supersecret + ' does not match UnityAuthenticationSample');
  const err = new Error("not authorized");
  err.data = { content: "Please retry later" }; // additional details
  next(err);
});


io.on('connection', async (socket) => {

	socket.on('disconnect', (reason) => {
		console.log('[' + (new Date()).toUTCString() + '] ' + socket.id + ' disconnected.');
	});
	
	var cnt = 0;
	console.log('[' + (new Date()).toUTCString() + '] Unity connecting with SocketID ' + socket.id);	
	await sleep(4000);
	console.log('[' + (new Date()).toUTCString() + '] Cleanly disconnecting SocketID ' + socket.id);	
    socket.disconnect(); //No object delivered means clean!

});

