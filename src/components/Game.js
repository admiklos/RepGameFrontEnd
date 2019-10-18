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
	constructor(){
		super();
		this.state = {
        dataCreated       : false,
        player            : { id : 0, 
                              playerName : "",
                              lastScore : 0,
                              totalGamesPlayed : 0,
                              percentageWon : 0
                            },
        lastAnswer        : "",
        currentQuestion   : {member: 0, trivia: 0},
        questionCount     : 0,
        askedQuestions    : [],
	      senateMembers     : [],
	      houseMembers      : [],
	      maleMemberNames   : [],
	      femaleMemberNames : [],
        memberTrivia      : [],
	      generalQuestions  : [],
        questionList      : [],
		};
	}


  // used for incorrect answers - create gender-equivalent list of names
  createMemberNameList = () => {
    this.state.senateMembers.forEach( (member) => {
      if (member.gender === "M")
        this.setState({
            maleMemberNames: [...this.state.maleMemberNames, member.first_name + " " + member.last_name ]
         });
      else 
        this.setState({
            femaleMemberNames: [...this.state.femaleMemberNames, member.first_name + " " + member.last_name ]
         });
    });
  }

  // used for incorrect answers - return a random gender-equivalent name
  // not equal to the members name
  getRandomMemberName = (gender) => {
    if (gender === "M") {
      let size = this.state.maleMemberNames.length;
      return this.state.maleMemberNames[(Math.floor(Math.random() * size))];
    }
    else {
      let size = this.state.femaleMemberNames.length;
      return this.state.femaleMemberNames[(Math.floor(Math.random() * size))];
    }
  }

  // pick any state except for the congress members state
  // this is for incorrect answer list
  getRandomState(memberState) {
    const stateList = ["AK","AL","AZ","AR","CA","CO","CT","DE","FL","GA",
                "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
                "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
                "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
                "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

    let index = (Math.floor(Math.random() * 50));
    let result = stateList[index];

    while (stateList[index] === memberState) {
      index = (Math.floor(Math.random() * 50));
      result = stateList[index];
    }
    return result;
  }

  createNewTriviaEntry=(member, chamber)=>{
    let notChamber = chamber === "House" ? "Senate" : "House";
    let newItem = {
      memberId: member.id,
      memberPhoto: "https://theunitedstates.io/images/congress/225x275/" + member.id + ".jpg",
      trivia  : [{
        question          : "What is my name?",
        totalOptions      : 4,
        correct_answer    : member.first_name + " " + member.last_name,
        param             : member.gender,
        answers           : this.getRandomMemberName 
        },
        {
        question          : "What state do I represent?",
        totalOptions      : 4,
        correct_answer    : member.state,
        param             : member.state,
        answers           : this.getRandomState 
        },
        {
        question          : "What chamber of congress do I work in, Senate or House of Representatives?",
        totalOptions      : 2,
        correct_answer    : chamber,
        answers           : ['Senate', 'House'] 
        },
        {
        question          : "Which party do I belong to?",
        totalOptions      : 2,
        correct_answer    :  member.party === "R" ? "Republican" : "Democrat",
        answers           : ['Republic', 'Democrat'] 
        }]
    };

    console.log(newItem);
    this.setState({
      memberTrivia: [...this.state.memberTrivia, newItem ]
    });
    //console.log(this.state.memberTrivia[this.state.memberTrivia.length-1]);
  }

  createNewQuestion=(triviaItem, trivia)=>{
    let choices = [];
    if (trivia.totalOptions === 4) {
      for (let i=0; i<trivia.totalOptions; i++) {
        choices[i].append(trivia.answers(trivia.param));
      }
    }
    let newQuestion = {
      imageUrl       : triviaItem.memberPhoto,
      questionText   : trivia.question,
      correctAnswer  : trivia.correct_answer,
      totalChoices   : 4,
      multipleChoice : choices
    };
    this.setState({
      questionList: [...this.state.questionList, newQuestion ]
    });

  }

  createQuestionList=()=>{
    let memberIndex;
    let triviaIndex;
    let triviaEntry;
    let triviaQuestion;
    for(let i=0; i<10; i++) {
      memberIndex = Math.floor(Math.random() * this.state.memberTrivia.length);
      triviaIndex = Math.floor(Math.random() * 4);
      // TODO: get a new random index into memberTrivia that hasn't been used
      triviaEntry = this.state.memberTrivia[memberIndex];
      triviaQuestion = this.state.memberTrivia[triviaIndex];
      this.createNewQuestion(triviaEntry, triviaQuestion);
    }
  }


  fetchSenateMembers=()=>{
    fetch ('https://api.propublica.org/congress/v1/116/senate/members/',
        {
        	 method: "get",
            headers: {
           		"X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS"
        	} 
    	}) 
       .then(res => res.json())
       .then(response => {
          //console.log(response.results[0].members);
          this.setState({
            senateMembers : response.results[0].members
          });
          this.state.senateMembers.forEach( (member) => {
            //console.log(member);
            this.createNewTriviaEntry(member, "Senate");
          });
        });
  }

  fetchHouseMembers=()=>{
    fetch ('https://api.propublica.org/congress/v1/116/house/members/', 
        { 
           	method : "get",
            headers: {
            	"X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS"
           	} 
        }) 
       .then(res => res.json())
       .then(response => {
          //console.log(response.results[0].members);
          this.setState({
            houseMembers : response.results[0].members
          });
          this.state.houseMembers.forEach( (member) => {
            this.createNewTriviaEntry(member, "House");
          });
          //console.log(this.state.memberTrivia);
        });
  }

  fetchGeneralTrivia=()=>{
    fetch ("https://opentdb.com/api.php?amount=5&category=24&difficulty=medium&type=multiple") 
       .then(res => res.json())
       .then(response => {
         //console.log(response.results);
         this.setState({
          generalQuestions : response.results
        });
      });
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + GameImage + ")";
    Promise.all([this.fetchSenateMembers(), this.fetchHouseMembers(), this.fetchGeneralTrivia()])
    .then((results)=>{
      // console.log(results[0]);
      //this.createQuestionList();
    })
  }

  answerSelected(e){
    console.log("ANSWER: " + e.target.value);
  }

  startOverSelected(e){
    console.log("Start Over: " + e.target.value);
  }

  exitSelected(e){
    // this.setState({
    //   lastAnswer : "",
    //   currentQuestion: {member:0, trivia:0},
    //   askedQuestions: []
    // });    
  }

  nextSelected(e){
    console.log("Next: " + e.target.value);
    // TODO: increment/decrement lastScore
    if (this.state.lastAnswer === this.state.memberTrivia[this.state.currentQuestion.member].correct_answer) {
      this.setState({
        player : { ...this.state.player,
          lastScore : (this.state.lastScore + 1)
        }
      });
    } else {
      this.setState({
        player : { ...this.state.player,
          lastScore : (this.state.lastScore - 1)
        }
      });   
    }
    this.setNextQuestion();
  }

  gameOver=()=>{
    this.setState({
      questionCount : 0
    });
    // disable the next button
    // display score 
    // display ?  something else
  }

  setNextQuestion=()=>{
    if (this.state.questionCount === 10) {
      this.gameOver();  
    } else {
      this.setState({
        questionCount : this.state.questionCount + 1
      })
      this.setState({
        lastAnswer : ""
      })
    }
  }

  render() {
    const setQuestion = 
      (this.state.memberTrivia[this.state.currentQuestion.member]) ?
       this.state.memberTrivia[this.state.currentQuestion.member].trivia[this.state.currentQuestion.trivia] : "";
//style={{"backgroundImage" : 'url("./images/michael-9wXvgLMDetA-unsplash.jpg")'}}
    	return (
    	  <div >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={1} direction="column" alignItems="center">
                <Grid item>
    	            <GameCard card={this.state.memberTrivia[this.state.currentQuestion.member]} 
                    question={setQuestion} 
                    answered={this.answerSelected} 
                    reset={this.startOverSelected} exited={this.exitSelected} continue={this.nextSelected}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
    	  </div>
        );
  }
}


