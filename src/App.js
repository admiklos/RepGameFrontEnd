import React, { useEffect } from 'react';

// React Router imports
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// site imports
import './App.css';
import NavBar from './components/NavBar';
import LeaderBoard from './components/ShowLeaderBoard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import GameSetup from './components/GameSetup';

const App = (props) => {
  const [currPlayerId, setCurrPlayerId] = React.useState(0);
  const [currPlayerName, setCurrPlayerName] = React.useState("");
  const [currLastScore, setCurrLastScore] = React.useState(0);
  const [currTotalPlayed, setCurrTotalPlayed] = React.useState(0);
  const [currPercentageWon, setCurrPercentageWon] = React.useState(0);
  const [gamePlayers, setGamePlayers] = React.useState([]);

  const fetchLeaderBoard = () => {
    fetch("https://whorepresentsyou.cfapps.io/players")
      .then((res)=> res.json())
      .then((response)=>{
        setGamePlayers(response);
        console.log("FETCHLEADERBOARD: ", response);
      });
  }

  const addPlayer = (newPlayer) => {
    setCurrLastScore(0);
    setCurrTotalPlayed(0);
    setCurrPercentageWon(0);
    fetch('https://whorepresentsyou.cfapps.io/player', {
         method  : 'post',
         headers : {
          "Content-Type": "application/json"
         },
         body : JSON.stringify({
          id  : 0,
          playerName : newPlayer,
          lastScore  : 0,
          totalGamesPlayed : 0,
          percentageWon : 0
         })
     }).then(()=> {
        fetchLeaderBoard();
        })
  }

  const updatePlayer = (modPlayer) => {
    setPlayer(modPlayer);
    fetch('https://whorepresentsyou.cfapps.io/player/' + modPlayer.id, {
         method  : 'put',
         headers : {
          "Content-Type": "application/json"
         },
         body : JSON.stringify({
          playerName : modPlayer.playerName,
          lastScore  : modPlayer.lastScore,
          totalGamesPlayed : modPlayer.totalGamesPlayed,
          percentageWon : modPlayer.percentageWon
         })
     }).then(()=> {
        fetchLeaderBoard();
        })
  }

  const deletePlayer = (delPlayer) => {
    clearPlayer();
    fetch('https://whorepresentsyou.cfapps.io/player/' + delPlayer.id, {
         method  : 'delete',
     }).then(()=> {
        fetchLeaderBoard();
        })
  }

  const setPlayer=(newPlayer)=>{
    setCurrPlayerId(newPlayer.id);
    setCurrPlayerName(newPlayer.playerName);
    setCurrLastScore(newPlayer.lastScore);
    setCurrTotalPlayed(newPlayer.totalGamesPlayed);
    setCurrPercentageWon(newPlayer.percentageWon);
  }

  const clearPlayer=(newPlayer)=>{
    setCurrPlayerId(0);
    setCurrPlayerName("");
    setCurrLastScore(0);
    setCurrTotalPlayed(0);
    setCurrPercentageWon(0);
  }

  useEffect(() => {
    fetchLeaderBoard()},[]);

  return (
    <Router>
      {console.log("Inside App render: ", currPlayerId, currPlayerName, currLastScore, currTotalPlayed, currPercentageWon)}
      <NavBar player={currPlayerName}/>
      <div id="content_body">
        <Switch>
          <Route path="/allofcongress" render={ props => (
            <GameSetup player={currPlayerId} players={gamePlayers} update={updatePlayer}/>
          )} />
          <Route path="/leader-board" render={ props => (
            <LeaderBoard players={gamePlayers}/>
          )} />
          <Route exact path="/" render={ props => (
            <SignIn players={gamePlayers} setPlayer={setPlayer}/>
          )} />
          <Route path="/signup" render={ props => (
            <SignUp players={gamePlayers} addPlayer={addPlayer}/>
          )} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

