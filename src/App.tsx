import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<string[]>([])  
  const [input, setInput] = useState("")
const wsRef = useRef<WebSocket | null>(null);

useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: "join",
      payload: { roomId: "123456" }
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "chat") {
      setMessages(prev => [...prev, data.payload.message]);
    }
  };

  wsRef.current = ws;

  return () => ws.close();
}, []);

const sendMessage = () => {
  if (!input.trim()) return;

  wsRef.current?.send(
    JSON.stringify({
      type: "chat",
      payload: { message: input },
    })
  );

  setInput("");
};
  return (
    <div className='h-screen w-screen display flex items-center justify-center p-3'>
    <div className='w-[800px] h-[700px] border border-white/30 rounded-lg'>
    {/* chats */}
    <div className='w-full p-5 h-[85%]'>
      <div className='w-full flex items-center justify-between pb-3'>
        <p className='text-4xl font-bold'>Chats</p>
      </div>

      {/* The chat window */}
      <div className='w-full h-[95%] border border-white/10 rounded-lg overflow-y-scroll p-5'>
        {messages.map((message, index) => (
          <div key={index} className='p-2 border border-white/10 rounded-lg w-fit bg-white text-black m-1'>
            <p >{message}</p>
          </div>
        ))}
      </div>
    </div>
    {/* input */}
    <div className='w-full p-5 h-[15%] flex gap-2'>
      <input type="text" placeholder='Type your message...' className='w-full h-[40px] p-2 border border-white/10 rounded-lg' onChange={(e)=>setInput(e.target.value)}/>
      <button className='h-[40px] text-white rounded-lg bg-blue-500' onClick={sendMessage}>Send</button>
    </div>
    </div>  
    </div>
  )
}

export default App
