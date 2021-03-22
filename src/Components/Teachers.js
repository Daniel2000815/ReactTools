import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import NewSubject from "./NewSubject";

export default class Teachers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  TeacherCard = (props) => {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {props.name}
          </Typography>
          <Typography variant="h5" component="h2">
            {props.teacher}
          </Typography>
          <br />
          <Typography variant="body1" component="p">
            {props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button>Edit</Button>
          <Button>Remove</Button>
        </CardActions>
      </Card>
    );
  };
  render() {
    return (
      <div>
        <Grid>
          <Grid item xs={4}>
            <this.TeacherCard
              name="Subject"
              teacher="Teacher"
              description="description"
            />
          </Grid>
          <NewSubject />
        </Grid>
      </div>
    );
  }
}
