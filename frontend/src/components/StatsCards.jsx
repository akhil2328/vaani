export default function StatsCards({
  total,
  urgent,
  pending,
}) {
  return (
    <div className="stats">

      <div className="stat-card white">
        <p>TOTAL CASES</p>
        <h1>{total}</h1>
      </div>

      <div className="stat-card red">
        <p>URGENT</p>
        <h1>{urgent}</h1>
      </div>

      <div className="stat-card blue">
        <p>PENDING</p>
        <h1>{pending}</h1>
      </div>

    </div>
  );
}