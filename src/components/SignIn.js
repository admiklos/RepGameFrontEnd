import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import SignInImage from '../images/michael-9wXvgLMDetA-unsplash.jpg';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '5.5rem',
  },
  textField: {
    background: 'white',
    float: 'left',
  },
  fieldset: {
  	margin: '0 auto',
  },
  formLabel: {
  	color: 'white',
  },
});

const ButtonLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

export default withStyles(styles)(class SignIn extends React.Component {
	constructor(props) {
		super(props);
	    this.state = {
	    	playerNameInput:""
	    }
    }

	handleChange = event => {
		this.setState({
			playerNameInput: event.target.value
		});

		console.log("PLAYER IS: " + this.state.playerNameInput);
    }

    postPlayer = () => {
		fetch('http://localhost:8080/player', {
			     method  : 'post',
			     headers : {
			     	"Content-Type": "application/json"
			     },
			     body : JSON.stringify({
			     	playerName : this.state.playerNameInput,
			     	lastScore  : 0,
			     	totalGamesPlayed : 0,
			     	percentageWon : 0
			     })
			 }).then(()=> {
			 	console.log("Player " + this.state.playerNameInput + " Posted.");
		     	this.props.fetchPlayers();
		     	this.setState({ playerNameInput : ""});
		     	})

    }

    handlePlayerEntry = () => {
        this.props.setPlayer(this.state.playerNameInput);
        console.log("PLAYER NAME INPUT: " + this.state.playerNameInput);
    	let prevPlayer;
        fetch('http://localhost:8080/players')
            .then((res) => res.json())
            .then((players)=>{
            	prevPlayer = players.find(
            		(player) => {
            			return player.playerName === this.state.playerNameInput;
            		});
            	if (prevPlayer) {
            		this.props.fetchPlayers();
            		console.log("Welcome back " + prevPlayer.playerNameInput);
            	} else {
            		this.postPlayer();
            		console.log(this.state.playerNameInput + " cannot log in - user not found");
            	}
            });

    }

    render() {
    	const { classes } = this.props;
        document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + SignInImage + ")";
	 	return (
			<div >
				<h1 style={{"textAlign" : "center", "color" : "white"}}>Who Represents You?</h1>
				<h2 style={{"textAlign" : "center", "color" : "white"}}>Trivia Game</h2>
			    <form className={classes.container} noValidate autoComplete="off">
	              <FormControl component="fieldset" className={classes.fieldset}>
	              <FormLabel className={classes.formLabel} component="legend">Login:</FormLabel>
	              <FormGroup>
					      <TextField 
					        id="filled-name"
					        label="Name"
					        className={classes.textField}
					        value={this.state.playerNameInput}
					        required={true}
					        onChange={this.handleChange}
					        autoFocus={true}
					        margin="normal"
					        variant="filled"
					      />		
					      <TextField
					        id="filled-password-input"
					        label="Password"
					        className={classes.textField}
					        type="password"
					        autoComplete="current-password"
					        margin="normal"
					        variant="filled"
					      />
					      </FormGroup>
	                       <Button style={{"marginTop" : "16px"}} size="large" variant="contained" component={ButtonLink} onClick={this.handlePlayerEntry} to="/allofcongress">Sign In</Button>
                            <Button style={{"justifyContent" : "flex-end", "color" : "white"}} component={ButtonLink} to="/signup">Sign Up?</Button>
	              </FormControl>
			    </form>		
			</div>
	    );
	 }

})



