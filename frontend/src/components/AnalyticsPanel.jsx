export default function AnalyticsPanel({
  data = [],
}) {

  const fireCases =
    data.filter(
      (item) =>
        item.type
          ?.toLowerCase()
          .includes("fire")
    ).length;

  const medicalCases =
    data.filter(
      (item) =>
        item.type
          ?.toLowerCase()
          .includes("medical")
    ).length;

  const crimeCases =
    data.filter(
      (item) =>
        item.type
          ?.toLowerCase()
          .includes("crime")
    ).length;

  const highSeverity =
    data.filter(
      (item) =>
        item.severity ===
        "high"
    ).length;

  const mediumSeverity =
    data.filter(
      (item) =>
        item.severity ===
        "medium"
    ).length;

  const lowSeverity =
    data.filter(
      (item) =>
        item.severity ===
        "low"
    ).length;

  return (

    <div className="analytics-panel">

      <h3>

        📊 Incident Analytics

      </h3>

      <div className="analytics-grid">

        <div className="analytics-card">

          🔥 Fire

          <span>

            {fireCases}

          </span>

        </div>

        <div className="analytics-card">

          🚑 Medical

          <span>

            {medicalCases}

          </span>

        </div>

        <div className="analytics-card">

          🚓 Crime

          <span>

            {crimeCases}

          </span>

        </div>

      </div>

      <div className="analytics-severity">

        <div>

          🔴 High:
          {" "}
          {highSeverity}

        </div>

        <div>

          🟡 Medium:
          {" "}
          {mediumSeverity}

        </div>

        <div>

          🟢 Low:
          {" "}
          {lowSeverity}

        </div>

      </div>

    </div>

  );

}