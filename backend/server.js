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
    console.log('Received updateNotes event from a client:', updatedNotes);
    notes = updatedNotes;

    // Broadcast the changes to all connected clients, including the sender
    io.emit('updateNotes', notes);
  });

  // Listen for noteClicked event
  socket.on('noteClicked', (noteId) => {
    // Broadcast the noteClicked event to all connected clients, including the sender
    io.emit('noteClicked', noteId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});