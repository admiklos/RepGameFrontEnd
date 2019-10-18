import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '5.5rem',
  },
  textField: {
//    marginLeft: theme.spacing(1),
 //   marginRight: theme.spacing(1),
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

const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

export default withStyles(styles)(class SignIn extends React.Component {
	constructor(props) {
		super(props);
	    this.state = {
	    	player : {
	    		 playerName : '',
				 lastScore : 0,
				 totalGamesPlayed : 0,
				 percentageWon : 0
	    	}
	    }
    }

	handleChange = name => (event) => {
		this.setState({
			player: {
			...this.state.player,
        	[name]: event.target.value,		
        	}	
		});
    }

    postPlayer = () => {
		fetch('http://localhost:8080/player', {
			     method  : 'post',
			     headers : {
			     	"Content-Type": "application/json"
			     },
			     body : JSON.stringify({
			     	playerName : this.state.player.playerName,
			     	lastScore  : 0,
			     	totalGamesPlayed : 0,
			     	percentageWon : 0
			     })
			 }).then(()=> {
			 	console.log("Player " + this.state.player.playerName + " Posted.");
		     	this.props.fetchPlayers();
		     	this.setState({
		     		player : {
		     			...this.state.player,
		     			playerName : "",
		     		}
		     	});
		     	})
    }

    handlePlayerEntry = () => {
    	let prevPlayer;
        this.props.setPlayer("Tom Smith");
        fetch('http://localhost:8080/players')
            .then((res) => res.json())
            .then((players)=>{
            	prevPlayer = players.find(
            		(player) => {
            			return player.playerName === this.state.player.playerName;
            		});
            	if (prevPlayer) {
            		console.log("Welcome back " + prevPlayer.playerName);
            	} else {
            		this.postPlayer();
            		console.log("Welcome " + this.state.player.playerName);
            	}
            });

    }

    render() {
    	const { classes } = this.props;
	 	return (
	 		//document.getElementById("root")[0].style.backgroundImage = 'url("./images/michael-9wXvgLMDetA-unsplash.jpg"';

			<div>
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
					        value={this.state.player.playerName}
					        required={true}
					        onChange={this.handleChange('playerName')}
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
			              <Button style={{"marginTop" : "16px"}} size="large" variant="contained" href="/allofcongress" onClick={this.handlePlayerEntry}>Sign In</Button>
			              <Button style={{"justifyContent" : "flex-end", "color" : "white"}} component={Link1} to="/signup">Sign Up?</Button>
	              </FormControl>
			    </form>		
			</div>
	    );
	 }

})



