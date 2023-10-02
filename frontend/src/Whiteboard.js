import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';


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
            <Card style={{ width: '18rem' }}id={`note-${note.id}`} className="note bg-info">
            <Card.Header className='p-2'> 
              <Navbar className='p-1'>
                <Navbar.Brand className="customname justify-content-start">created by: <span><br/></span> <b>{note.title}</b></Navbar.Brand>
                
                <Container className='p-1 justify-content-end'>
                  <Button style={{ borderColor: 'lightskyblue' }} 
                    className="justify-content-end nav-btn" variant="info">&#9679;
                  </Button>{' '}
                  <Button style={{ borderColor: 'yellow' }} 
                    className="justify-content-end nav-btn" variant="warning">&#9679;
                  </Button>{' '}
                  <Button style={{ borderColor: 'greenyellow' }} 
                    className="justify-content-end nav-btn" variant="success">&#9679;
                  </Button>{' '}
                  <Button style={{ borderColor: 'pink' }} 
                    className="justify-content-end nav-btn" variant="danger">X
                  </Button>{' '}
               </Container>
              </Navbar>
            </Card.Header>
              <Card.Body>
              <Card.Title className="note-header">{note.title} </Card.Title>
                <Card.Text>{note.content}</Card.Text>
              </Card.Body>
            </Card>
            
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

/*function BasicExample() {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default BasicExample;*/