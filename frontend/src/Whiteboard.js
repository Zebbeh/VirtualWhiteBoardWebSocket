import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

const Whiteboard = ({ socket }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleCreateNote = (position) => {
    const createdNote = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      position,
    };

    const updatedNotes = [...notes, createdNote];
  setNotes(updatedNotes);

  // Debugging: Log the updatedNotes being emitted
  console.log('Emitting updateNotes event from the client:', updatedNotes);

  // Emit the updateNotes event to the server
  socket.emit('updateNotes', updatedNotes);

  // Clear the input fields after creating a note
  setNewNote({ title: '', content: '' });
};


  const handleNoteContentChange = (id, newContent) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, content: newContent } : note
    );

    setNotes(updatedNotes);
    socket.emit('updateNotes', updatedNotes);
  };

  const handleNoteTitleChange = (id, newTitle) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title: newTitle } : note
    );

    setNotes(updatedNotes);
    socket.emit('updateNotes', updatedNotes);
  };

  const handleNoteClick = (id) => {
    // Add logic to enable editing for the clicked note
    // For simplicity, I'm toggling the 'editing' property in this example
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, editing: !note.editing } : note
    );

    setNotes(updatedNotes);

    // Emit an event to signal that a note was clicked
    socket.emit('noteClicked', id);
  };

  const handleDragStop = (id, data) => {
    // Handle drag stop logic here
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, position: { x: data.x, y: data.y } } : note
    );

    setNotes(updatedNotes);
    socket.emit('updateNotes', updatedNotes);
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
    // You can add additional logic here if needed
  };
  useEffect(() => {
    // Attach the event listener to the window object
    window.addEventListener('contextmenu', handleContextMenu);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div className="whiteboard">
      <div className="notes-container">
        {notes.map((note) => (
          <Draggable
            key={note.id}
            position={note.position}
            onStop={(e, data) => handleDragStop(note.id, data)}
          >
            <div
              id={`note-${note.id}`}
              className={`note ${note.editing ? 'editing' : ''}`}
              onClick={() => handleNoteClick(note.id)}
            >
              <div className="note-header">{note.title}</div>
              <div className="note-content">{note.content}</div>
            </div>
          </Draggable>
        ))}
      </div>
      {/* Input fields for creating new notes at the bottom of the page */}
      <div className="create-note" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#f9f9f9', padding: '10px', borderTop: '1px solid #ccc' }}>
        {/* Removed input fields */}
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="create-note-input"
        />
        <button onClick={() => handleCreateNote({ x: 0, y: 0 })} className="create-note-button">Create Note</button>
      </div>
    </div>
  );
};

export default Whiteboard;