function GameCard(props) {

  const answerStyle = (props.question) ? 
                      ((props.question.totalOptions === 4) ? 
                          {"fontSize" : ".6rem"} : {"visibility" : "hidden"} ) : {"fontSize" : ".6rem"};

	const classes = useStyles();
	return (
	    <Card className={classes.card} style={{"marginTop" : "6vh"}}>
	      <CardMedia
	          className={classes.media} style={{"height" : "275px"}}
	          image="https://theunitedstates.io/images/congress/225x275/W000817.jpg"
	          title="Member of Congress"
	      />
  	    <CardContent style={{"paddingBottom" : "0"}}>
  	      <Typography variant="h6" color="textSecondary" component="p">
  	          {props.question ? props.question.question : "What is my name?"}
  	      </Typography>
  	      <CardActions>
  	        <ButtonGroup fullWidth={false}>
  	          <Button style={{"fontSize" : ".6rem"}}  size="small" color="primary" variant="contained" onClick={props.answered} className={classes.button}>
  	            Bonnie Watson Coleman
  	          </Button>
  	          <Button style={{"fontSize" : ".6rem"}} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            Elizabeth Warren
  	          </Button>
  	          <Button style={answerStyle} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            Cynthia Axne
  	          </Button>
  	          <Button style={answerStyle} size="small" color="primary" variant="contained"  onClick={props.answered} className={classes.button}>
  	            Nanette Baragan
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