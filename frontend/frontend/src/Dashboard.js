import { useEffect, useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/expenses")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div>
      <h2>Expense Dashboard</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Vendor</th><th>Amount</th><th>Date</th>
            <th>Risk</th><th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.vendor}</td>
              <td>{e.amount}</td>
              <td>{e.date}</td>
              <td>{e.risk_level}</td>
              <td>{e.decision}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
