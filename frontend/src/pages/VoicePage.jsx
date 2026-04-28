import { useState, useEffect } from "react";
import axios from "axios";

export default function VoicePage() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");

  let recognition;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText(transcript);
      };

      recognition.onend = () => setListening(false);
    }
  }, []);

  const startListening = () => {
    if (!recognition) return alert("Speech not supported");
    recognition.start();
    setListening(true);
  };

  const stopListening = async () => {
    recognition.stop();
    setListening(false);

    await axios.post("http://localhost:5000/api/voice", {
      text,
    });
  };

  // 🔁 Typing effect
  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;

      if (i > text.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Voice Intelligence Report</h2>

      <button onClick={startListening}>🎤 Start</button>
      <button onClick={stopListening}>Stop & Send</button>

      <div style={{ marginTop: "20px" }}>
        <p>{displayText || "Speak something..."}</p>
      </div>
    </div>
  );
}