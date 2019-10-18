import React from 'react';
import LeaderBoardImage from '../images/max-larochelle-Aq297ML2cSk-unsplash.jpg';

// componentDidMount() {
//   document.getElementById("root").style.backgroundImmage = 'url("./images/max-larochelle-Aq297ML2cSk-unsplash.jpg")';
// }


const ShowLeaderBoard = (props) => {

	console.log(props.players);
	document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + LeaderBoardImage + ")";

	let playerArr = props.players.map( (player, index) => {

        return(
              <tr key={index}>
              	<td>{player.playerName}</td>
              	<td>{player.lastScore}</td>
              	<td>{player.totalGamesPlayed}</td>
              	<td>{player.percentageWon}</td>
              </tr>
        )
	});

	return (
		<div>
			<h1 style={{"textAlign":"center", "color":"white"}}>Show all Players</h1>
			<table>
			  <thead>
				  <tr>
				    <th>Player</th>
				    <th>Last Score</th>
				    <th>Total Games Played</th>
				    <th>Percentage Won</th>
				  </tr>
			  </thead>
			  <tbody>
				    {playerArr}
			  </tbody>
			</table>
		</div>
    );
}

export default ShowLeaderBoard;
