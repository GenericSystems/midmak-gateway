import React, { useState } from "react";
import "./TimeTable.css";

const TimeTable = () => {
  
  const initialData = [
    { time: "8:00 AM", monday: "", tuesday: "" },
    { time: "8:30 AM", monday: "", tuesday: "" },
    { time: "9:00 AM", monday: "", tuesday: "" },
    { time: "9:30 AM", monday: "", tuesday: "" },
    { time: "10:00 AM", monday: "", tuesday: "" },
    { time: "10:30 AM", monday: "", tuesday: "" },
   
  ];

  const [data, setData] = useState(initialData);
  const [isDragging, setIsDragging] = useState(false);

  const toggleSelected = (rowIndex, cellIndex) => {
    const updatedData = [...data];
    const cellValue = updatedData[rowIndex][Object.keys(updatedData[rowIndex])[cellIndex]];
    updatedData[rowIndex][Object.keys(updatedData[rowIndex])[cellIndex]] =
      cellValue === "selected" ? "" : "selected";
    setData(updatedData);
  };

  const handleMouseDown = (rowIndex, cellIndex) => {
    if (cellIndex !== 0) {
      setIsDragging(true);
      toggleSelected(rowIndex, cellIndex);
    }
  };

  const handleMouseEnter = (rowIndex, cellIndex) => {
    if (isDragging && cellIndex !== 0) { 
      toggleSelected(rowIndex, cellIndex);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="timetable-container">
      <table className="timetable" onMouseUp={handleMouseUp}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((day, cellIndex) => (
                <td
                  key={day}
                  className={`timetable-cell ${cellIndex === 0 ? 'time-cell' : row[day]}`}
                  onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                >
                  {cellIndex === 0 ? row[day] : row[day]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;