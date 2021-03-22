import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Days from "./Days";
import NewEvent from "../Components/NewEvent";

export default class MyCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      currentView: "calendar",
      events: []
    };

    this.handleClickNext = this.handleClickNext.bind(this);
    this.handleClickPrevious = this.handleClickPrevious.bind(this);
    this.processStoredEvents = this.processStoredEvents.bind(this);
  }

  currentMonthName = () => {
    let arrayOfMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "Novemver",
      "December"
    ];
    return arrayOfMonths[this.state.month];
  };

  processStoredEvents() {
    var storedEvents = JSON.parse(localStorage.getItem("events"));
    //if (storedEvents == null)
    storedEvents = [
      {
        name: "description",
        date: "2021-01-01",
        start: "startTime",
        end: "endTime",
        subject: "subject",
        type: "type"
      }
    ];
    let thisMonthEvents = [];
    console.log("---------------------");

    storedEvents.forEach((element) => {
      console.log("fecha: ", Object.values(element)[1]);
      let splitted = Object.values(element)[1].split("-");
      let yearInt = parseInt(splitted[0], 10);
      let month = splitted[1];
      if (month !== undefined) {
        console.log("AJAJA", month.length, month[0]);
        if (month.length === 2 && month[0] === "0") {
          console.log("AJAJA2", month.length);
          month = month[1];
        }
        month = parseInt(month, 10) - 1;
        console.log("YEARS: ", this.state.year, yearInt);
        console.log("months: ", this.state.month, month);
        console.log("EQUAL1", month === this.state.month);
        if (month === this.state.month && yearInt === this.state.year) {
          thisMonthEvents.push(Object.values(element));
          console.log("EY", thisMonthEvents);
        }
      } else console.log("AJAJAJA3");
    });

    this.setState({ events: thisMonthEvents });
  }

  componentWillMount() {
    this.processStoredEvents();
  }

  componentWillReceiveProps(nextProps) {
    this.processStoredEvents();
  }

  handleClickPrevious() {
    const currentMonth = this.state.month;
    this.setState({
      month: currentMonth - 1
    });

    if (this.state.month < 1) {
      const currentYear = this.state.year;
      this.setState({
        month: 11,
        year: currentYear - 1
      });
    }
  }

  handleClickNext() {
    if (this.state.currentView === "months") {
      const currentYear = this.state.year;
      this.setState({
        year: currentYear + 1
      });
    } else {
      const currentMonth = this.state.month;
      this.setState({
        month: currentMonth + 1
      });

      if (this.state.month > 10) {
        const currentYear = this.state.year;
        this.setState({
          month: 0,
          year: currentYear + 1
        });
      }
    }
  }

  render() {
    return (
      <div>
        <Paper className="calendar-paper">
          <div className="tableLines">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="previous" numeric align="left">
                    <IconButton onClick={this.handleClickPrevious}>
                      <KeyboardArrowLeft />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h4">
                      {this.currentMonthName()} {this.state.year}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" className="next">
                    <IconButton onClick={this.handleClickNext}>
                      <KeyboardArrowRight />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </div>
          <Days
            task={this.state.events[0]}
            year={this.state.year}
            month={this.state.month}
          />
        </Paper>
        <NewEvent />
      </div>
    );
  }
}
