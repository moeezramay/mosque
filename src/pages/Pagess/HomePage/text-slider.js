import React, { useState } from "react";

function TextSlider() {
  const words = [
    { id: 0, value: "Match within a certain Mosque" },
    { id: 1, value: "Match within a certain organization!" },
    { id: 2, value: "Find your partner!" },
    { id: 3, value: "Find your soul mate!" },
  ];

  const [wordData, setWordData] = useState(words[0].value);
  const [selectedDot, setSelectedDot] = useState(0);

  const handleClick = (index) => {
    console.log(index);
    const wordSlider = words[index].value;
    setWordData(wordSlider);
    setSelectedDot(index);
  };

  return (
    <div className="changing-container-home">
      <div className="word-size">{wordData}</div>
      <div className="flexRow">
        <div className="dotsContainer">
          {words.map((data, i) => (
            <span
              key={i}
              className={`dot ${selectedDot === i ? "selected" : ""}`}
              onClick={() => handleClick(i)}
            ></span>
          ))}
          <span className="dotPlaceholder">.</span>
        </div>
      </div>
    </div>
  );
}

export default TextSlider;
