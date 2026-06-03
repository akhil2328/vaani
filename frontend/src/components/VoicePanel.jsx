export default function VoicePanel({

  listening,

  processing,

  statusText,

  startListening,

}) {

  return (

    <div className="voice-panel">

      <div className="panel-title">
        VOICE INPUT
      </div>

      {/* MIC */}

      <div
        className="mic-box"
        onClick={
          processing
            ? null
            : startListening
        }
        style={{

          background:
            listening
              ? "#ff4d4d"
              : processing
              ? "#ffaa00"
              : "#1e6b77",

          cursor:
            processing
              ? "not-allowed"
              : "pointer",

          transform:
            listening
              ? "scale(1.1)"
              : "scale(1)",

          transition:
            "0.3s",

        }}
      >

        {processing
          ? "⚡"
          : "🎤"}

      </div>

      {/* STATUS */}

      <div
        className="small"
        style={{
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >

        {statusText}

      </div>

    </div>

  );

}