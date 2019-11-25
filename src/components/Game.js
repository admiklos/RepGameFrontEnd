import React, { useEffect } from 'react';

// React Router imports
import { Link as RouterLink } from 'react-router-dom';

// material-ui imports
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// local imports
import GameCard from './GameCard';
import GameImage from '../images/michael-9wXvgLMDetA-unsplash.jpg';


const ButtonLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const Game = (props) => {

  const [lastScore, setLastScore] = React.useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = React.useState(0);
  const [percentageWon, setPercentageWon] = React.useState(0);

  const [lastAnswer, setLastAnswer] = React.useState("");
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [answerText, setAnswerText] = React.useState("");
  const [resultText, setResultText] = React.useState("");

  const [isGameOver, setGameOver] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + GameImage + ")";

  useEffect(()=>{
    if (props.player) {
      setLastScore(props.players[props.player].lastScore);
      setTotalGamesPlayed(props.players[props.player].totalGamesPlayed);
      setPercentageWon(props.players[props.player].percentageWon);
    } else {
      console.log("Player not received!");
    }
    if (props.questions.length >= 10) setIsLoading(false);
  },[props]);

  const answerSelected = (e) => {
    console.log(e.target);
    setLastAnswer(e.target.innerHTML);
    setAnswerText("");
  }

  const resetGameState = () => {
    setLastAnswer("");
    setLastScore(0);
    setQuestionIndex(0);
    setAnswerText("");
  }

  const startOverSelected = (e) => {
    console.log("Start Over: " + e.target);
    resetGameState([]);
    setGameOver(false);
    if (e.target.innerHTML === "Yes") {
      props.newGame([]);
      setIsLoading(true);
    }
  }

  const exitSelected = (e) => {
    resetGameState();
  }

  const checkAnswer = () => {
      let checkValue = props.questions[questionIndex].correctAnswer;
      if (lastAnswer === checkValue) {
        console.log("I GOT IT RIGHT!")
        setLastScore(prevScore => prevScore + 1);
        setAnswerText("Correct");
      } else {
        console.log("I GOT IT WRONG")
        setAnswerText("Oops!  No, the correct answer is: " + checkValue);
      }    
  }

  const nextSelected = (e) => {
    let questionList = props.questions;
    if (questionList.length > 0) {
      console.log("Player Score: " + lastScore);
      console.log("Last Answer: " + lastAnswer);
      console.log("Last Score: " + lastScore);
      console.log("Index into Question List: " + questionIndex);
      console.log("AnswerText: " + answerText);
      checkAnswer();
      setLastAnswer("");

      if (questionIndex >= 9) {
        gameOver();
      } else {
        setQuestionIndex(prevIndex => prevIndex + 1);
      }

    } else {
      window.alert("Questions have not loaded yet.");
    } 
  }

  const gameOver = () => {
    let newPercentage = percentageWon;
    if (lastScore > 5) {
      newPercentage = ((totalGamesPlayed * newPercentage) + 100) / (totalGamesPlayed + 1);
      setPercentageWon(newPercentage);
      setResultText(lastScore + " out of 10 correct. You Won!")
    } else {
      setResultText(lastScore + " out of 10 correct. You Lost.")
    }
    let newTotal = totalGamesPlayed + 1;
    setTotalGamesPlayed(newTotal);
    setGameOver(true);
    let modPlayer = props.players[props.player];
    modPlayer.percentageWon = newPercentage;
    modPlayer.gamesPlayed = newTotal;
    modPlayer.lastScore = lastScore;
    props.update(modPlayer);
    resetGameState();
  }

  // TODO: took out the Yes button below until I get the callbacks working -
  //    then I can add back in the props.createList and work out its bugs.
  //  <Button component={ButtonLink} onClick={props.createList}>Yes</Button>

  const showGameState = () => {
    let result = "";
    if (isGameOver) {
      result =
        <div>
          <h1 style={{"color" :"white"}}>{resultText}</h1>
          <h1 style={{"color" :"white"}}>Would You Like To Play Another Game?</h1>
          <ButtonGroup>
            <Button style={{"color" :"white"}} component={ButtonLink} to="/" onClick={exitSelected}>No</Button> 
            <Button style={{"color" :"white"}} onClick={startOverSelected}>Yes</Button> 
          </ButtonGroup>
        </div>
    } else if (isLoading) {
      result =
        <h1 style={{"color" : "white", "height" : "400vh", "marginTop" : "400vh"}}>Game is Loading...</h1>
    } else {
      result =
        <GameCard card={props.questions[questionIndex]} 
          answered={answerSelected} 
          reset={startOverSelected} exited={exitSelected} continue={nextSelected}/>
    }
    return ( result );
  }

	return (
	  <div >
      {console.log("Inside Game render:")}
      {console.log("- props", props.player, props.players)}
      {console.log("- props.questions", props.questions)}
      {console.log("lastScore:", lastScore)}
      {console.log("totalGamesPlayed:", totalGamesPlayed)}
      {console.log("percentageWon:", percentageWon)}
      {console.log("lastAnswer:", lastAnswer)}
      {console.log("questionIndex:", questionIndex)}
      {console.log("answerText:", answerText)}
      {console.log("isGameOver:", isGameOver)}
      {console.log("isLoading:", isLoading)}   
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} direction="column" alignItems="center">
            <Grid item>
            {showGameState()}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} direction="column" alignItems="center">
            <Grid item>
            <Typography variant="h6" style={{"flexGrow":"1", "color" : "white"}}>
               {answerText}
            </Typography>            
            </Grid>
          </Grid>
        </Grid>
      </Grid>
	  </div>
    );
}

export default Game;