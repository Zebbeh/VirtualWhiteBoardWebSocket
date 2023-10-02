import './App.css';
import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import {nanoid} from "nanoid"
import Whiteboard from './Whiteboard';
import 'bootstrap/dist/css/bootstrap.min.css';


// no dotenv
const socket = io.connect("http://localhost:5000")
const userName = nanoid(4)

function App() {
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for the noteClicked event
    socket.on('noteClicked', (noteId) => {
      console.log(`Note with ID ${noteId} clicked`);
      // You can perform any actions when a note is clicked here
    });
  }, []);

  return (
    <div className="App">
      {/* Pass the socket instance to the Whiteboard component */}
      <Whiteboard socket={socket} />
      {/* ... (other components) */}
    </div>
  );
};

export default App;