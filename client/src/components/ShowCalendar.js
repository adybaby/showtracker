import React from "react";

const ShowCalendar = ({ showCalendar }) => {
  return (
    <div>
      <left>
        <h3>Shows</h3>
      </left>
      {showCalendar.map(showCalendar => (
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{showCalendar.name}</h5>
            <p class="card-text">{showCalendar.id}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowCalendar;
