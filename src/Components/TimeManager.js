import React, { useState, useEffect, useRef } from "react";
import IconButton from "@material-ui/core/IconButton";
import Graph from "./Graph";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Pie } from "react-chartjs-2";
import Paper from "@material-ui/core/Paper";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import Button from "@material-ui/core/Button";
import MaterialUiIconPicker from "react-material-ui-icon-picker";
import { IconPicker } from "react-fa-icon-picker";
import FontIconPicker from "@fonticonpicker/react-fonticonpicker";
import EditIcon from "@material-ui/icons/Edit";
import RightIcon from "@material-ui/icons/ChevronRight";
import LeftIcon from "@material-ui/icons/ChevronLeft";
import Example from "./ComposedGraph";

const secondsToString = (sec) => {
  let hours = Math.floor(sec / 3600);
  sec %= 3600;
  let minutes = Math.floor(sec / 60);
  let seconds = (sec %= 60);

  hours = ("00" + hours).slice(-2);
  minutes = ("00" + minutes).slice(-2);
  seconds = ("00" + seconds).slice(-2);
  return String(hours) + ":" + String(minutes) + ":" + String(seconds);
};

const stringToSeconds = (time) => {
  console.log("TI: " + time);
  const h = time.substring(0, 2);
  const m = time.substring(3, 5);
  const s = time.substring(6, 8);

  return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10);
};

function EditDialog(props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(props.name);
  const [time, setTime] = useState(secondsToString(props.time));
  const [icon, setIcon] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    props.onChange(props.id, name, stringToSeconds(String(time)));
    props.setName(name);
    props.setTime(stringToSeconds(String(time)));
    setOpen(false);
  };

  return (
    <div>
      <IconButton variant="outlined" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog
        open={open}
        maxWidth={900}
        fullWidth
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Activity</DialogTitle>
        <DialogContent>
          <DialogContentText>EJemplo</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                onChange={(e) => setName(e.target.value)}
                defaultValue={props.name}
                margin="dense"
                id="name"
                label="Name"
                width="75%"
              />
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          <TextField
            onChange={(e) => setTime(e.target.value)}
            defaultValue={secondsToString(props.time)}
            margin="dense"
            id="time"
            label="Time"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Card(props) {
  const [recording, setRecording] = useState(false);
  const [name, setName] = useState(props.name);
  const [time, setTime] = useState(props.time);
  const countRef = useRef(null);
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "..",
    height: ".."
  };

  const handleRecord = () => {
    setRecording(!recording);
    if (!recording) {
      countRef.current = setInterval(() => {
        setTime((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(countRef.current);
      props.onChange(props.id, name, time);
    }
  };

  return (
    <Paper elevation={3}>
      <Grid style={{ margin: "10px" }} container>
        <Grid item style={style} xs={3}>
          icon
        </Grid>
        <Grid style={style} item xs={6}>
          <Typography variant="h6">{name}</Typography>
        </Grid>
        <Grid style={style} item xs={3}>
          <EditDialog
            id={props.id}
            name={name}
            setName={setName}
            time={time}
            setTime={setTime}
            onChange={props.onChange}
          />
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={handleRecord} color="inherit">
            {recording ? <StopIcon /> : <PlayIcon />}
          </IconButton>
        </Grid>
        <Grid style={style} item xs={6}>
          <Typography variant="h6">{secondsToString(time)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

function DaySelector(props) {
  const [currDate, setCurrDate] = useState(new Date());

  useEffect(() => props.onChange(currDate));

  const printDate = () => {
    var dd = String(currDate.getDate()).padStart(2, "0");
    var mm = String(currDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = currDate.getFullYear();

    return dd + "/" + mm + "/" + yyyy;
  };

  const addDays = (days) => {
    var date = new Date(currDate.valueOf());
    date.setDate(date.getDate() + days);
    setCurrDate(date);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Grid container>
        <Grid item xs={3}>
          <IconButton>
            <LeftIcon onClick={() => addDays(-1)} />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">{printDate()}</Typography>
        </Grid>
        <Grid item xs={3}>
          <IconButton>
            <RightIcon onClick={() => addDays(1)} />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}
export default function TimeManager(props) {
  const loadSavedData = () => {
    const savedActivities = localStorage.getItem("activities") || null;
    if (
      savedActivities !== null &&
      JSON.stringify(activities) !== savedActivities
    ) {
      return JSON.parse(savedActivities);
    } else return [];
  };

  const clearSavedData = () => {
    localStorage.clear();
    setActivities(loadSavedData());
  };

  const [times, setTimes] = useState([1, 2, 1]);
  const [labels, setLabels] = useState(["pc", "study", "piano"]);
  const [activities, setActivities] = useState(loadSavedData());
  const [currDate, setCurrDate] = useState();

  const addActivity = (name = "Unknown", time = 0) => {
    let res = {
      name: name,
      id: activities.length,
      time: time
    };

    let newActivities = [...activities, res];
    localStorage.setItem("activities", JSON.stringify(newActivities));
    setActivities(newActivities);
    return res;
  };

  const editActivity = (id, newName, newTime) => {
    let act = [...activities];
    act[id].name = newName;
    act[id].time = newTime;
    localStorage.setItem("activities", JSON.stringify(act));
    setActivities(act);
  };

  const dataSets = () => {
    console.log("QWQw");
    console.log("a" + times.map((val) => val));
    let res = [];

    times.map((item, index) =>
      res.push({
        data: item,
        label: labels[index],
        backgroundColor: "#cd2026",
        type: "bubble"
      })
    );

    return;
  };

  return (
    <div>
      <Example />
      <Button
        style={{ margin: "10px" }}
        variant="contained"
        color="primary"
        onClick={() => addActivity()}
      >
        ADD
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => clearSavedData()}
      >
        BORRAR
      </Button>
      <DaySelector onChange={(e) => setCurrDate(e)} />
      <Grid container spacing={2}>
        {activities.map((value, index) => (
          <Grid item>
            <Card
              id={index}
              name={value.name}
              time={value.time}
              onChange={editActivity}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
