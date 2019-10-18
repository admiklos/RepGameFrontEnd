import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
  button : {
	margin: theme.spacing(1),
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

class Game extends React.Component {
	constructor(){
		super();
		this.state = {
	      senateMembers     : [],
	      houseMembers      : [],
	      memberTrivia      : [],
	      maleMemberNames   : [],
	      femaleMemberNames : [],
	      generalQuestions  : []
		};
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
    fetch ('https://api.propublica.org/congress/v1/116/senate/members/',
        {
        	 method: "get",
            headers: {
           		"X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS"
        	} 
    	}) 
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
    this.fetchSenateMembers();
    this.fetchHouseMembers();
    this.fetchGeneralTrivia();
  }

  render() {
    
    	return (
    	  <div>
    	    <GameCard />
    	  </div>
        );
  }
}

function GameCard(props) {
	const classes = useStyles();
	return (
		<Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1} direction="column" alignItems="center">
          <Grid item>
	    <Card className={classes.card} style={{"marginTop" : "6vh"}}>
	        <CardMedia
	          className={classes.media} style={{"height" : "275px"}}
	          image="https://theunitedstates.io/images/congress/225x275/W000817.jpg"
	          title="Member of Congress"
	        />
	        <CardContent style={{"paddingBottom" : "0"}}>
	          <Typography gutterBottom variant="h5" component="h2">
	            
	          </Typography>
	          <Typography variant="h6" color="textSecondary" component="p">
	            What is my name?
	          </Typography>
	      <CardActions>
	      <ButtonGroup fullWidth={false}>
	        <Button style={{"fontSize" : ".6rem"}}  size="small" color="primary" variant="contained" className={classes.button}>
	            Bonnie Watson Coleman
	        </Button>
	        <Button style={{"fontSize" : ".6rem"}} size="small" color="primary" variant="contained" className={classes.button}>
	            Elizabeth Warren
	        </Button>
	        <Button style={{"fontSize" : ".6rem"}} size="small" color="primary" variant="contained" className={classes.button}>
	            Cynthia Axne
	        </Button>
	        <Button style={{"fontSize" : ".6rem"}} size="small" color="primary" variant="contained" className={classes.button}>
	            Nanette Baragan
	        </Button>
	        </ButtonGroup>
	      </CardActions>
	        </CardContent>
	      <CardActions style={{"paddingTop" : "0"}} >
	        <Button size="medium" color="secondary">
	          Start Over
	        </Button>
	        <Button size="medium" color="secondary">
	          Exit
	        </Button>
	        <Button size="medium" color="secondary">
	          Next
	        </Button>
	      </CardActions>
	    </Card>
	    </Grid>
	    </Grid>
      </Grid>
          </Grid>
	);

}

//<Card className='mdc-card demo-card'>
//	  <CardPrimaryContent className='demo-card__primary-action'>
//	    <CardMedia wide imageUrl={image} className='demo-card__media' />
//	  <div className='demo-card__primary'>
//	    <Headline6 className='demo-card__title'>
//	      Our Changing Planet
//	    </Headline6>
//	    <Subtitle2 className='demo-card__subtitle'>
//	      by Kurt Wagner
//	    </Subtitle2>
//	  </div>
//	  <Body2 className='demo-card__secondary'>
//	    Visit ten places on our planet that are undergoing the biggest changes today.
//	  </Body2>
//	  </CardPrimaryContent>
//	  <CardActions>
//	    <CardActionButtons>
//	      <Button>Read</Button>
//	      <Button>Bookmark</Button>
//	    </CardActionButtons>
//	  </CardActions>
//		</Card>


export default Game;