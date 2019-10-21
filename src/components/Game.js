import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GameImage from '../images/michael-9wXvgLMDetA-unsplash.jpg';


const useStyles = makeStyles(theme => ({
  button : {
	margin: theme.spacing(1),
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
        playerId          : 0, 
        playerName        : "",
        lastScore         : 0,
        totalGamesPlayed  : 0,
        percentageWon     : 0,
        lastAnswer        : "",
        questionIndex     : 0,
        questionList      : [],
		};
	}

  componentDidMount(){

    if (this.props.player) {

      this.setState({
        playerId : this.props.player.playerId,
        playerName : this.props.player.playerName,
        lastScore : this.props.player.lastScore,
        totalGamesPlayed : this.props.player.totalGamesPlayed,
        percentageWon : this.props.player.percentageWon
      });
    } else {
      this.setState({
        playerId : 1,
        playerName : "Betty Boop",
        lastScore : 80,
        totalGamesPlayed : 5,
        percentageWon : 80,
        answerText : "",
      });

    }

    // console.log("PROPS PLAYER: " + this.props.playerId);
    // console.log("PROPS PLAYER: " + this.props.playerName);
    // console.log("PROPS PLAYER: " + this.props.lastScore);
    // console.log("PROPS PLAYER: " + this.props.totalGamesPlayed);
    // console.log("PROPS PLAYER: " + this.props.percentageWon);

    // console.log("GAME PLAYER: " + this.state.playerId);
    // console.log("GAME PLAYER: " + this.state.playerName);
    // console.log("GAME PLAYER: " + this.state.lastScore);
    // console.log("GAME PLAYER: " + this.state.totalGamesPlayed);
    // console.log("GAME PLAYER: " + this.state.percentageWon);
//    console.log("PROPS FIRST QUESTIONS: " + this.props.questions[0].questionText);
    if (!this.props.questions) {
      this.props.fetchQuestions();
    } else {
      this.setState({
        questionList : this.props.questions
      });
      console.log("QUESTION LIST: " + this.state.questionList);

    }
  }

  answerSelected = (e) => {

    this.setState({
      lastAnswer : e.target.innerHTML
    });
  }

  startOverSelected = (e) => {
    console.log("Start Over: " + e.target.value);
  }

  exitSelected = (e) => {
    // this.setState({
    //   lastAnswer : "",
    //   currentQuestion: {member:0, trivia:0},
    //   askedQuestions: []
    // });    
  }

  nextSelected = (e) => {
    let checkValue;
    if (this.state.questionList.length > 0) {
      checkValue = this.state.questionList[this.state.questionIndex].correctAnswer;
    } else {
      checkValue = "Elizabeth Warren";
    }

    // TODO: increment/decrement lastScore
    if (this.state.lastAnswer === checkValue) {
      this.setState({
          player : { ...this.state.player,
          lastScore : (this.state.lastScore + 1)
        }
      });
      this.setState({
        answerText : "Correct!"
      });

    } else {
      this.setState({
        player : { ...this.state.player,
          lastScore : (this.state.lastScore - 1)
        }
      }); 
      this.setState({
        answerText : "Ooops!  No, the correct answer is: " + this.state.lastAnswer
      });  
    }
    this.setNextQuestion();
  }


    updatePlayer = (id) => {
    fetch('http://localhost:8080/player' + id, {
           method  : 'put',
           headers : {
            "Content-Type": "application/json"
           },
           body : JSON.stringify({
            playerName : this.state.playerName,
            lastScore  : this.state.lastScore,
            totalGamesPlayed : this.state.totalGamesPlayed,
            percentageWon : this.state.percentageWon
           })
       }).then(()=> {
          this.props.fetchPlayers();
          this.setState({
            playerName : "", 
            lastScore : "", 
            totalGamesPlayed : 0,
            percentageWon : 0
          });
          })
    }

  gameOver=()=>{
    this.setState({
      questionIndex : 0
    });
    // disable the next button
    // display score 
    // display ?  something else
  }

  setNextQuestion=()=>{
    if (this.state.questionIndex === 10) {
      this.gameOver();  
    } else {
      this.setState({
        questionIndex : this.state.questionIndex + 1
      })
      this.setState({
        lastAnswer : ""
      })
    }
  }


  render() {
    document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + GameImage + ")";

    	return (
    	  <div >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={1} direction="column" alignItems="center">
                <Grid item>
    	            <GameCard card={this.state.questionList[this.state.questionIndex]} 
                    answered={this.answerSelected} 
                    reset={this.startOverSelected} exited={this.exitSelected} continue={this.nextSelected}/>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={1} direction="column" alignItems="center">
                <Grid item>
                <Typography variant="h6" style={{"flexGrow":"1"}}>
                   {this.state.answerText}
                </Typography>            
                </Grid>
              </Grid>
            </Grid>
          </Grid>
    	  </div>
        );
  }
}
// card
        //   imageUrl       : triviaItem.memberPhoto,
        // questionText   : trivia.question,
        // correctAnswer  : trivia.correct_answer,
        // totalChoices   : trivia.totalOptions,
        // multipleChoice : choices is an array of totalChoices

        // these go to methods that handle button clicks
        // answered,   reset, exited, continue

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
	          className={classes.media} style={{"height" : "275px"}}
	          image={theImage}
	          title="Member of Congress"
	      />
  	    <CardContent style={{"paddingBottom" : "0"}}>
  	      <Typography variant="h6" color="textSecondary" component="p">
  	          {props.card ? props.card.questionText : "What is my name?"}
  	      </Typography>
  	      <CardActions>
  	        <ButtonGroup fullWidth={false}>
  	          <Button key="0" style={{"fontSize" : ".6rem"}}  size="small" color="primary" variant="contained" onClick={props.answered} className={classes.button}>
  	            {props.card ? props.card.multipleChoice[0] : "Bonnie Watson Coleman"} 
  	          </Button>
  	          <Button  key="1" style={{"fontSize" : ".6rem"}} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            {props.card ? props.card.multipleChoice[1] : "Elizabeth Warren"} 
  	          </Button>
  	          <Button  key="2" style={answerStyle1} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            {props.card ? (props.card.totalChoices === 4 ? props.card.multipleChoice[2] : props.card.multipleChoice[0]) : "Cynthia Axne"} 
  	          </Button>
  	          <Button  key="3" style={answerStyle1} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            {props.card ? (props.card.totalChoices === 4 ? props.card.multipleChoice[2] : props.card.multipleChoice[1]) : "Nanette Baragan"} 
  	          </Button>
  	        </ButtonGroup>
  	      </CardActions>
  	    </CardContent>
	      <CardActions style={{"paddingTop" : "0"}} >
	        <Button size="medium" color="secondary" href="/allofcongress" onClick={props.reset}>
	          Start Over
	        </Button>
	        <Button size="medium" color="secondary" href="/" onClick={props.exited}>
	          Exit
	        </Button>
	        <Button size="medium" color="secondary" href="/allofcongress" onClick={props.continue}>
	          Next
	        </Button>
	      </CardActions>
      </Card>
	);

}


export default Game;