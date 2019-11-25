import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import SignUpImage from '../images/michael-9wXvgLMDetA-unsplash.jpg';


const useStyles = makeStyles (theme => ({
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
}));

const ButtonLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const SignUp = (props) => {
	const [playerName, setPlayerName] = React.useState("");
	const [playerPassword, setPlayerPassword] = React.useState("");
	const [signUpErrors, setSignUpErrors] = React.useState("");
    document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + SignUpImage + ")";

	const handleChange = (e) => {
        e.preventDefault();
		console.log("PLAYER IS: " + e.target.value);
		setPlayerName(e.target.value);
    }

    const handlePlayerEntry = (e) => {
    	let currPlayer = props.players.find(
    		(player) => {
    			return player.playerName === playerName;
    		});
    	if (currPlayer) {
	        console.log(playerName, "already exists. Please sign in.");
    	} else {
    		props.addPlayer(playerName);
    	}
    }

    const classes = useStyles();

 	return (
		<div >
        {console.log("Inside SignUp render: ", playerName)}
			<h1 style={{"textAlign" : "center", "color" : "white"}}>Who Represents You?</h1>
			<h2 style={{"textAlign" : "center", "color" : "white"}}>Trivia Game</h2>
		    <form className={classes.container} noValidate autoComplete="off">
              <FormControl component="fieldset" className={classes.fieldset}>
              <FormLabel className={classes.formLabel} component="legend">New Account</FormLabel>
              <FormGroup>
				      <TextField 
				        id="filled-name"
				        label="Name"
				        className={classes.textField}
			        autoComplete="username"
			        value={playerName}
				        required={true}
			        onChange={handleChange}
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
				      <TextField
				        id="filled-password-input2"
				        label="Verify-Password"
				        className={classes.textField}
				        type="password"
				        autoComplete="current-password"
				        margin="normal"
				        variant="filled"
				      />
				      </FormGroup>
                         <Button style={{"marginTop" : "16px"}} size="large" variant="contained" component={ButtonLink} to="/allofcongress" onClick={handlePlayerEntry}>Sign Up</Button>
                        <Button style={{"justifyContent" : "flex-end", "color" : "white"}} component={ButtonLink} to="/">Sign In?</Button>
              </FormControl>
		    </form>		
		</div>
    );
}

export default SignUp;



