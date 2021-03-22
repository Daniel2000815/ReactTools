/**
 * @author danizufrique
 */
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ColIcon from "@material-ui/icons/BorderRight";
import RowIcon from "@material-ui/icons/BorderBottom";

export default function Matrix(props) {
  let inputRefs = [];
  let [rows, setRows] = useState([
    [0, 0],
    [0, 0]
  ]);

  useEffect(() => {
    props.functionCallFromParent(rows, props.index);
  }, [rows]);

  useEffect(() => {
    if (JSON.stringify(props.rows) !== JSON.stringify(rows)) {
      let oldRows = [...rows];
      oldRows = props.rows;
      setRows(oldRows);
    }
  }, [props.rows]);

  const addRow = () => {
    let newRow = new Array(rows[0].length).fill(0);
    setRows((rows) => [...rows, newRow]);
  };

  const addColumn = () => {
    let oldRows = [...rows];
    oldRows.map((row) => row.push(0));
    setRows(oldRows);
  };

  const removeColumn = () => {
    let oldRows = [...rows];
    if (oldRows[0].length <= 1) return;
    oldRows.map((row) => row.pop());
    setRows(oldRows);
  };

  const removeRow = () => {
    let oldRows = [...rows];
    if (oldRows.length <= 1) return;
    oldRows.pop();
    setRows(oldRows);
  };

  const handleKeyPressed = (e) => {
    const event = e;
    const { currentTarget } = e;
    const nRows = rows.length;
    const colLength = rows[0].length;
    const inputIndex = inputRefs.indexOf(currentTarget);

    if (event.key === "ArrowUp") {
      if (inputIndex < colLength) {
        inputRefs[inputIndex + (nRows - 1) * colLength].focus();
      } else {
        inputRefs[inputIndex - colLength].focus();
      }
    } else if (event.key === "ArrowDown") {
      if (inputIndex >= (nRows - 1) * colLength) {
        inputRefs[inputIndex - (nRows - 1) * colLength].focus();
      } else {
        inputRefs[inputIndex + colLength].focus();
      }
    } else if (event.key === "ArrowLeft") {
      if (inputIndex % colLength === 0)
        inputRefs[inputIndex + colLength - 1].focus();
      else inputRefs[inputIndex - 1].focus();
    } else if (event.key === "ArrowRight") {
      if (inputIndex % colLength === colLength - 1)
        inputRefs[inputIndex - colLength + 1].focus();
      else inputRefs[inputIndex + 1].focus();
    }

    if (event.key === "Enter") {
      if (inputIndex < inputRefs.length - 1) {
        inputRefs[inputIndex + 1].focus();
      } else {
        inputRefs[0].focus();
      }
      event.preventDefault();
    }
  };

  const handleClick = (e) => {
    if (e.button === 0) {
      addRow();
    } else if (e.button === 1) {
      e.preventDefault();
    }
  };
  const handleCellChange = (value, i, j) => {
    let oldRows = [...rows];
    oldRows[i][j] = value;
    setRows(oldRows);
  };

  const textField = (i, j, item) => {
    return (
      <TextField
        disabled={props.readOnly}
        style={{ width: 80 }}
        onChange={(e) => handleCellChange(e.target.value, i, j)}
        inputProps={{ onKeyDown: handleKeyPressed }}
        inputRef={(ref) => {
          inputRefs.push(ref);
        }}
        value={item}
        label=""
        variant="outlined"
      />
    );
  };

  let inputs = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      inputs.push(textField(i, j, rows[i][j]));
    }
    inputs.push(<br />);
  }

  return (
    <Paper style={{ float: "left" }}>
      {inputs}
      <center>
        <IconButton
          onContextMenu={(e) => {
            e.preventDefault();
            removeColumn();
          }}
          onClick={addColumn}
        >
          <ColIcon />
        </IconButton>
        <IconButton
          onContextMenu={(e) => {
            e.preventDefault();
            removeRow();
          }}
          onClick={addRow}
        >
          <RowIcon />
        </IconButton>
      </center>
    </Paper>
  );
}
