import React, { useState, useEffect } from 'react'
import './App.css'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }
const downloadTxtFile =()=>{
  console.log("down");
  const element = document.createElement("a");
  const file = new Blob([savedNotes],{
      type:"text/plain;charset-utf-8"
  });
  element.href = URL.createObjectURL(file);
  element.download = "textdocument"
  document.body.appendChild(element);
  element.click();
};
  return (
    <>
      <h1>Voice Notes</h1>
      <div className="noteContainer">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>Recording...</span> : <span>stopped</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <button primary onClick={downloadTxtFile}>Download saved notes</button>
          <p>{note}</p>
        </div>
        </div>
        <div className="noteContainer">
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
        </div>
        
    </>
  )
}

export default App