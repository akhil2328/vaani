export default function ResponderPanel({
  responders = [],
}) {

  return (

    <div className="responder-panel">

      <div className="responder-header">

        🚑 Active Responders

      </div>

      {responders.length === 0 && (

        <div className="no-responders">

          No active responders

        </div>

      )}

      {responders.map(
        (responder) => (

          <div
            key={responder.id}
            className="responder-case"
          >

            {/* CASE TYPE */}

            <div className="responder-case-title">

              {responder.caseType}

            </div>

            {/* INCIDENT LOCATION */}

            <div className="responder-location">

              📍 {responder.location}

            </div>

            {/* RESPONDER INFO */}

            <div className="responder-list">

              <div className="responder-row">

                <div>

                  🚑 {responder.name}

                </div>

                <small>

                  ETA: {responder.eta} mins

                </small>

              </div>

              {/* STATUS */}

              <div
                className="responder-row"
                style={{
                  marginTop: "8px",
                }}
              >

                <div>

                  Status{" "}

                  <span
                    className="enroute"
                  >

                    {responder.status}

                  </span>

                </div>

                <small>

                  📏 {responder.distance} km

                </small>

              </div>

            </div>

          </div>

        )
      )}

    </div>

  );

}