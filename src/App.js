import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LeaderBoard from './components/ShowLeaderBoard';
import PlayerForm from './components/PlayerForm';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      gamePlayers       : [],
      senateMembers     : [],
      houseMembers      : [],
      memberTrivia      : [],
      maleMemberNames   : [],
      femaleMemberNames : [],
      generalQuestions  : []
    }
  }


  fetchLeaderBoard=()=>{
    fetch("http://localhost:8080/players")
      .then((res)=> res.json())
      .then((gamePlayers)=>{
        this.setState({
          gamePlayers : gamePlayers
        })
      })
  }

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

  getRandomMemberName = (gender) => {
    if (gender === "M") {
      let size = this.state.maleMemberNames.length;
      return this.state.maleMemberNames[(Math.floor(Math.random() * (size*size) % size))];
    }
    else {
      let size = this.state.femaleMemberNames.length;
      return this.state.femaleMemberNames[(Math.floor(Math.random() * (size*size) % size))];
    }
  }

  getRandomState(memberState) {
    const stateList = ["AK","AL","AZ","AR","CA","CO","CT","DE","FL","GA",
                "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
                "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
                "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
                "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

    let index = (Math.floor(Math.random() * 2500 % 50));
    let result = stateList[index];
    while (stateList[index] === memberState) {
      index = (Math.floor(Math.random() * 2500 % 50));
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
        correct_answer    : member.first_name + " " + member.last_name,
        incorrect_answers : [] 
        },
        {
        question          : "What state do I represent?",
        correct_answer    : member.state,
        incorrect_answers : [this.getRandomState(member.state), this.getRandomState(member.state), this.getRandomState(member.state)] 
        },
        {
        question          : "What chamber of congress do I work in, Senate or House of Representatives?",
        correct_answer    : chamber,
        incorrect_answers : [notChamber] 
        },
        {
        question          : "Which party do I belong to?",
        correct_answer    :  member.party === "R" ? "Republican" : "Democrat",
        incorrect_answers : [member.party === "R" ? "Democrat" : "Republican"] 
        }]
    };

    //console.log(newItem);
    this.setState({
      memberTrivia: [...this.state.memberTrivia, newItem ]
    });
    //console.log(this.state.memberTrivia[this.state.memberTrivia.length-1]);
  }

  fetchSenateMembers=()=>{
    fetch ("https://api.propublica.org/congress/v1/116/senate/members/",
            {headers: {"X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS"} }) 
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
    fetch ("https://api.propublica.org/congress/v1/116/house/members/",
           {headers: {"X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS"} }) 
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
    this.fetchLeaderBoard();
    this.fetchSenateMembers();
    this.fetchHouseMembers();
    this.fetchGeneralTrivia();
  }

  render() {
    return (
      <Router>
        <nav>
          <ul>
          <li>
            <Link to="/leader-board">LeaderBoard</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          </ul>
        </nav>
        <div id="content_body">
          <Switch>
            <Route path="/game">
            </Route>
            <Route path="/leader-board">
              <LeaderBoard players={this.state.gamePlayers}/>
            </Route>
            <Route exact path="/">
              <PlayerForm fetchPlayers={this.fetchLeaderBoard}/>
            </Route>
          </Switch>

        </div>
      </Router>
    );
  }
}

export default App;
