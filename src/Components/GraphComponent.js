import React, { useState, useEffect } from "react";
import EditableTable from "./Table";
import Graph from "./Graph";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

export default function GraphComponent(props) {
  let [rows, setRows] = useState([["(x)/(4)"], ["abs(x)"]]);
  const [slider, setSlider] = React.useState([-1, 1]);

  useEffect(() => {
    console.log("NEW" + rows + "; " + typeof rows);
  }, [rows]);

  const handleChange = (event, newValue) => {
    setSlider(newValue);
  };
  console.log(rows.map((val) => val[0]));
  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={8}>
          <Graph
            title="TEST"
            f={rows.map((val) => val[0])}
            points={[[0, 1]]}
            min={slider[0]}
            max={slider[1]}
            step={0.1}
            hueSeed={1}
          />
        </Grid>
        <Grid item xs={4}>
          <EditableTable
            functionCallFromParent={(newRows) => setRows(newRows)}
            header={["Function"]}
            rows={rows}
          />
        </Grid>
      </Grid>
      <Typography id="range-slider" gutterBottom>
        Domain
      </Typography>
      <Slider
        min={-10}
        max={10}
        style={{ width: "300px" }}
        value={slider}
        onChange={handleChange}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
