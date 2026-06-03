import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import CrisisMap from "../components/CrisisMap";

export default function MapPage() {

  const [data, setData] = useState([]);
  const [responders, setResponders] =
    useState([]);

  useEffect(() => {

    fetchData();

    const socket =
      io("http://localhost:5000");

    socket.on(
      "new_crisis",
      (newData) => {

        setData(prev => [
          newData,
          ...prev
        ]);

      }
    );

    return () =>
      socket.disconnect();

  }, []);

  const fetchData =
    async () => {

      const res =
        await axios.get(
          "http://localhost:5000/api/crisis"
        );

      setData(res.data);
      const responderData =
        res.data.flatMap(
          item =>
            item.responders || []
        );

      setResponders(responderData);

    };

  
    console.log("Responders:", responders);
    return (

    <CrisisMap
      data={data}
    
    />

  );

}