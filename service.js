const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server (to receive transactions that contain notification events from Quicknode)
const server = http.createServer();

// Create a WebSocket server (to send the event's info to the chrome extensions)
const wss = new WebSocket.Server({ server });

// Store connected WebSocket clients
const clients = new Set();

// Broadcast message to all connected clients
function broadcastMessage(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  // Add the new client to the set
  clients.add(ws);

  // Remove the client from the set when the connection is closed
  ws.on('close', () => {
    clients.delete(ws);
  });
});


// Handle incoming HTTP POST requests
server.on('request', (req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        
        // Handle the request data
        let message = "";
        for (let i = 0; i < requestData.length; i++) {
          const transaction = requestData[i];
          message = 
            "Event: " + transaction.logs[0].event + "\n" +
            "Sender: " + transaction.logs[0].args.from + "\n" +
            "Subject: " + transaction.logs[0].args.subject + "\n" +
            "Body: " + transaction.logs[0].args.body + "\n";
        }
        
        // Broadcast the message to all connected clients
        console.log(message);
        broadcastMessage(message);
        
        // Send a response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Request handled successfully.' }));
      } catch (error) {
        res.statusCode = 400;
        res.end('Error parsing request body.');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});



server.listen(25565, () => {
  console.log('Server listening on port 25565');
});