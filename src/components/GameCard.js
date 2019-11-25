import React from 'react';

// material-ui imports
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles (theme => ({
  button : {
  margin: 'theme.spacing(1)',
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

function GameCard(props) {

  let answerStyle1 = {
    "fontSize" : ".6rem",
    "visibility" : "visible"
  };
  let answerStyle2 = {
    "fontSize" : ".6rem",
    "visibility" : "hidden"
  };

  let answerStyle = (props.card && props.card.totalChoices === 4) ? answerStyle1 : answerStyle2;
  let theImage = (props.card) ? props.card.imageUrl : "https://theunitedstates.io/images/congress/225x275/W000817.jpg";

	const classes = useStyles();
	return (
	    <Card className={classes.card} style={{"marginTop" : "6vh"}}>
	      <CardMedia
	          className={classes.media} style={{"height" : "53vh"}}
	          image={theImage}
	          title="Member of Congress"
	      />
  	    <CardContent style={{"paddingBottom" : "0"}}>
  	      <Typography variant="h6" color="textSecondary" component="p">
  	          {props.card.questionText}
  	      </Typography>
  	      <CardActions>
  	        <ButtonGroup fullWidth={false}>
  	          <Button key="0" style={{"fontSize" : ".6rem"}}  size="small" color="primary" variant="contained" onClick={props.answered} className={classes.button}>
  	            {props.card.multipleChoice[0]} 
  	          </Button>
  	          <Button  key="1" style={{"fontSize" : ".6rem"}} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            {props.card.multipleChoice[1]} 
  	          </Button>
  	          <Button  key="2" style={answerStyle} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            {props.card.totalChoices === 4 ? props.card.multipleChoice[2] : props.card.multipleChoice[0]} 
  	          </Button>
  	          <Button  key="3" style={answerStyle} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            {props.card.totalChoices === 4 ? props.card.multipleChoice[3] : props.card.multipleChoice[1]} 
  	          </Button>
  	        </ButtonGroup>
  	      </CardActions>
  	    </CardContent>
	      <CardActions style={{"paddingTop" : "0"}} >
	        <Button size="medium" color="secondary" onClick={props.reset}>
	          Start Over
	        </Button>
	        <Button size="medium" color="secondary" href="/" onClick={props.exited}>
	          Exit
	        </Button>
	        <Button size="medium" color="secondary" onClick={props.continue}>
	          Continue
	        </Button>
	      </CardActions>
      </Card>
	);
}

export default GameCard;
