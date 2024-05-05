import React from "react";

const OtherData = ({
  addMedication,
  currentMedication,
  setCurrentMedication,
}) => {
  return (
    <div>
      <div className="Medications">
        <h1>Medications : </h1>
        <input
          type="text"
          value={currentMedication}
          onChange={(e) => setCurrentMedication(e.target.value)}
        />
        <button onClick={() => addMedication()}>Add</button>
      </div>
    
    </div>
  );
};

export default OtherData;