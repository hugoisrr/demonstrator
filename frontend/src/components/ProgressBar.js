import React from "react";

export const ProgressBar = props => {
  const colors = ["bg-danger", "bg-warning", "bg-success"];
  return (
    <div className="progress">
      {props.progress.map((item, index) => {
        var percentage =
          (100 / props.progress.reduce((a, b) => a + b, 0)) * item;
        return (
          <div
            id="progressBar11"
            className={`progress-bar ${colors[index]}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.floor(percentage)}%
          </div>
        );
      })}
      {/* <div
        id="progressBar11"
        className="progress-bar bg-danger"
        role="progressbar"
        style={{ width: "33%" }}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <div
        id="progressBar12"
        className="progress-bar bg-warning"
        role="progressbar"
        style={{ width: "33%" }}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <div
        id="progressBar13"
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: "34%" }}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div> */}
    </div>
  );
};
