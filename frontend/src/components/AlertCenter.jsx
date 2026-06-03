export default function AlertCenter({
  data = [],
}) {

  const alerts = [...data]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    )
    .slice(0, 5);

  return (

    <div className="alert-center">

      <h3>

        🚨 Alert Center

      </h3>

      {alerts.length === 0 && (

        <p>

          No alerts

        </p>

      )}

      {alerts.map(
        (alert) => (

          <div
            key={alert._id}
            className={`alert-item ${
              alert.severity === "high"
                ?"alert-high"
                :""
              
            }`}
          >

            <strong>

              {alert.type}

            </strong>

            <br />

            📍{" "}
            {
              alert.location?.name
            }

            <br />

            <small>

              🕒{" "}
              {new Date(
                alert.createdAt
              ).toLocaleTimeString()}

            </small>

          </div>

        )
      )}

    </div>

  );

}