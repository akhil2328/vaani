import { useState, useRef } from "react";

import API from "../services/api";

export default function useVoiceRecognition(fetchData, setTempCases) {
  // ======================
  // STATES
  // ======================

  const [listening, setListening] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [statusText, setStatusText] = useState("Idle");

  const recognitionRef = useRef(null);

  // ======================
  // START LISTENING
  // ======================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    // ======================
    // CHECK SUPPORT
    // ======================

    if (!SpeechRecognition) {
      alert("Please use Google Chrome");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    // ======================
    // ON START
    // ======================

    recognition.onstart = () => {
      setListening(true);

      setStatusText("Listening...");
    };

    // ======================
    // ON RESULT
    // ======================

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;

      console.log("VOICE TEXT:", text);

      // ======================
      // TEMP CARD
      // ======================

      const tempId = Date.now();

      const tempCase = {
        _id: tempId,

        text,

        type: "Analyzing...",

        severity: "medium",

        status: "processing",

        confidence: 0,

        threatScore: 0,

        location: {
          name: "Detecting...",
        },
      };

      setTempCases((prev) => [tempCase, ...prev]);

      // ======================
      // UI STATES
      // ======================

      setListening(false);

      setProcessing(true);

      setStatusText("Analyzing emergency...");

      try {
        // ======================
        // SMALL UX DELAY
        // ======================

        await new Promise((r) => setTimeout(r, 400));

        setStatusText("Detecting location...");

        // ======================
        // LIVE GPS
        // ======================

        navigator.geolocation.getCurrentPosition(
          // ======================
          // SUCCESS
          // ======================

          async (position) => {
            try {
              const lat = position.coords.latitude;

              const lng = position.coords.longitude;

              console.log("LIVE GPS:", lat, lng);

              // ======================
              // SEND TO BACKEND
              // ======================

              const response = await API.post("/voice", {
                text,

                liveLocation: {
                  lat,
                  lng,
                },
              });

              console.log("VOICE RESPONSE:", response.data);

              // ======================
              // REMOVE TEMP CARD
              // ======================

              setTempCases((prev) =>
                prev.filter((item) => item._id !== tempId),
              );

              // ======================
              // REFRESH DATA
              // ======================

              await fetchData();

              // ======================
              // SUCCESS
              // ======================

              setStatusText("Emergency Registered ✅");

              setTimeout(() => {
                setProcessing(false);

                setStatusText("Idle");
              }, 2000);
            } catch (err) {
              console.log("VOICE ERROR:", err);

              setTempCases((prev) =>
                prev.filter((item) => item._id !== tempId),
              );

              setProcessing(false);

              setStatusText("Detection Failed ❌");
            }
          },

          // ======================
          // GPS FAILURE
          // ======================

          async (gpsError) => {
            try {
              console.log("GPS FAILED:", gpsError);

              // ======================
              // WITHOUT GPS
              // ======================

              const response = await API.post("/voice", { text });

              console.log("VOICE RESPONSE:", response.data);

              // ======================
              // REMOVE TEMP CARD
              // ======================

              setTempCases((prev) =>
                prev.filter((item) => item._id !== tempId),
              );

              // ======================
              // REFRESH
              // ======================

              await fetchData();

              // ======================
              // SUCCESS
              // ======================

              setStatusText("Emergency Registered ✅");

              setTimeout(() => {
                setProcessing(false);

                setStatusText("Idle");
              }, 2000);
            } catch (err) {
              console.log("VOICE ERROR:", err);

              setTempCases((prev) =>
                prev.filter((item) => item._id !== tempId),
              );

              setProcessing(false);

              setStatusText("Detection Failed ❌");
            }
          },

          // ======================
          // GPS OPTIONS
          // ======================

          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      } catch (err) {
        console.log("VOICE PROCESS ERROR:", err);

        setTempCases((prev) => prev.filter((item) => item._id !== tempId));

        setProcessing(false);

        setStatusText("Detection Failed ❌");
      }
    };

    // ======================
    // MIC ERROR
    // ======================

    recognition.onerror = (err) => {
      console.log("MIC ERROR:", err);

      setListening(false);

      setProcessing(false);

      setStatusText("Mic Error ❌");
    };

    // ======================
    // END
    // ======================

    recognition.onend = () => {
      setListening(false);
    };

    // ======================
    // START MIC
    // ======================

    recognition.start();

    recognitionRef.current = recognition;
  };

  // ======================
  // EXPORTS
  // ======================

  return {
    listening,

    processing,

    statusText,

    startListening,
  };
}
