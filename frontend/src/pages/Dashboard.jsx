import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/dashboard.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Icons
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
});
const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
});
const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
});

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🔥 DEBUG FULL DATA
  console.log("FULL DATA:", data);

  useEffect(() => {
    fetchData();

    const socket = io({
  transports: ["websocket"],
    });

    socket.on("new_crisis", (newData) => {
      setData((prev) => [newData, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("/api/crisis");
    setData(res.data);
  };

  // 🎤 VOICE
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Chrome for voice support");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onstart = () => setListening(true);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      console.log("VOICE TEXT:", text);

      await axios.post("/api/voice", { text });
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ✅ TASK ACTIONS
  const markComplete = async (id) => {
    await axios.put(`/api/crisis/complete/${id}`);
    fetchData();
  };

  const deleteCompleted = async () => {
    await axios.delete("/api/crisis/completed");
    fetchData();
  };

  // 📊 STATS
  const total = data.length;

  const urgent = data.filter(
    (d) => d.severity === "high" && d.status === "pending"
  ).length;

  const pending = data.filter((d) => d.status === "pending").length;

  // 🎯 ICON LOGIC
  const getIcon = (severity) => {
    if (severity === "high") return redIcon;
    if (severity === "medium") return yellowIcon;
    return greenIcon;
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <div className="logo">Vaani Intelligence</div>

        <button onClick={deleteCompleted} className="clear-btn">
          Clear Completed
        </button>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card white">
          <p>TOTAL REQUESTS</p>
          <h1>{total}</h1>
        </div>

        <div className="stat-card red">
          <p>URGENT CASES</p>
          <h1>{urgent}</h1>
        </div>

        <div className="stat-card blue">
          <p>PENDING</p>
          <h1>{pending}</h1>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="main-grid">

        {/* LEFT SIDE */}
        <div className="left">
          {data.map((item) => (
            <div key={item._id} className="voice-card">

              <span className={`tag ${
                item.severity === "high" ? "critical" : "warning"
              }`}>
                {item.severity === "high" ? "CRITICAL" : "WARNING"}
              </span>

              <h3>{item.type}</h3>
              <p>{item.text}</p>
              <p>📍 {item.location?.name}</p>

              <p>Status: <b>{item.status}</b></p>

              {item.status === "pending" && (
                <button
                  onClick={() => markComplete(item._id)}
                  className="complete-btn"
                >
                  Mark Completed
                </button>
              )}

            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="right">

          {/* 🎤 VOICE PANEL */}
          <div className="voice-panel">
            <div className="panel-title">VOICE INPUT</div>

            <div
              className="mic-box"
              onClick={startListening}
              style={{
                background: listening ? "#ff4d4d" : "#1e6b77",
                cursor: "pointer",
              }}
            >
              🎤
            </div>

            <div className="small">
              {listening ? "Listening..." : "Click to speak"}
            </div>
          </div>

          {/* 🗺️ MAP (FIXED + SAFE) */}
          <div className="priority" style={{ height: "320px" }}>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {data.map((item) => {
                console.log("MAP ITEM:", item);

                // ✅ SAFETY CHECK
                if (
                  !item.location ||
                  typeof item.location.lat !== "number" ||
                  typeof item.location.lng !== "number"
                ) {
                  return null;
                }

                return (
                  <Marker
                    key={item._id}
                    position={[item.location.lat, item.location.lng]}
                    icon={getIcon(item.severity)}
                  >
                    <Popup>
                      <b>{item.type}</b><br />
                      {item.text}<br />
                      📍 {item.location.name}<br />
                      ⚠️ {item.severity}<br />
                      ✅ {item.status}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

        </div>
      </div>

    </div>
  );
}