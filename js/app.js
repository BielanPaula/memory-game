let activeCard = ""; //card which is clicked
const activeCards = []; //first and then second cards which is cliked

let gameResult = 0; //number of game pairs when the game is started
let counter = 0; //number of click when the game is started
let time = 0; //time when the game is started

const stars = document.querySelectorAll(".fa-star");
let movesNumber = document.querySelector(".moves");

let closeicon = document.querySelector("#close");
var starRating = document.querySelector(".stars").innerHTML;
let modal = document.getElementById("mainPopup")

/*
 *  create list of all cards
 */

let cards = document.querySelectorAll(".card"); //return NodeList
cards = [...cards]; //change NodeList to Array - cards = [li,li,li,li,...]

/*
 *  display shuffled cards on the page
 */

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        //Math.random method return number 0-0.99..
        //currentIndex return array.lenght
        //math.floor returns the largest integer less than given number 0,1,...,15
        currentIndex -= 1; //	x = x - y
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function displayShuffledCards(){
    shuffledCards = shuffle(cards); //shuffle array of cards
    const deck = document.querySelector(".deck");
    for (var i= 0; i < shuffledCards.length; i++){
        shuffledCards.forEach(function(item) {
            return deck.appendChild(item)
        });
    }
}


displayShuffledCards();

/*
 * count stars
 */

function starCounter() {
    moveCounter();
    if (counter > 8 && counter < 14) {
        for( i= 0; i < 3; i++) {
            if(i > 1){
                stars[i].style.visibility = "hidden";
            }
        }
    }
    if (counter > 14) {
        for( i= 0; i < 3; i++) {
            if(i > 0) {
                stars[i].style.visibility = "hidden";
            }
        }
    }
}

/*
* count clicks
*/

function moveCounter() {
    counter = counter + 1
    movesNumber.innerHTML = counter;
}

/*
* timer
*/

function timer(){
  setTimeout(function(){
    var timeCounter = document.querySelector(".time");
    time += 1;
    timeCounter.innerHTML = time;
    timer();
  },1000)
}

/*
* close button on popup
*/

function closeModal() {
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
    });
}

/*
* showing congratulations
*/

function congratulation() { //showing congratulations
gameResult = 0;
starRating = document.querySelector(".stars").innerHTML;
modal.classList.add("show");
document.getElementById("finalMoves").innerHTML = counter;
document.getElementById("finalStars").innerHTML = starRating;
document.getElementById("finalTime").innerHTML = time;
closeModal();
}

/*
* repeat game
*/

var repeatGame = function () {
  displayShuffledCards();

  counter = 0;
  time = 0;
  stars[0].style.visibility = "visible";
  stars[1].style.visibility = "visible";
  stars[2].style.visibility = "visible";
  movesNumber.innerHTML = 0;
  let cardsMatch = document.querySelectorAll(".card");
  cardsMatch.forEach(function (card) {
    card.classList.remove("open","show","match")
  });
}

/*
* play again button on popup
*/

function playAgain () {
  modal.classList.remove("show");
  repeatGame();
}

/*
* restart icon
*/

const restart = document.querySelector(".restart i");
restart.addEventListener("click",repeatGame);

/*
* starting function
*/

const clickCard = function () {
activeCard = this; //card which clicked

let matchedCards = cards.filter(card => card.classList.contains("match"))
if (matchedCards.includes(activeCard)) {//second bug; blocked on the matched cards
  return;
}

if (activeCards.includes(activeCard)) {//first bug; blocked clicking on the same card in the same round (it will make match)
return;
}

activeCard.classList.add("open","show"); //when click -> open and show
starCounter();
timer();

    //first click
    if (activeCards.length === 0) {
      console.log('pierwsze kliknięcie',cards);
        activeCards[0] = activeCard; //add first card to array
        return;
      }


    //second click
    else {
      console.log('drugie kliknięcie',cards);
        cards.forEach(function (card) {
            activeCards[1] = activeCard; //add second card to array

            card.removeEventListener("click", clickCard) //after second click block future click

                setTimeout(function () { //show and open cards for 1 second
                    openCards = activeCards.length;
                        if(openCards === 2){
                            //match cards
                            if (activeCards[0].innerHTML === activeCards[1].innerHTML) {
                                activeCards.forEach(function (card) {
                                    card.classList.add("match")
                                    //cards = cards.filter(card => !card.classList.contains("match")) //second bug; block cliking on the open cards again
                                })
                                    //end game
                                    gameResult = gameResult + 1 //adding new pair to Array
                                    if (gameResult == 8) {
                                        congratulation();
                                    }
                            }
                            //unmatch cards
                            else {
                                activeCards.forEach(function (active_card) {
                                    active_card.classList.add("unmatch");
                                    active_card.classList.remove("open","show");
                                    active_card.classList.remove("unmatch");
                                })
                            }
                        }
                    //after two clicks reset
                    activeCard = ""; //active card is empty
                    activeCards.length = 0; //lenght of array is empty
                    cards.forEach(function (card) {
                    card.addEventListener("click", clickCard)//add Event Listener again to can click
                    });
                }, 1000)
        });
    }
};

cards.forEach(function(card) { //set up event listener for each card and function clikCard
  card.addEventListener("click",clickCard);
});
