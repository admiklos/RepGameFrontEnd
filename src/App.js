import React from 'react';

// React Router imports
import { Link as RouterLink } from 'react-router-dom';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// site imports
import './App.css';
import LeaderBoard from './components/ShowLeaderBoard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Game from './components/Game';

// Material UI imports
import { AppBar, Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { Button, IconButton } from '@material-ui/core';

const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPlayerName : "",
      gamePlayers       : [],
      currentPlayer     : {},
      senateMembers     : [],
      houseMembers      : [],
      maleMemberNames   : [],
      femaleMemberNames : [],
      memberTrivia      : [],
      totalMembers      : -1,
      questionList      : [],
      generalQuestions  : [],
    }
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
      return this.state.maleMemberNames[(Math.floor(Math.random() * 100) % size)];
    }
    else {
      let size = this.state.femaleMemberNames.length;
      return this.state.femaleMemberNames[(Math.floor(Math.random() * 100) % size)];
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

    let index = Math.floor(Math.random() * 100) % 50;
    let result = stateList[index];

    while (stateList[index] === memberState) {
      index = Math.floor(Math.random() * 100) % 50;
      result = stateList[index];
    }
    return result;
  }

  createNewQuestion=(triviaItem, trivia)=>{
    let choices = [];
    let answerIndex = (Math.floor(Math.random() * 100) % trivia.totalOptions);
//    console.log("ANSWER INDEX: " + answerIndex);
      if ( trivia.totalOptions !== 2) {
        for (let i=0; i<trivia.totalOptions; i++) {
          if (i === answerIndex) {
            choices.push(trivia.correct_answer);
          } else {
            choices.push(trivia.answers(trivia.param));            
          }
        }
      } else {
        choices.push(trivia.answers[0]);
        choices.push(trivia.answers[1]);
      }
      const newQuestion = {
        imageUrl       : triviaItem.memberPhoto,
        questionText   : trivia.question,
        correctAnswer  : trivia.correct_answer,
        totalChoices   : trivia.totalOptions,
        multipleChoice : choices
      };
      // console.log("ITEM NEW: " + newQuestion.imageUrl);
      // console.log("ITEM NEW: " + newQuestion.questionText);
      // console.log("ITEM NEW: " + newQuestion.correctAnswer);
      // console.log("ITEM NEW: " + newQuestion.totalChoices);
      // console.log("ITEM NEW: " + newQuestion.multipleChoice[1]);
      this.setState({
        questionList : [...this.state.questionList, newQuestion ]
      });
      // console.log("ITEM ADDED: " + this.state.questionList[this.state.questionList.length-1].imageUrl);
      // console.log("ITEM ADDED: " + this.state.questionList[this.state.questionList.length-1].questionText);
      // console.log("ITEM ADDED: " + this.state.questionList[this.state.questionList.length-1].correctAnswer);
      // console.log("ITEM ADDED: " + this.state.questionList[this.state.questionList.length-1].totalChoices);
      // console.log("ITEM ADDED: " + this.state.questionList[this.state.questionList.length-1].multipleChoice[1]);
  }

  createQuestionList=()=>{
    console.log("I WAS HERE");
    if (this.state.memberTrivia.length === this.state.totalMembers) {
      let memberIndex;
      let triviaIndex;
      let triviaEntry;
      let triviaQuestion;
      for(let i=0; i<10; i++) {
        memberIndex = Math.floor(Math.random() * 100) % this.state.memberTrivia.length;
        triviaEntry = this.state.memberTrivia[memberIndex];

        triviaIndex = Math.floor(Math.random() * 100) % 4;

        // TODO: get a new random index into memberTrivia that hasn't been used
        triviaQuestion = triviaEntry.trivia[triviaIndex];
        // console.log("TRIVIA ENTRY [" + memberIndex + "] = " + triviaEntry.memberId);
        // console.log("TRIVIA QUESTION [" + triviaIndex + "] = " + triviaQuestion.correct_answer)
        this.createNewQuestion(triviaEntry, triviaQuestion);
      }
    }
  }


  createNewTriviaEntry=(member, chamber)=>{
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

    this.setState({
      memberTrivia: [...this.state.memberTrivia, newItem ]
    });
    if (this.state.memberTrivia.length === this.state.totalMembers) {
       this.createQuestionList();
    }
  }

  fetchSenateMembers=()=>{
    fetch ('https://api.propublica.org/congress/v1/116/senate/members/',
        {
           method: "get",
            headers: {
              "X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS",
          } 
      }) 
       .then(res =>  res.json())
       .then(response => {
          this.setState({
            totalMembers : response.results[0].num_results + this.state.totalMembers
          });
          this.setState({
            senateMembers : response.results[0].members
          });
          //console.log(this.state.senateMembers);
          this.state.senateMembers.forEach( (member) => {
            this.createNewTriviaEntry(member, "Senate");
          });
        })
       .catch(error => console.log(error));

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
            totalMembers : response.results[0].num_results + this.state.totalMembers
          });
          this.setState({
            houseMembers : response.results[0].members
          });
          this.state.houseMembers.forEach( (member) => {
            this.createNewTriviaEntry(member, "House");
          });
          //console.log(this.state.memberTrivia);
        })
       .catch(error => console.log(error));

  }

  fetchGeneralTrivia=()=>{
    fetch ("https://opentdb.com/api.php?amount=10&category=24&difficulty=medium&type=multiple") 
       .then(res => res.json())
       .then(response => {
//         console.log(response.results);
         this.setState({
          generalQuestions : response.results
        });
      });
  }


  setPlayer=(aName)=>{
    this.setState({currentPlayerName : aName});
    console.log("PASSED IN PARAM: " + aName + " STATE JUST SET: " + this.state.currentPlayerName + "!");

    this.setState({currentPlayer:this.state.gamePlayers.find(player => player.playerName === aName)});
    console.log("NAME: " + aName);
    console.log("SET PLAYER: " + this.state.currentPlayerName + " CurrentPlayer: " + 
      this.state.currentPlayer.playerName);
  }

  fetchLeaderBoard=()=>{
    fetch("https://whorepresentsyou.cfapps.io/players")
      .then((res)=> res.json())
      .then((response)=>{
        console.log(response);
        this.setState({gamePlayers:response});
        console.log(this.state.gamePlayers);
        console.log("Current player: " + this.state.currentPlayerName);
      });
     //console.log(this.state.gameplayers[0].playerName);
  }


  componentDidMount() {
    this.fetchLeaderBoard();
    this.fetchGeneralTrivia();
    this.fetchSenateMembers();
    this.fetchHouseMembers();
  }


  render() {

    return (
      <Router>
        <div style={{"flexGrow":"1" }}>
          <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{"flexGrow":"1"}}>
                  Welcome {this.state.currentPlayerName}
                </Typography>
                <Button component={Link1} to="/" color="inherit">Home</Button>
                <Button component={Link1} to="/leader-board" color="inherit">LeaderBoard</Button>
                <IconButton component={Link1} to="/settings" style={{"marginRight": "theme.spacing(2)"}} color="inherit" aria-label="settings">
                <SettingsOutlinedIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
        <div id="content_body">
          <Switch>
            <Route path="/allofcongress">
              <Game player={this.state.currentPlayer} questions={this.state.QuestionList} fetchQuestions={this.createQuestionList}/>
            </Route>
            <Route path="/leader-board">
              <LeaderBoard players={this.state.gamePlayers}/>
            </Route>
            <Route exact path="/">
              <SignIn fetchPlayers={this.fetchLeaderBoard} setPlayer={this.setPlayer}/>
            </Route>
            <Route path="/signup">
              <SignUp fetchPlayers={this.fetchLeaderBoard} setPlayer={this.setPlayer}/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

