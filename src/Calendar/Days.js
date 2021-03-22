import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

export default class Days extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
  }

  createTable(year, month) {
    // Elige el mes seleccionado
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const numberOfWeeks =
      Math.ceil(((endDate - startDate) / (24 * 3600 * 1000) + 1) / 7) + 1;

    // Crea las semanas
    const table = [];
    for (let i = 0; i < numberOfWeeks; i += 1) {
      table.push([]);
      for (let j = 0; j < 7; j += 1) {
        if (
          startDate.getMonth() === month &&
          (j + 1) % 7 === startDate.getDay()
        ) {
          table[i].push(startDate.getDate());

          startDate.setDate(startDate.getDate() + 1);
        } else {
          table[i].push(null);
        }
      }
    }
    const dayOfWeeks = ["MON", "TUE", "WED", "THR", "FRI", "SAT", "SUN"];

    const Day = (props) => {
      if (props.number != null) {
        return (
          <Paper>
            <Grid spacing={1}>
              <Grid item xs={12}>
                {props.number}
              </Grid>
              <Grid item xs={12}>
                <Paper style={{ backgroundColor: "rgb(150,150,250)" }}>
                  {props.task[0]}
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        );
      } else return null;
    };

    return (
      <Table>
        <TableHead>
          <TableRow>
            {dayOfWeeks.map((dayOfWeek, index) => {
              return <TableCell align="center">{dayOfWeek}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.map((line) => {
            return (
              <TableRow>
                {line.map((cell) => {
                  return (
                    <TableCell fullWidth align="center">
                      <Day task={this.props.task} number={cell} />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  render() {
    return (
      <div className="days">
        <Paper>{this.createTable(this.props.year, this.props.month)}</Paper>
      </div>
    );
  }
}
