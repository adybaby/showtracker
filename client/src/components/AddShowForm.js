import React from "react";

const AddShowForm = ({ addShow }) => {
  // Input tracker
  let input;

  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          var elements = input.value.split(",");
          addShow(elements[0], elements[1]);
          input.value = "";
        }}
      >
        Add Show
      </button>
    </div>
  );
};

export default AddShowForm;
