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
      gamePlayers   : [],
      currentPlayerName : "",
      currentPlayer : 0,
    }
  }

  setPlayer=(name)=>{
    this.setState({
      currentPlayerName : name
    });
    this.setState({
       currentPlayer : this.state.gamePlayers.indexOf(this.state.gamePlayers.find(player => player.playerName === name))
     });
  }

  fetchLeaderBoard=()=>{
    fetch("http://localhost:8080/players")
      .then((res)=> res.json())
      .then((gamePlayers)=>{
        this.setState({
          gamePlayers : gamePlayers
        });
      })
  }

  componentDidMount() {
    this.fetchLeaderBoard("");
  }
  

  render() {
    document.getElementsByTagName("body")[0].style.height = `100%`;
    document.getElementsByTagName("body")[0].style.borderRadius = `8px`;
    document.getElementsByTagName("body")[0].style.position = `relative`;
    document.getElementsByTagName("body")[0].style.backgroundPosition = `center`;
    document.getElementsByTagName("body")[0].style.backgroundRepeat = `no-repeat`;
    document.getElementsByTagName("body")[0].style.backgroundSize = `cover`;

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
              <Game players={this.state.gamePlayers} fetchPlayers={this.fetchLeaderBoard}/>
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
