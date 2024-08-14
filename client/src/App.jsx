import { useState } from "react";
import axios from "axios";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "Who won the latest Nobel Peace Prize?",
    "How to make a cake?",
    "Three things that will make you happy?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question");
      return;
    }
    const data = {
      history: chatHistory,
      message: value,
    };
  
    try {
      const response = await axios.post("http://localhost:8000/gemini", data);
  
      // Log the data to verify it is being received correctly
      console.log(response.data);
  
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: response.data.response, // Correctly access the response
        },
      ]);
      setValue("");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };
  
  

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <>
      <div className="app">
        <p>
          What do you want to know?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>
            Surprise me
          </button>
        </p>
        <div className="input-container">
          <input
            type="text"
            value={value}
            placeholder="When is Diwali ...?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask Me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
  {chatHistory.map((chatItem, index) => (
    <div key={index}>
      <p className="answer">
        {chatItem.role} : {chatItem.parts}
      </p>
    </div>
  ))}
</div>

      </div>
    </>
  );
}

export default App;
