import { useState } from 'react';
import axios from 'axios';

function App() {
  const [result, setResult] = useState(null);
  const [type, setType] = useState('e');

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:9876/numbers/${type}`);
      setResult(res.data);
    } catch (err) {
      alert('Error fetching data');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>📊 Average Calculator Microservice</h2>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="e">Even</option>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="r">Random</option>
      </select>

      <button onClick={fetchData} style={{ marginLeft: 10 }}>Fetch Numbers</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>🔢 Result:</h3>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            {/* Display each number horizontally */}
            {result.numbers && result.numbers.map((num, index) => (
              <div key={index} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                {num}
              </div>
            ))}
          </div>
          {/* If you also want to display window and average info */}
          {result.windowPrevState && (
            <div style={{ marginTop: '10px' }}>
              <strong>Previous Window:</strong> {JSON.stringify(result.windowPrevState)}
            </div>
          )}
          {result.windowCurrState && (
            <div style={{ marginTop: '10px' }}>
              <strong>Current Window:</strong> {JSON.stringify(result.windowCurrState)}
            </div>
          )}
          {result.avg && (
            <div style={{ marginTop: '10px' }}>
              <strong>Average:</strong> {result.avg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
