import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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

  const handleCreateNote = () => {
    const createdNote = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
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
            <Card style={{ width: '18rem', backgroundColor: "aqua"}}id={`note-${note.id}`} className="note">
            <Card.Header className='p-2'> 
              <Navbar className='p-1'>
                <Navbar.Brand className="customname justify-content-start">created by: <span><br/></span> <b>{note.title}</b></Navbar.Brand>
                
                <Container className='p-1 justify-content-end'>
                  <Button onClick={() => document.getElementById(`note-${note.id}`).style.backgroundColor="aqua"} 
                  style={{ borderColor: 'lightskyblue', backgroundColor: "aqua", color: "black"}} className="justify-content-end nav-btn" variant="info">&#9679;
                  </Button>{' '}
                  <Button onClick={() => document.getElementById(`note-${note.id}`).style.backgroundColor="yellow"} 
                  style={{ borderColor: 'orange', backgroundColor: "yellow", color: "black"}} className="justify-content-end nav-btn" >&#9679;
                  </Button>{' '}
                  <Button onClick={() => document.getElementById(`note-${note.id}`).style.backgroundColor="lightgray"}  
                  style={{ borderColor: 'greenyellow', backgroundColor: "lightgray", color: "black" }} className="justify-content-end nav-btn">&#9679;
                  </Button>{' '}
                  <Button onClick={() => document.getElementById(`note-${note.id}`).remove()} 
                  style={{ borderColor: 'pink' }} className="justify-content-end nav-btn" variant="danger">X
                  </Button>{' '}
               </Container>
              </Navbar>
            </Card.Header>
              <Card.Body>
              {/*<Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Control 
                    type="text" 
                    placeholder="Title" 
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} 
                  />
                </Form.Group>
                <Form.Group className="mb-3 bg-info" controlId="exampleForm.ControlTextarea1">
                  <Form.Control className='bg-info' 
                    as="textarea" 
                    rows={4}
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}  
                  />
                </Form.Group>
              </Form>*/}

              
              <Card.Title className="note-header">{note.title} </Card.Title>
                <Card.Text>{note.content}</Card.Text> 
               <Card.Text></Card.Text>
              </Card.Body>
            </Card>
            
          </Draggable>
        ))}
      </div>
      {/* Input fields for creating new notes at the bottom of the page */}
      <div className="create-note" style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#f9f9f9', margin: '0px',paddingBottom:"0px", borderTop: '1px solid #ccc' }}>
      <Row className="g-2 mx-2 mt-2">
        <Col md>
          <FloatingLabel controlId="floatingSelect" label="Groups">
            <Form.Select className=''>
              <option value="Sov Patrullen">Sov Patrullen</option>
              <option value="Projektledning">Projektledning</option>
              <option value="HR">HR</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Title">
            <Form.Control 
              type="text" 
              placeholder="Title" 
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="create-note-input"/>
          </FloatingLabel>
        </Col>
      </Row>
        
      <Row className='g-2 mx-2 mt-2'>
      <Col md={8}>
          <FloatingLabel
            controlId="floatingTextarea"
            label="Comments"
            className="mb-3"
          >
            <Form.Control 
              as="textarea" 
              placeholder="Leave a comment here"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="create-note-input"
            />
          </FloatingLabel>
        </Col>
        <Col md>
          <div className="d-grid gap-2">
            <Button
            size="lg"
            className='h-100' 
            onClick={() => handleCreateNote()} 
            variant="primary">New Note</Button>{' '}
          </div>
        </Col>
      </Row>
      
     {/*}
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
        />*/}
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