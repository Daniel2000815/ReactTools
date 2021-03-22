import React, { Component, useState } from "react";
import Matrix from "./Matrix";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import "katex/dist/katex.min.css";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { InlineMath, BlockMath } from "react-katex";
import MenuItem from "@material-ui/core/MenuItem";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { inv, transpose, eigs, diag, expm } from "mathjs";
import { MathComponent } from "mathjax-react";

function DropDown(props) {
  const [operation, setOperation] = useState("");
  const [m1, setM1] = useState(null);
  const [m2, setM2] = useState(null);
  return (
    <Paper style={{ float: "left", width: "255px" }}>
      <FormControl style={{ minWidth: 100 }} variant="filled">
        <InputLabel id="demo-simple-select-filled-label">Operation</InputLabel>
        <Select
          style={{ minWidth: "125px" }}
          id="Operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <MenuItem value={"INV"}>Inversa</MenuItem>
          <MenuItem value={"MULT"}>Producto</MenuItem>
          <MenuItem value={"LU"}>Descomposición LU</MenuItem>
        </Select>
      </FormControl>
      {operation !== "" && <br /> && (
        <>
          <FormControl style={{ minWidth: 65 }} variant="filled">
            <InputLabel id="m12">M1</InputLabel>
            <Select
              variant="filled"
              id="Matrix"
              value={m1}
              onChange={(e) => setM1(e.target.value)}
            >
              {props.matrices.map((mat, index) => (
                <MenuItem value={index}>{intToChar(index)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            style={{ minWidth: 65 }}
            variant="filled"
            disabled={!["MULT"].includes(operation)}
          >
            <InputLabel id="m2">M2</InputLabel>
            <Select
              variant="filled"
              id="Matrix"
              value={m2}
              onChange={(e) => setM2(e.target.value)}
            >
              {props.matrices.map((mat, index) => (
                <MenuItem value={index}>{intToChar(index)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      <br />
      {m1 !== null || (m2 !== null && <br />)}
      {operation === "LU" &&
        m1 !== null &&
        matrixToLatex(descompositionLU(props.matrices[m1])[0])}
      {operation === "LU" &&
        m1 !== null &&
        matrixToLatex(descompositionLU(props.matrices[m1])[1])}
      {operation === "INV" && <BlockMath math="L=" /> &&
        matrixToLatex(inverse(props.matrices[m1]))}
      {operation === "TR" && matrixToLatex(transpose(props.matrices[m1]))}
      {operation === "MULT" &&
        m1 !== null &&
        m2 !== null &&
        matrixToLatex(multiply(props.matrices[m1], props.matrices[m2]))}
    </Paper>
  );
}

function descompositionLU(m) {
  if (m === undefined) return;
  const mlMatrix = require("ml-matrix");
  var A = new mlMatrix.Matrix(m);
  var LU = new mlMatrix.LuDecomposition(A);
  var L = LU.lowerTriangularMatrix;
  var U = LU.upperTriangularMatrix;
  var P = LU.pivotPermutationVector;

  console.log("SA" + L.data);
  return [L.data, U.data];
}

function eigenValues(m) {
  if (!matrixIsSquare(m)) return "\\nexists";

  const mlMatrix = require("ml-matrix");
  const M = new mlMatrix.Matrix(m);
  const e = new mlMatrix.EigenvalueDecomposition(M);
  for (let i = 0; i < e.d.length; i++) {
    e.d[i] = e.d[i].toFixed(4);
  }
  return e.d;
}
function matrixIsSquare(m) {
  return m !== undefined && m.length === m[0].length;
}

function inverse(m) {
  if (m !== null && matrixIsSquare(m) && determinant(m) !== 0) return inv(m);
}

function trace(m) {
  let res = 0;
  if (m === undefined || m[0] === undefined || !matrixIsSquare(m))
    return "\\nexists";
  for (let i = 0; i < m.length; i++) {
    res += m[i][i];
  }
  return res;
}

function multiply(m1, m2) {
  if (m1 === null || m2 === null) return [];
  if (m1[0].length !== m2.length) return [];

  var rows1 = m1.length,
    cols1 = m1[0].length,
    rows2 = m2.length,
    cols2 = m2[0].length,
    res = new Array(rows1);

  for (var r = 0; r < rows1; ++r) {
    res[r] = new Array(cols2);
    for (var c = 0; c < cols2; ++c) {
      res[r][c] = 0;
      for (var i = 0; i < cols1; ++i) {
        res[r][c] += m1[r][i] * m2[i][c];
      }
    }
  }
  return res;
}

function matrixToLatex(m) {
  if (m === undefined || m[0] === undefined) return;
  let mat = "\\begin{pmatrix}";
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[0].length; j++) {
      mat += m[i][j].toFixed(4);
      if (j != m[i].length - 1) mat += "&";
    }
    if (i !== m.length - 1) mat += "\\\\";
  }
  mat += "\\end{pmatrix}";
  return <InlineMath math={mat} />;
}
function determinant(m) {
  if (!matrixIsSquare(m)) return "\\nexists";
  return m.length == 1
    ? m[0][0]
    : m.length == 2
    ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
    : m[0].reduce(
        (r, e, i) =>
          r +
          (-1) ** (i + 2) *
            e *
            determinant(m.slice(1).map((c) => c.filter((_, j) => i != j))),
        0
      );
}

function intToChar(n) {
  return String.fromCharCode(65 + n);
}

export default class Matrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrices: [
        [
          [1, 2],
          [3, 4]
        ],
        [
          [4, 20],
          [1, 5]
        ],
        [
          [0, 0],
          [0, 0]
        ]
      ]
    };
    this.updateMatrix = this.updateMatrix.bind(this);
  }

  updateMatrix = (index, data) => {
    let matrices = [...this.state.matrices];
    let matrix = { ...matrices[index] };

    matrix = data;
    matrices[index] = matrix;

    this.setState({ matrices });
  };

  callbackFunction = (childData, index) => {
    this.updateMatrix(index, childData);
  };

  matrix = (index, data) => {
    return (
      <Matrix
        rows={this.state.matrices[index]}
        index={index}
        functionCallFromParent={this.callbackFunction.bind(this)}
      />
    );
  };

  addMatrix = () => {
    this.setState((prevState) => ({
      matrices: [
        ...prevState.matrices,
        [
          [0, 0],
          [0, 0]
        ]
      ]
    }));
  };

  removeMatrix = (i) => {
    var old = [...this.state.matrices];
    if (i >= 0 && i <= old.length) {
      old.splice(i, 1);
      this.setState({ matrices: old });
    }
  };

  render() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={this.addMatrix}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>

                {this.state.matrices.map((mat, index) => (
                  <TableCell>
                    {intToChar(index)}
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.removeMatrix(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell />
                {this.state.matrices.map((mat, index) => (
                  <TableCell>{this.matrix(index)}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell />
                {this.state.matrices.map((mat, index) => (
                  <TableCell>
                    <InlineMath
                      math={
                        "\\det(" + intToChar(index) + ") =" + determinant(mat)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell />
                {this.state.matrices.map((mat, index) => (
                  <TableCell>
                    <InlineMath
                      math={"tr(" + intToChar(index) + ") =" + trace(mat)}
                    />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell />
                {this.state.matrices.map((mat, index) => (
                  <TableCell>
                    <InlineMath
                      math={
                        "\\lambda_{" +
                        intToChar(index) +
                        "} = " +
                        eigenValues(mat)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <DropDown matrices={this.state.matrices} />
        <DropDown matrices={this.state.matrices} />
        <DropDown matrices={this.state.matrices} />
        <DropDown matrices={this.state.matrices} />
      </div>
    );
  }
}
