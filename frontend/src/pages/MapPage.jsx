import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

export default function MapPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();

    const socket = io("http://localhost:5000");

    socket.on("new_crisis", (newData) => {
      setData(prev => [newData, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/crisis");
    setData(res.data);
  };

  const getIcon = (severity) => {
    if (severity === "high") return redIcon;
    if (severity === "medium") return yellowIcon;
    return greenIcon;
  };

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "90vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data.map((item, i) => (
        item.location?.lat && (
          <Marker
            key={i}
            position={[item.location.lat, item.location.lng]}
            icon={getIcon(item.severity)}
          >
            <Popup>
              <b>{item.type}</b><br />
              {item.text}<br />
              📍 {item.location.name}<br />
              ⚠️ {item.severity}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}