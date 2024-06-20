import React from "react";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api-v1/product/1")
    .then((res) => res.json()) // Parse JSON asynchronously
    .then((data) => {
      setData(data.Name);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <p>{data === null ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
