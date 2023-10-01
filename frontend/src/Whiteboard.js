import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

const Whiteboard = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    // Listen for updates from the server
    socket.on('updateNotes', (updatedNotes) => {
      setNotes(updatedNotes);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('updateNotes');
    };
  }, []);

  const handleDragStop = (id, position) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, position } : note
    );

    setNotes(updatedNotes);
    socket.emit('updateNotes', updatedNotes);
  };

  const handleCreateNote = (position) => {
    const createdNote = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      position,
    };

    const updatedNotes = [...notes, createdNote];

    setNotes(updatedNotes);
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
            <div id={`note-${note.id}`} className="note">
              <div className="note-header">{note.title}</div>
              <div className="note-content">{note.content}</div>
              <input
                type="text"
                value={note.title}
                onChange={(e) => handleNoteTitleChange(note.id, e.target.value)}
                placeholder="Title"
                className="note-input"
              />
              <textarea
                placeholder="Content"
                value={note.content}
                onChange={(e) => handleNoteContentChange(note.id, e.target.value)}
                className="note-input"
              />
            </div>
          </Draggable>
        ))}
      </div>
      {/* Input fields for creating new notes at the bottom of the page */}
      <div className="create-note" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#f9f9f9', padding: '10px', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="create-note-input"
        />
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