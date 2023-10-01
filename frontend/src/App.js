import './App.css';
import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import {nanoid} from "nanoid"
import Whiteboard from './Whiteboard';

// no dotenv
const socket = io.connect("http://localhost:5000")
const userName = nanoid(4)
function App() {
  const [message, title, setMessage] = useState('')
  const [chat, setChat] = useState([])

  const sendChat = (e) => {
    e.preventDefault()
    socket.emit("chat", {message, userName})
    setMessage('')
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload])
    })
  })
  return (
    <div className="App">
      <Whiteboard />
    </div>
  );
}

export default App;
