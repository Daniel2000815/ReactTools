import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { evaluate } from "mathjs";

function evaluateFunction(f, min, max, step) {
  let data = [];
  let labels = [];
  let labelsSimple = [];
  let factor = 1 / step;
  console.log("VAL: " + f);

  for (var i = min * factor; i <= max * factor; i++) {
    let labelRedondeada = Math.round((i / factor) * 100) / 100;
    labels.push(labelRedondeada);

    data.push(evaluate(f, { x: labelRedondeada }));
    //data.push(f(labelRedondeada));

    if (labelRedondeada % 1 === 0) {
      labelsSimple.push(labelRedondeada.toString());
    } else labelsSimple.push("");
  }
  console.log(data);
  return [data, labels, labelsSimple];
}

export default function Graph(props) {
  var ColorScheme = require("color-scheme");
  var scheme = new ColorScheme();
  scheme.from_hue(props.hueSeed).scheme("triade").variation("soft");

  const createData = (index, f) => {
    let res = {
      label: index,
      borderWidth: 3,
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "#" + scheme.colors()[index],
      data: evaluateFunction(f, props.min, props.max, props.step)[0],
      pointBackgroundColor: "rgba(0,0,0,0)",
      pointBorderColor: "rgba(0,0,0,0)"
    };

    return res;
  };

  function createDatasets(fs, points) {
    let res = [];

    fs.map((item, index) => res.push(createData(index, item)));

    points.map((item, index) =>
      res.push({
        data: [{ x: item[0], y: item[1] }],
        label: "point",
        order: -1,
        backgroundColor: "#cd2026",
        type: "bubble"
      })
    );

    return res;
  }
  let graphData = {
    labels: evaluateFunction(props.f[0], props.min, props.max, props.step)[2],
    datasets: createDatasets(props.f, props.points)
  };

  return (
    <div style={{ width: "100%" }}>
      <Line
        data={graphData}
        options={{
          legend: {
            display: false
          },
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  suggestedMin: 0
                }
              }
            ]
          },
          responsive: true,
          title: { text: props.title, display: true }
        }}
      />
    </div>
  );
}
