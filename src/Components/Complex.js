import React, { setValues, values } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import AddIcon from "@material-ui/icons/AddSharp";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";

import {
  VictoryChart,
  VictoryScatter,
  Selection,
  Point,
  VictoryLine,
  VictoryAxis
} from "victory";

const pointZero = { index: 0, x: 0, y: 0, isEditMode: false };

class DraggablePoint extends React.Component {
  static defaultEvents = [
    {
      target: "data",
      eventHandlers: {
        onMouseOver: () => ({
          mutation: (props) => Object.assign({}, props, { active: true })
        }),
        onMouseDown: () => ({
          mutation: (props) => Object.assign({}, props, { dragging: true })
        }),
        onMouseMove: (evt, targetProps) => {
          const { scale, onPointChange, datum } = targetProps;
          if (targetProps.dragging) {
            const { x, y } = Selection.getSVGEventCoordinates(evt);
            const point = { x: scale.x.invert(x), y: scale.y.invert(y) };
            const index = datum.index;
            console.log(index);
            onPointChange({
              index: index,
              x: point.x,
              y: point.y,
              isEditMode: false
            }); // call your event handler to set state for your app
            return { mutation: () => Object.assign({}, targetProps, { x, y }) }; // actually move the points
          }
          return null;
        },
        onMouseUp: () => ({
          mutation: (props) =>
            Object.assign({}, props, { dragging: false, active: false })
        }),
        onMouseLeave: () => ({
          mutation: (props) =>
            Object.assign({}, props, { dragging: false, active: false })
        })
      }
    }
  ];

  render() {
    return <Point {...this.props} />;
  }
}

export default class Complex extends React.Component {
  constructor() {
    super();
    this.state = {
      inputX: 0,
      inputY: 0,
      points: []
    };
    this.onPointChange = this.updateData.bind(this);
    //this.addPoint = this.addPoint.bind(this);
  }

  updateData(point) {
    console.log("ACTUALIZANDO PUNTO " + point.index);
    const currentPoints = this.state.points;
    currentPoints[point.index] = point;
    this.setState({ points: currentPoints });
  }

  createPoint = (x, y, isEditMode = false, index = -1) => {
    let i = index === -1 ? this.state.points.length : index;
    console.log("ALOA" + i);
    return {
      index: i,
      x: x,
      y: y,
      isEditMode: isEditMode
    };
  };

  addPoint = (p) => {
    const currentPoints = this.state.points;

    currentPoints.push(p);
    this.setState({ points: currentPoints });
  };

  input = () => {
    return (
      <React.Fragment>
        <TextField
          defaultValue={0}
          value={this.state.inputX}
          label="Re(z)"
          variant="outlined"
          onChange={(e) => this.setState({ inputX: Number(e.target.value) })}
        />
        <TextField
          defaultValue={0}
          value={this.state.inputY}
          label="Im(z)"
          variant="outlined"
          onChange={(e) => this.setState({ inputY: Number(e.target.value) })}
        />
        <Button
          style={{ verticalAlign: "center" }}
          onClick={() => this.addPoint(0, 1)}
          variant="outlined"
        >
          Añadir
        </Button>
      </React.Fragment>
    );
  };

  onToggleEditMode = (index) => {
    return this.state.points.map((point) => {
      if (point.index === index) {
        let p = this.state.points[index];
        p.isEditMode = !p.isEditMode;
        this.updateData(p);
      }
    });
  };

  validInput = (newValue) => {
    let validInput = true;
    let foundSign = false;
    let foundI = false;

    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] === "+") {
        if (foundSign || foundI) return false;
        else foundSign = true;
      } else if (newValue[i] === "i") {
        if (foundI) return false;
        if (foundSign) foundI = true;
      }
    }

    if (!foundSign || !foundI) return false;

    return true;
  };

  onNumberInputChange = (point, newValue) => {
    if (this.validInput(newValue)) {
      let real = String(newValue).split("+")[0];
      let imaginary = String(newValue).split("+")[1].slice(0, -1);
      console.log("NUMBER: " + real + "+" + imaginary + "i");

      let newPoint = this.createPoint(
        Number(real),
        Number(imaginary),
        true,
        point.index
      );

      this.updateData(newPoint);
    }
  };

  pointToString = (point) => {
    return (
      parseFloat(point.x.toFixed(4)) +
      "+" +
      parseFloat(point.y.toFixed(4)) +
      "i"
    );
  };

  editableCell = (row) => {
    //const classes = useStyles();
    console.log(row);
    return (
      <TableCell align="left">
        {row.isEditMode ? (
          <TextField
            name={"alo"}
            defaultValue={this.pointToString(row)}
            onChange={(e) =>
              this.onNumberInputChange(row, String(e.target.value))
            }
          />
        ) : (
          <t>{this.pointToString(row)}</t>
        )}
      </TableCell>
    );
  };

  onAddTableEntry = () => {
    let p = this.createPoint(0, 0, true);
    this.addPoint(p);
  };

  table = () => {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton
                  aria-label="done"
                  onClick={() => this.onAddTableEntry()}
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell>z</TableCell>
              <TableCell align="right">comp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.points.map((point) => (
              <TableRow key={point.index}>
                <TableCell>
                  {point.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={() => this.onToggleEditMode(point.index)}
                      >
                        <DoneIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="delete"
                      onClick={() => this.onToggleEditMode(point.index)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>

                {this.editableCell(point)}
                <TableCell align="right">{point.key}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  arrayLimit = (min, max, step) => {
    return Array.from(
      { length: (max - min) / step + 1 },
      (_, i) => min + i * step
    );
  };
  graph = () => {
    return (
      <VictoryChart>
        {this.state.points.map((point) => (
          <VictoryLine data={[pointZero, point]} sortKey={point.index} />
        ))}
        <VictoryAxis
          style={{
            grid: { stroke: "#818e99", strokeWidth: 0.5 }
          }}
          tickValues={this.arrayLimit(-10, 10, 2)}
        />
        <VictoryAxis
          style={{
            grid: { stroke: "#818e99", strokeWidth: 0.5 }
          }}
          domain={[-10, 10]}
          tickValues={this.arrayLimit(-10, 10, 2)}
          dependentAxis={true}
        />
        <VictoryScatter
          data={this.state.points}
          size={7}
          style={{
            data: {
              fill: "blue",
              strokeWidth: 30, // increase the draggable area
              stroke: "none" // with an invisible stroke
            }
          }}
          dataComponent={<DraggablePoint onPointChange={this.onPointChange} />}
        />
      </VictoryChart>
    );
  };

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {this.graph()}
        </Grid>
        <Grid item xs={4}>
          {this.table()}
        </Grid>
      </Grid>
    );
  }
}

//render(<App />, document.getElementById("root"));
