import React, { useCallback, useEffect, useRef } from 'react';

import Game from './Game';

const GameSetup = (props) => {

  const [gameToPlay, setGameToPlay] = React.useState("AllMembers");
  const [memberTrivia, setMemberTrivia] = React.useState([]);
  const [questionList, setQuestionList] = React.useState([]);
  const [generalQuestions, setGeneralQuestions] = React.useState([]);

  const createQuestionList = (initialList) => {
  	  let questions = [];
  	  let memberList = [];
  	  if (initialList.length > 0) {
  	  	memberList = [...initialList];
  	  } else {
  	  	memberList = [...memberTrivia];
  	  }

	  const createNewQuestion = (triviaItem, trivia) => {
	    let choices = [];
	    let answerIndex = (Math.floor(Math.random() * 100) % trivia.totalOptions);
	      if ( trivia.totalOptions !== 2) {
	        for (let i=0; i<trivia.totalOptions; i++) {
	          if (i === answerIndex) {
	            choices.push(trivia.correct_answer);
	          } else {
	            choices.push(trivia.answers(trivia.param));            
	          }
	        }
	        console.log("choice 1: " + choices[0]);
	        console.log("choice 2: " + choices[1]);
	        console.log("choice 3: " + choices[2]);
	        console.log("choice 4: " + choices[3]);
	      } else {
	        choices.push(trivia.answers[0]);
	        choices.push(trivia.answers[1]);
	        console.log("choice 1: " + choices[0]);
	        console.log("choice 2: " + choices[1]);
	      }
	      const newQuestion = {
	        imageUrl       : triviaItem.memberPhoto,
	        questionText   : trivia.question,
	        correctAnswer  : trivia.correct_answer,
	        totalChoices   : trivia.totalOptions,
	        multipleChoice : choices
	      };
	      // console.log("ITEM NEW: " + newQuestion.imageUrl);
	      return newQuestion;
	  }

      let memberIndex;
      let triviaIndex;
      let triviaEntry;
      let triviaQuestion;
      for(let i=0; i<10; i++) {
        memberIndex = Math.floor(Math.random() * 100) % memberList.length;
        triviaEntry = memberList[memberIndex];

        triviaIndex = Math.floor(Math.random() * 100) % 4;

        // TODO: get a new random index into memberList that hasn't been used
        triviaQuestion = triviaEntry.trivia[triviaIndex];
        // console.log("TRIVIA ENTRY [" + memberIndex + "] = " + triviaEntry.memberId);
        // console.log("TRIVIA QUESTION [" + triviaIndex + "] = " + triviaQuestion.correct_answer)
        questions.push(createNewQuestion(triviaEntry, triviaQuestion));
      }
      setQuestionList([...questions]);
      //console.log("ITEM ADDED: " + questionList[questionList.length-1].imageUrl);
  }

  const createQuestionListRef = React.useRef(createQuestionList);

  useEffect( () => {
   	createQuestionListRef.current = createQuestionList;
   });

  const createQuestionListMemo = useCallback( () => {
   	createQuestionListRef.current();
   },[]);

  useEffect( () => {
	  let senateMembers = [];
	  let senateCount = 0;
	  let houseMembers = [];
	  let houseCount = 0;
	  let totalMembers = 0;
	  let maleMemberNames = [];
	  let femaleMemberNames = [];
	  let trivia = [];
	  if (memberTrivia.length > 0) return;

	  // used for incorrect answers - create gender-equivalent list of names
	  const createMemberNameList = () => {
	    senateMembers.forEach( (member) => {
	      if (member.gender === "M")
	      	maleMemberNames.push(member.first_name + " " + member.last_name);
	      else 
	      	femaleMemberNames.push(member.first_name + " " + member.last_name);
	    });
	    houseMembers.forEach( (member) => {
	      if (member.gender === "M")
	      	maleMemberNames.push(member.first_name + " " + member.last_name);
	      else 
	      	femaleMemberNames.push(member.first_name + " " + member.last_name);
	    });
	  };

	  // used for incorrect answers - return a random gender-equivalent name
	  // not equal to the members name
	  const getRandomMemberName = (gender) => {
	    if (gender === "M") {
	      let size = maleMemberNames.length;
	      return maleMemberNames[(Math.floor(Math.random() * 100) % size)];
	    }
	    else {
	      let size = femaleMemberNames.length;
	      return femaleMemberNames[(Math.floor(Math.random() * 100) % size)];
	    }
	  }

	  // pick any state except for the congress members state
	  // this is for incorrect answer list
	  const getRandomState = (memberState) => {
	    const stateList = ["AK","AL","AZ","AR","CA","CO","CT","DE","FL","GA",
	                "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
	                "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
	                "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
	                "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

	    let index = Math.floor(Math.random() * 100) % 50;
	    let result = stateList[index];

	    while (stateList[index] === memberState) {
	      index = Math.floor(Math.random() * 100) % 50;
	      result = stateList[index];
	    }
	    return result;
	  };

	  const createQuestions = () => {
	    if (senateCount > 0 && houseCount > 0) {
	       console.log("Number of member trivia: " + memberTrivia.length);
	       console.log("Number of totalMembers: " + totalMembers);
	       setMemberTrivia([...trivia]);
	       createMemberNameList();
	       createQuestionList(trivia);
	    }
	  }

	  const fetchSenateMembers = () => {
	    fetch ('https://api.propublica.org/congress/v1/116/senate/members.json',
	        {
	           method: "get",
	            headers: {
	              "X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS",
	          } 
	      }) 
	       .then(res =>  res.json())
	       .then(response => {
	          totalMembers += response.results[0].num_results;
	          console.log("TOTAL: " + totalMembers + " and total senate: " + response.results[0].num_results);
	          senateMembers = [...response.results[0].members];
	          senateCount = response.results[0].num_results;
	          senateMembers.forEach( (member) => { 
			    let item = {
			      memberId: member.id,
			      memberPhoto: "https://theunitedstates.io/images/congress/225x275/" + member.id + ".jpg",
			      trivia  : [{
			        question          : "What is my name?",
			        totalOptions      : 4,
			        correct_answer    : member.first_name + " " + member.last_name,
			        param             : member.gender,
			        answers           : getRandomMemberName 
			        },
			        {
			        question          : "What state do I represent?",
			        totalOptions      : 4,
			        correct_answer    : member.state,
			        param             : member.state,
			        answers           : getRandomState 
			        },
			        {
			        question          : "What chamber of congress do I work in, Senate or House of Representatives?",
			        totalOptions      : 2,
			        correct_answer    : "Senate",
			        answers           : ['Senate', 'House'] 
			        },
			        {
			        question          : "Which party do I belong to?",
			        totalOptions      : 2,
			        correct_answer    :  member.party === "R" ? "Republican" : "Democrat",
			        answers           : ['Republican', 'Democrat'] 
			        }]
			    };
			    trivia.push(item);
	            });
	          createQuestions();
	          })
	       .catch(error => console.log(error));

	  }

	  const fetchHouseMembers = () => {
	    fetch ('https://api.propublica.org/congress/v1/116/house/members.json', 
	        { 
	            method : "get",
	            headers: {
	              "X-API-Key" : "PznofnR4rVxDnNyUiiZ2mu6ocFnnnuxUHQmpN8oS"
	            } 
	        }) 
	       .then(res => res.json())
	       .then(response => {
	          //console.log(response.results[0].members);
	          totalMembers += response.results[0].num_results;
	          console.log("TOTAL: ", totalMembers, " and total house: ", response.results[0].num_results);
	          houseMembers = [...response.results[0].members];
	          houseCount = response.results[0].num_results;
	          houseMembers.forEach( member => { 
			    let item = {
			      memberId: member.id,
			      memberPhoto: "https://theunitedstates.io/images/congress/225x275/" + member.id + ".jpg",
			      trivia  : [{
			        question          : "What is my name?",
			        totalOptions      : 4,
			        correct_answer    : member.first_name + " " + member.last_name,
			        param             : member.gender,
			        answers           : getRandomMemberName 
			        },
			        {
			        question          : "What state do I represent?",
			        totalOptions      : 4,
			        correct_answer    : member.state,
			        param             : member.state,
			        answers           : getRandomState 
			        },
			        {
			        question          : "What chamber of congress do I work in, Senate or House of Representatives?",
			        totalOptions      : 2,
			        correct_answer    : "House",
			        answers           : ['Senate', 'House'] 
			        },
			        {
			        question          : "Which party do I belong to?",
			        totalOptions      : 2,
			        correct_answer    :  member.party === "R" ? "Republican" : "Democrat",
			        answers           : ['Republican', 'Democrat'] 
			        }]
			    };
	    		trivia.push(item);
	          });
	          createQuestions();
	          //console.log(memberTrivia);
	        })
	       .catch(error => console.log(error));
	  }

	  const fetchGeneralTrivia = () => {
	    fetch ("https://opentdb.com/api.php?amount=10&category=24&difficulty=medium&type=multiple") 
	       .then(res => res.json())
	       .then(response => {
	         setGeneralQuestions(response.results);
	      });
	  }

//      fetchGeneralTrivia();
      fetchSenateMembers();
      fetchHouseMembers();

  },[createQuestionListMemo]);

  // useCallback( () => {
  //   memoizedQuestions();
  // },[memoizedQuestions]);

  //[createQuestionList, femaleMemberNames, houseCount, houseMembers, 
   //  maleMemberNames, memberTrivia, senateCount, senateMembers, totalMembers]);

  const chooseGameToPlay = () => {
    console.log("Inside GameSetup render: ", gameToPlay, questionList, generalQuestions);	
    console.log("Inside GameSetup render - props", props.player, props.players);
  	if (gameToPlay === "AllMembers")
       return <Game player={props.player} players={props.players} update={props.update} questions={questionList} />  	
  	if (gameToPlay === "StateOnlyMembers")
       return <h1 style={{"color" : "white"}}>In the Works</h1>  	
  	if (gameToPlay === "AllMembersFaceMatch")
       return <h1 style={{"color" : "white"}}>In the Works</h1>  	
  	if (gameToPlay === "GeneralTrivia")
       return <h1 style={{"color" : "white"}}>In the Works</h1> 
  }

  return (
  	<div>{chooseGameToPlay()}</div>
  	);

}

export default GameSetup;