import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableBody";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import AddIcon from "@material-ui/icons/AddSharp";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import Paper from "@material-ui/core/Paper";
import { InlineMath } from "react-katex";

function latexify(f) {
  let translations = {
    sin: "\\sin ",
    cos: "\\cos ",
    tan: "\\tan ",
    tg: "\\tg ",
    "*": "\\cdot ",
    sqrt: "\\sqrt",
    ln: "\\ln",
    log: "\\log"
  };

  for (let t in translations) {
    f = String(f).replaceAll(t, translations[t]);
  }

  // Find fractions
  let fracPos = f.search("/");
  if (fracPos !== -1) {
    let parentesis = Array(4).fill(-1);
    for (let i = fracPos; i >= 0; i--) {
      if (f[i] === ")" && parentesis[1] === -1) parentesis[1] = i;
      else if (f[i] === "(" && parentesis[0] === -1) {
        parentesis[0] = i;
        break;
      }
    }

    for (let i = fracPos; i < f.length; i++) {
      if (f[i] === "(" && parentesis[2] === -1) parentesis[2] = i;
      else if (f[i] === ")" && parentesis[3] === -1) {
        parentesis[3] = i;
        break;
      }
    }

    console.log("DEBU: " + parentesis);

    if (!parentesis.includes(-1)) {
      let numerator = f.substring(parentesis[0] + 1, parentesis[1]);
      let denominator = f.substring(parentesis[2] + 1, parentesis[3]);
      console.log("YES: " + numerator + denominator);
      let fracLatex = "\\frac{" + numerator + "}{" + denominator + "}";
      f = f.replace(f.substring(parentesis[0], parentesis[3] + 1), fracLatex);
      console.log("YES: " + f);
    }
  }
  return f;
}

function EditableCell(props) {
  let [isEdit, setEdit] = useState(false);
  let [fieldContent, setField] = useState("");

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isEdit) {
      props.updateCell(props.row, props.column, fieldContent);
    }
    setEdit(false);
  };

  return (
    <TableCell
      onContextMenu={(e) => {
        handleContextMenu(e);
      }}
      onClick={() => setEdit(true)}
      align="left"
    >
      {isEdit ? (
        <TextField
          style={{ width: "fit-content" }}
          name={"alo"}
          onChange={(e) => setField(e.target.value)}
          defaultValue={props.data}
        />
      ) : (
        <InlineMath math={latexify(props.data)} />
      )}
    </TableCell>
  );
}

export default function EditableTable(props) {
  let [rows, setRows] = useState(props.rows);

  useEffect(() => {
    props.functionCallFromParent(rows);
  }, [rows]);

  useEffect(() => {
    if (JSON.stringify(props.rows) !== JSON.stringify(rows)) {
      setRows(props.rows);
    }
  }, [props.rows]);

  const updateCell = (row, column, newData) => {
    let oldRow = rows[row];
    oldRow[column] = newData;
    updateRow(row, oldRow);
  };

  const updateRow = (index, newRow) => {
    let oldRows = [...rows];
    oldRows[index] = newRow;
    console.log(rows[index]);
    setRows(oldRows);
  };

  const addRow = () => {
    setRows([...rows, Array(rows[0].length).fill(0)]);
    console.log("NEW" + rows);
  };

  return (
    <div style={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton>
                  <AddIcon onClick={addRow} />
                </IconButton>
              </TableCell>
              {props.header.map((data) => (
                <TableCell>{data}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell align="center">{i}</TableCell>
                {rows[i].map((data, j) => (
                  <EditableCell
                    row={i}
                    column={j}
                    data={data}
                    updateCell={updateCell}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
