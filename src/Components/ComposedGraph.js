import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ZoomInSharpIcon from "@material-ui/icons/ZoomInSharp";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";

import ZoomOutSharpIcon from "@material-ui/icons/ZoomOutSharp";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend,
  Scatter
} from "recharts";
import { evaluate, derivative } from "mathjs";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { InlineMath, BlockMath } from "react-katex";
import { latexify } from "../Library/Latexify";

const createFunctionPoint = (keys, x, y) => {
  let res = { label: x };

  keys.map((val, index) => (res[String(val)] = y[index]));
  return res;
};

function evaluateFunctionsInPoint(fs, point) {
  let res = [];
  fs.map((f) => res.push(evaluate(f, { x: point })));
  return res;
}

function evaluateFunctions(fs, min, max, step) {
  let data = [];
  let labels = [];
  let factor = 1 / step;

  for (var i = min * factor; i <= max * factor; i++) {
    let label = Math.round((i / factor) * 100) / 100;
    labels.push(label);
    data.push(evaluateFunctionsInPoint(fs, label));
  }
  return [labels, data];
}

const intersections = (labels, values, fs) => {
  let res = [];

  for (let x = 0; x < labels.length; x++) {
    for (let f = 0; f < values.length; f++) {
      for (let i = f + 1; i < values.length; i++) {
        if (Math.abs(values[x][f] - values[x][i]) < 0.01)
          res.push([labels[x], values[x][i]]);
      }
    }
  }

  return res;
};
const data = (fs, points = [], min = -3, max = 3, step = 0.01) => {
  const functionsLabels = evaluateFunctions(fs, min, max, step)[0];

  const functionsVals = evaluateFunctions(fs, min, max, step)[1];
  let res = [];

  // Functions
  for (let i = 0; i < functionsLabels.length; i++)
    res.push(createFunctionPoint(fs, functionsLabels[i], functionsVals[i]));

  intersections(functionsLabels, functionsVals, fs).forEach((p) => {
    let index = res.findIndex((element) => element.label === p[0]);

    if (index !== -1) {
      res[index]["inters"] = p[1];
    }
  });

  // Points
  points.forEach((p) => {
    let index = res.findIndex((element) => element.label === p[0]);

    if (index !== -1) {
      res[index]["point"] = p[1];
    }
  });

  return res;
};

const colors = () => {
  var ColorScheme = require("color-scheme");
  var scheme = new ColorScheme();
  scheme.from_hue(21).scheme("analogic").variation("default");
  return scheme.colors().map((val) => "#" + val);
};

function Tools(props) {
  const [formats, setFormats] = React.useState(() => []);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <ToggleButtonGroup
      onChange={handleFormat}
      orientation="vertical"
      value={formats}
      aria-label="text formatting"
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.zoomOut()}
      >
        <Typography> Zoom Out</Typography>
      </Button>
      <ToggleButton onClick={() => props.toggleDerivatives()} value="der">
        <Typography>Derivatives</Typography>
      </ToggleButton>
      <ToggleButton onClick={() => props.toggleIntersections()} value="inter">
        <Typography>Intersections</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default function Example(props) {
  const initialState = {
    min: -3,
    max: 3,
    showDerivatives: false,
    showIntersections: false
  };

  const [showDerivatives, setShowDer] = useState(initialState.showDerivatives);
  const [showIntersections, setShowInter] = useState(
    initialState.showIntersections
  );
  const fs = ["x*x", "sin(x)"];
  const derivatives = showDerivatives
    ? fs.map((f) => derivative(f, "x").toString())
    : [];

  const [min, setMin] = useState(initialState.min);
  const [max, setMax] = useState(initialState.max);
  const [refAreaLeft, setRefLeft] = useState("");
  const [refAreaRight, setRefRight] = useState("");

  const zoom = () => {
    console.log(refAreaLeft + "; " + refAreaRight);
    if (refAreaLeft > refAreaRight) {
      setMin(refAreaRight);
      setMax(refAreaLeft);
    } else {
      setMin(refAreaLeft);
      setMax(refAreaRight);
    }
    setRefLeft("");
    setRefRight("");
  };

  const zoomOut = () => {
    setMin(initialState.min);
    setMax(initialState.max);
  };

  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <ul>
        {payload.map((entry, index) => (
          <li key={`item-${index}`}>
            <InlineMath math={latexify(entry.value)} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Grid container style={{ userSelect: "none" }}>
      {showDerivatives}
      <Grid item xs={2}>
        <Tools
          toggleDerivatives={() => setShowDer(!showDerivatives)}
          toggleIntersections={() => setShowInter(!showIntersections)}
          zoomOut={zoomOut}
        />
      </Grid>
      <Grid item xs={10}>
        <ComposedChart
          width={500}
          height={400}
          data={data(fs.concat(derivatives), [], min, max, 0.1)}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
          onMouseDown={(e) => e !== null && setRefLeft(e.activeLabel)}
          onMouseMove={(e) =>
            e !== null && refAreaLeft && setRefRight(e.activeLabel)
          }
          onMouseUp={() => zoom()}
          left="dataMin"
          right="dataMax"
          refAreaLeft=""
          refAreaRight=""
          top="dataMax+1"
          bottom="dataMin-1"
          top2="dataMax+20"
          bottom2="dataMin-20"
          animation="true"
        >
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle="top" content={renderLegend} iconType="circle" />
          {fs.map((f, index) => (
            <Line
              dot={false}
              strokeWidth={2}
              type="monotone"
              dataKey={f}
              stroke={colors()[index]}
            />
          ))}
          {showDerivatives &&
            derivatives.map((f, index) => (
              <Line
                name={"(" + fs[index] + ")"}
                dot={false}
                strokeWidth={2}
                type="monotone"
                dataKey={f}
                stroke={colors()[index]}
                strokeDasharray="3,3"
              />
            ))}

          <Scatter dataKey="point" stroke="red" fill="red" />
          {showIntersections && (
            <Scatter dataKey="inters" radius={1} stroke="blue" fill="blue" />
          )}
        </ComposedChart>
      </Grid>
    </Grid>
  );
}
