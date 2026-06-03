import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrisisList({
  data,
  markComplete,
}) {

  const navigate = useNavigate();

  const [
    expandedCases,
    setExpandedCases,
  ] = useState({});

  const toggleCase = (id) => {

    setExpandedCases(
      (prev) => ({

        ...prev,

        [id]: !prev[id],

      })
    );

  };

  return (

    <div className="crisis-list">

      {data.map((item) => (

        <div
          key={item._id}
          className={`voice-card

            ${
              item.status ===
              "processing"
                ? "processing-card"
                : ""
            }

            ${
              item.severity ===
              "high"
                ? "high-threat"
                : item.severity === "medium"
                ? "medium-threat"
                : "low-threat"
            }
          `}
        >

          {/* HEADER */}

          <div
            className="case-header"
            onClick={() =>
              toggleCase(item._id)
            }
          >

            <div>

              <strong>
                {item.type}
              </strong>

              <br />

              <small>
                📍 {
                  item.location?.name
                }
              </small>

            </div>

            <div>

              {expandedCases[
                item._id
              ]
                ? "▲"
                : "▼"}

            </div>

          </div>

          {/* SEVERITY */}

          <span
            className={`tag

              ${
                item.severity ===
                "high"
                  ? "critical"
                  : item.severity ===
                    "medium"
                  ? "warning"
                  : "normal"
              }
            `}
          >

            {item.severity?.toUpperCase()}

          </span>

          {/* DETAILS */}

          {expandedCases[
            item._id
          ] && (

            <>

              {/* DESCRIPTION */}

              <p>

                {item.text}

              </p>

              {/* AI METRICS */}

              <div className="ai-metrics">

                <span>

                  🎯 Confidence:

                  <b>

                    {" "}

                    {
                      item.confidence ||
                      90
                    }

                    %

                  </b>

                </span>

                <span>

                  ⚠ Threat:

                  <b>

                    {" "}

                    {
                      item.threatScore ||
                      5
                    }

                    /10

                  </b>

                </span>

              </div>

              {/* RESPONDERS */}

              {item.responders &&
                item.responders.length > 0 && (

                <div className="responders">

                  <h4>

                    🚑 Assigned Responders

                  </h4>

                  {item.responders.map(

                    (
                      responder,
                      index
                    ) => (

                      <div
                        key={index}
                        className="responder-item"
                      >

                        <strong>

                          {
                            responder.name
                          }

                        </strong>

                        <br />

                        📏 {

                          responder.distance

                        }

                        km

                      </div>

                    )

                  )}

                </div>

              )}

              {/* TIMELINE */}

              <div className="timeline">

                <h4>

                  🕒 Recent Activity

                </h4>

                <div className="timeline-item">

                  🕒{" "}

                  {new Date(
                    item.createdAt
                  ).toLocaleTimeString()}

                </div>

                <div className="timeline-item">

                  🤖 AI Analysis Completed

                </div>

                {item.responders &&
                  item.responders.length > 0 && (

                  <div className="timeline-item">

                    🚑 Responders Assigned

                  </div>

                )}

                {item.status ===
                  "completed" && (

                  <div className="timeline-item">

                    ✔ Case Closed

                    <br />

                    <small>

                      {new Date(
                        item.updatedAt
                      ).toLocaleTimeString()}

                    </small>

                  </div>

                )}

              </div>

              {/* STATUS */}

              <p>

                Status:

                <b>

                  {" "}

                  {item.status}

                </b>

              </p>
              <button  
                className="map-btn"
                onClick={() =>
                  navigate("/map")
                }
              >
                🗺 View Map
              </button>

              {/* COMPLETE BUTTON */}

              {item.status ===
                "pending" && (

                <button
                  className="complete-btn"
                  onClick={() =>
                    markComplete(
                      item._id
                    )
                  }
                >

                  Mark Completed

                </button>

              )}

            </>

          )}

        </div>

      ))}

    </div>

  );

}