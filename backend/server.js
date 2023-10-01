const app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
})
const PORT = process.env.PORT || 5000;

let notes = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send initial notes to the client
  socket.emit('updateNotes', notes);

  // Listen for note updates from the client
  socket.on('updateNotes', (updatedNotes) => {
    notes = updatedNotes;
    // Broadcast the changes to all connected clients
    io.emit('updateNotes', notes);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});