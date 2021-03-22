import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import { ColorPicker } from "material-ui-color";

export default function NewEvent(props) {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [type, setType] = React.useState("");
  const [date, setDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startTime, setStart] = React.useState("");
  const [endTime, setEnd] = React.useState("");

  const canAccept = () => {
    let res =
      subject !== "" &&
      type !== "" &&
      date !== "" &&
      description !== "" &&
      startTime !== "" &&
      endTime !== "";

    return res;
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const newTask = () => {
    const e = {
      name: description,
      date: date,
      start: startTime,
      end: endTime,
      subject: subject,
      type: type
    };
    var storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents == null) storedEvents = [];

    console.log("EVENTS:", storedEvents);
    storedEvents.push(e);
    const json = JSON.stringify(storedEvents);
    localStorage.setItem("events", json);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Añadir Evento
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        fullHeight
      >
        <DialogTitle id="form-dialog-title">Evento</DialogTitle>
        <DialogContent>
          <DialogContentText>Introduce the following info:</DialogContentText>
          <Grid container spacing={1}>
            {/*Subject*/}
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Type*/}
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  margin={20}
                  onChange={(event) => setType(event.target.value)}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/*Description*/}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Description"
                  type="text"
                  onChange={(event) => setDescription(event.target.value)}
                />
              </FormControl>
            </Grid>
            {/* Date*/}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  id="date"
                  label="Día"
                  type="date"
                  defaultValue="2017-05-24"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  onChange={(event) => setDate(event.target.value)}
                />
              </FormControl>
            </Grid>
            {/* Start*/}
            <Grid item xs={3}>
              <FormControl fullWidth>
                <TextField
                  id="time"
                  label="Inicio"
                  type="time"
                  defaultValue="07:40"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    step: 300 // 5 min
                  }}
                  fullWidth
                  onChange={(event) => setStart(event.target.value)}
                />
              </FormControl>
            </Grid>
            {/* End*/}
            <Grid item xs={3}>
              <FormControl fullWidth>
                <TextField
                  id="time"
                  label="Fin"
                  type="time"
                  defaultValue="07:40"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  inputProps={{
                    step: 300 // 5 min
                  }}
                  onChange={(event) => setEnd(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <ColorPicker />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={!canAccept()} onClick={newTask} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
