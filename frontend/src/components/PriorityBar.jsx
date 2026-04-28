export default function PriorityBar({ high = 0, medium = 0, low = 0 }) {
  const total = high + medium + low || 1;

  const highWidth = (high / total) * 100;
  const medWidth = (medium / total) * 100;
  const lowWidth = (low / total) * 100;

  return (
    <div className="priority">
      <h3>Priority Volume</h3>

      <div className="bar">
        <span>HIGH</span>
        <div className="fill red" style={{ width: `${highWidth}%` }}></div>
      </div>

      <div className="bar">
        <span>MED</span>
        <div className="fill yellow" style={{ width: `${medWidth}%` }}></div>
      </div>

      <div className="bar">
        <span>LOW</span>
        <div className="fill gray" style={{ width: `${lowWidth}%` }}></div>
      </div>
    </div>
  );
}