import React, { useEffect, memo, lazy } from 'react';

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
//const GameCard = lazy(()=> import('./GameCard'));

const Game = (props) => {

  const [lastScore, setLastScore] = React.useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = React.useState(0);
  const [percentageWon, setPercentageWon] = React.useState(0);

  const [lastAnswer, setLastAnswer] = React.useState("");
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [answerText, setAnswerText] = React.useState("");
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
  }

  const startOverSelected = (e) => {
    console.log("Start Over: " + e.target.value);
    gameOver();
  }

  const exitSelected = (e) => {
    setLastAnswer("");
    setLastScore(0);
    setQuestionIndex(0);
  }

  const nextSelected = (e) => {
    let questionList = props.questions;
    console.log("Player Score: " + lastScore);
    console.log("Total Games Played: " + totalGamesPlayed);
    console.log("Percentage Won: " + percentageWon);
    console.log("Last Answer: " + lastAnswer);
    console.log("Index into Question List: " + questionIndex);
    console.log("Question List: " + questionList.map(question => question));

    let checkValue;
    if (questionList.length > 0 && questionIndex < 10) {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setLastAnswer("");
      checkValue = questionList[questionIndex].correctAnswer;
      if (lastAnswer === checkValue) {
        console.log("I GOT IT RIGHT!")
        setLastScore(prevScore => prevScore + 1);
        setAnswerText("Correct");
      } else {
        console.log("I GOT IT WRONG")
        setAnswerText("Ooops!  No, the correct answer is: " + lastAnswer);
      }

      console.log("Player Score: " + lastScore);
      console.log("Last Answer: " + lastAnswer);
      console.log("Last Score: " + lastScore);
      console.log("Index into Question List: " + questionIndex);
      console.log("AnswerText: " + answerText);

    } else if (questionList.length <= 0) {
      window.alert("Questions have failed to load.");
    } else {
      gameOver();
    }
    
  }

  const gameOver=()=>{
    if (lastScore > 5) {
      setPercentageWon(prevPercentage => ((totalGamesPlayed * prevPercentage) + 100) / (totalGamesPlayed + 1));
    }
    setTotalGamesPlayed(prevPlayed => prevPlayed + 1);
    setQuestionIndex(0);
    setGameOver(true);
  }

  // TODO: took out the Yes button below until I get the callbacks working -
  //    then I can add back in the props.createList and work out its bugs.
  //  <Button component={ButtonLink} onClick={props.createList}>Yes</Button>

  const showGameState = () => {
    let result = "";
    if (isGameOver) {
      result =
        <div>
          <h1 style={{"color" :"white"}}>Would You Like To Play Another Game?</h1>
          <ButtonGroup>
            <Button component={ButtonLink} to="/" onClick={exitSelected}>No</Button> 
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
            <Typography variant="h6" style={{"flexGrow":"1"}}>
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