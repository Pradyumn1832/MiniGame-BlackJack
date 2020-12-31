//BlackJack
let activePlayer;
let blackjackGame = {
    'You': {'scorespan' :'#your-score' , 'div':'#your-pick','score':0},
    'Dealer':{'scorespan':'#dealer-score', 'div':'#dealer-pick','score':0},
    'Cards':['2','3','4','5','6','7','8','9','10','A','Q','K','J'],
    'CardMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'A':[1,11],'Q':10,'K':10,'J':10},
    'turnover':false,
    'isstand':false,
    'win':0,
    'loss':0,
    'tied':0,
};
const hitsound = new Audio('static/sounds/swish.m4a');
const winsound = new Audio('static/sounds/cash.mp3');
const lostsound = new Audio('static/sounds/aww.mp3');

document.querySelector('#hit-button').addEventListener('click',blackjackHit);
document.querySelector('#stand-button').addEventListener('click',blackjackStand);
document.querySelector('#deal-button').addEventListener('click',blackjackDeal);

function randomCard(){
    rand=Math.floor(Math.random()*13);
    return blackjackGame['Cards'][rand];
}
function blackjackHit(){  
  if(blackjackGame['isstand']===false){ 
    let r=randomCard();
    showCard(r,blackjackGame.You);
    updateScore(r,blackjackGame.You);
    showScore(blackjackGame.You);  
  }
}
function showCard(random,activePlayer){
    
    if (activePlayer['score'] <= 21){
      let image=document.createElement('img');
      image.src=`static/images/${random}.png`;
      document.querySelector(activePlayer['div']).appendChild(image);
      hitsound.play();
      console.log(random);
    }
}
function sleep(ms){
    return new Promise(resolve =>setTimeout(resolve,ms));
}
async function blackjackStand(){
    if (blackjackGame['turnover']===false){
      while (blackjackGame.Dealer['score'] <= 16){  
        blackjackGame['isstand']=true;
        let r=randomCard();
        showCard(r,blackjackGame.Dealer);
        updateScore(r,blackjackGame.Dealer);
        showScore(blackjackGame.Dealer);
        await sleep(1000)
      }  
      let result=computeWinner();
      showResult(result);
      blackjackGame['turnover']=true;
    }  
}
function updateScore(card,activePlayer){
    if (card==='A'){
        if(activePlayer['score'] + blackjackGame['CardMap'][card][1] <= 21){
                activePlayer['score']+=blackjackGame['CardMap'][card][1];
        }
        else if(activePlayer['score'] + blackjackGame['CardMap'][card][1] > 21){
                activePlayer['score']+=blackjackGame['CardMap'][card][0];
        }
    }
    else{ 
        activePlayer['score']=activePlayer['score']+blackjackGame['CardMap'][card];
    }
}
function showScore(activePlayer){
    if (activePlayer['score'] > 21){
        document.querySelector(activePlayer["scorespan"]).textContent = "BUST!!";
        document.querySelector(activePlayer["scorespan"]).style.color = "red";
    }
    else {
        document.querySelector(activePlayer["scorespan"]).textContent = activePlayer['score'];
    }
}
function blackjackDeal(){
  if (blackjackGame['turnover']===true){  
    let allImage=document.querySelector('#your-pick').querySelectorAll('img');
    for (let i=0 ; i<allImage.length ; i++){
        allImage[i].remove();
    }
    let allImage2=document.querySelector('#dealer-pick').querySelectorAll('img');
    for (let i=0 ; i<allImage2.length ; i++){
        allImage2[i].remove();
    }
    blackjackGame.You['score']=0;
    blackjackGame.Dealer['score']=0;
    document.querySelector(blackjackGame.You['scorespan']).textContent=0;
    document.querySelector(blackjackGame.You['scorespan']).style.color='white';
    document.querySelector(blackjackGame.Dealer['scorespan']).textContent=0;
    document.querySelector(blackjackGame.Dealer['scorespan']).style.color='white';  
    document.querySelector('#blackjackannounce').textContent = "Let's Play !";
    document.querySelector('#blackjackannounce').style.color = "black"; 
    blackjackGame['isstand']=false;
    blackjackGame['turnover']=false;
  }
}
function computeWinner(){
    if (blackjackGame.You['score'] <= 21){
        if (blackjackGame.You['score'] >= blackjackGame.Dealer['score']){
            winner='you';
        }
        else if (blackjackGame.You['score'] <= blackjackGame.Dealer['score'] && blackjackGame.Dealer['score']<=21){
            winner='dealer';
        }
        else if (blackjackGame.Dealer['score'] > 21){
            winner='you';
        }
        else if (blackjackGame.You['score'] === blackjackGame.Dealer['score']){
            winner='none';
        }
    }
    else if (blackjackGame.You['score'] > 21 && blackjackGame.Dealer['score'] <=21){
        winner = 'dealer';
    }    
    else if (blackjackGame.You['score'] >21 && blackjackGame.Dealer['score'] > 21){
        winner = 'none';
    }
    return winner;
}
function showResult(winner){
    if (winner==='you'){
        message = 'You Win !';
        messagecolor='green';
        winsound.play();
        blackjackGame['win']+=1;
        table();
    }
    else if (winner ==='dealer'){
        message = 'You Lose !';
        messagecolor='red';
        lostsound.play();
        blackjackGame['loss']+=1;
        table();
    }
    else if (winner === 'none'){
        message='You Tied !';
        messagecolor='yellow';
        blackjackGame['tied']+=1;
        table();
    }
    document.querySelector('#blackjackannounce').textContent = message;
    document.querySelector('#blackjackannounce').style.color = messagecolor;
}
function table(){
    document.querySelector('#wins-score').textContent = blackjackGame['win'];
    document.querySelector('#losses-score').textContent = blackjackGame['loss'];
    document.querySelector('#draws-score').textContent = blackjackGame['tied'];    
}