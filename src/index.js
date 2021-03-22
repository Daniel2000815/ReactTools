import ReactDOM from "react-dom";
import React from "react";
import clsx from "clsx";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MusicIcon from "@material-ui/icons/QueueMusic";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EventIcon from "@material-ui/icons/EventSharp";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PianoIcon from "@material-ui/icons/StraightenSharp";
import MatrixIcon from "@material-ui/icons/GridOnSharp";
import BarChartIcon from "@material-ui/icons/BarChart";
import FaceIcon from "@material-ui/icons/Face";
import MyCalendar from "./Calendar/MyCalendar";
import Teachers from "./Components/Teachers";
import Matrices from "./Components/Matrices";
import TimelapseSharpIcon from "@material-ui/icons/TimelapseSharp";
import Piano from "./Components/Piano";
import Complex from "./Components/Complex";
import TimeManager from "./Components/TimeManager";
import GraphComponent from "./Components/GraphComponent";
import ComplexIcon from "@material-ui/icons/FormatItalic";
const drawerWidth = 175;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

const App = function ButtonAppBar() {
  const classes = useStyles();

  const theme = useTheme();
  const [area, setArea] = React.useState("time");
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function ChooseArea() {
    if (area === "calendar") {
      return <MyCalendar />;
    } else if (area === "teachers") {
      return <Teachers />;
    } else if (area === "matrix") {
      return <Matrices />;
    } else if (area === "piano") {
      return <Piano />;
    } else if (area === "complex") {
      return <Complex />;
    } else if (area === "graph") {
      return <GraphComponent />;
    } else if (area === "time") {
      return <TimeManager />;
    } else {
      /*else if (area === "subjects") {
      return <Subjects />;
    } */
      return <p>F</p>;
    }
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Daniel Zufrí Quesada
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => setArea("calendar")}>
            <IconButton>
              <EventIcon />
            </IconButton>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button onClick={() => setArea("subjects")}>
            <IconButton>
              <MenuBookIcon />
            </IconButton>
            <ListItemText primary="Subjects" />
          </ListItem>
          <ListItem button onClick={() => setArea("teachers")}>
            <IconButton>
              <FaceIcon />
            </IconButton>
            <ListItemText primary="Teachers" />
          </ListItem>
          <ListItem button onClick={() => setArea("matrix")}>
            <IconButton>
              <MatrixIcon />
            </IconButton>
            <ListItemText primary="Matrix" />
          </ListItem>
          <ListItem button onClick={() => setArea("graph")}>
            <IconButton>
              <BarChartIcon />
            </IconButton>
            <ListItemText primary="Graphs" />
          </ListItem>
          <ListItem button onClick={() => setArea("complex")}>
            <IconButton>
              <ComplexIcon />
            </IconButton>
            <ListItemText primary="Complex Numbers" />
          </ListItem>
          <ListItem button onClick={() => setArea("time")}>
            <IconButton>
              <TimelapseSharpIcon />
            </IconButton>
            <ListItemText primary="Time Manager" />
          </ListItem>
          <ListItem button onClick={() => setArea("piano")}>
            <IconButton>
              <PianoIcon />
            </IconButton>
            <ListItemText primary="Piano" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        <ChooseArea />
      </main>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
