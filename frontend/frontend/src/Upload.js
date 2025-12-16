import { useState } from "react";
import { processExpense } from "./api";

export default function Upload() {
  const [file, setFile] = useState();
  const [result, setResult] = useState(null);

  const upload = async () => {
    const data = await processExpense(file, "EMP123");
    setResult(data);
  };

  return (
    <div>
      <h2>Upload Receipt</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Process</button>

      {result && (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
