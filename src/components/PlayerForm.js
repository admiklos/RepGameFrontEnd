import React from 'react';
import { Link } from 'react-router-dom';


const PlayerForm = (props) => {
	const [id,           setId]        = React.useState(0);
	const [name,        setName]       = React.useState("");
	const [score,      setScore]       = React.useState(0);
	const [total,      setTotal]       = React.useState(0);
	const [percent,  setPercent]       = React.useState(0);

	const onNameInput = (event) => {
        setName(event.target.value);
    }

    const postPlayer = () => {
		fetch('http://localhost:8080/player', {
			     method  : 'post',
			     headers : {
			     	"Content-Type": "application/json"
			     },
			     body : JSON.stringify({
			     	playerName : name,
			     	lastScore  : 0,
			     	totalGamesPlayed : 0,
			     	percentageWon : 0
			     })
			 }).then(()=> {
		     	props.fetchPlayers();
		     	setName("");
		     	})

    }

    const handlePlayerEntry = () => {
    	let prevPlayer;
        fetch('http://localhost:8080/players')
            .then((res) => res.json())
            .then((players)=>{
            	prevPlayer = players.find(
            		(player) => {
            			return player.playerName === name;
            		});
            	if (prevPlayer) {
            		console.log("Welcome back " + prevPlayer.playerName);
            	} else {
            		postPlayer();
            	}
            });

    }

    // let text-style = {
    // 	"text-align" : "center"
    // }

 	return (
		<div>
			<h1 style={{"textAlign" : "center"}}>Who Represents You?</h1>
			<h2 style={{"textAlign" : "center"}}>Trivia Game</h2>
			<div><input type="text" value={name} onChange={onNameInput} placeholder="Player Handle" /></div>
			<Link to="/game"><button onClick={handlePlayerEntry}>Enter Your Player Name</button></Link>
		</div>
    );

}

export default PlayerForm;
