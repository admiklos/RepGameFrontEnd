import React from 'react';

const ShowLeaderBoard = (props) => {
	console.log(props.players);
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
