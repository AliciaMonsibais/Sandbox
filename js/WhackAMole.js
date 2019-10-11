// Whack a Mole Game

// This code is based on code found at
// https://javascript30.com

class WhackAMole {

    constructor(startButton, moles, scoreOut, gameTimeLength, peepTimeMin, peepTimeMax){
        this.btnStart = startButton;
        this.moles = moles;
        this.scoreOut = scoreOut;

        this.moleImgSrc = 'https://res.michaelwhyte.ca/mole.png';
        this.moleBonkedImg = new Image();
        this.moleBonkedImg.src = 'https://res.michaelwhyte.ca/mole-whacked.png';

        this.gameTime = gameTimeLength;
        this.minPeepTime = peepTimeMin;
        this.maxPeepTime = peepTimeMax;
        this.numOfMoles = this.moles.length;

        this.prevMoleNumber = null;
        this.timeUp = false;
        this.score = 0;
        this.gameTimer = null;
        this.peepTimer = null;
    }

    init(){
        this.score = 0;
        this.scoreOut.text(this.score);
        this.timeUp = false;
        this.prevMoleNumber = null;
        this.btnStart.text('Stop Game');
        this.peep();
        this.gameTimer = setTimeout(() => {
            console.log('Game Over...');
            this.btnStart.text('Start Game');
            this.timeUp = true;
        }, this.gameTime);
    }

    stop(){
        console.log('Game Stopped...');
        this.btnStart.text('Start Game');
        this.timeUp = true;
        this.moles.removeClass('up');
        clearInterval(this.peepTimer);
        clearInterval(this.gameTimer);
    }

    peep(){
        const time = this._randomTime(this.minPeepTime, this.maxPeepTime);
        const mole = this._randomMole(this.moles);
        mole.addClass('up');
        this.peepTimer = setTimeout(() => {
            mole.removeClass('up');
            if(this.timeUp === false){
                this.peep();
            }
        }, time);
    }

    bonk(mole) {
        mole.attr('src', this.moleBonkedImg.src)
            .removeClass('up')
            .addClass('bonked')
            .one('transitionend', () => {
                mole.attr('src', this.moleImgSrc);
                mole.removeClass('bonked');
            });
        this.score++;
        this.scoreOut.text(this.score);
    }

    _randomTime(min, max){
        return Math.round(Math.random() * (max - min) + min);
    }

    _randomMole(moles) {
        const idx = Math.floor(Math.random() * this.numOfMoles);
        const mole = moles.eq(idx);
        if(idx === this.prevMoleNumber ) {
            console.log('...same mole...try again...');
            return this._randomMole(moles);
        }
        this.prevMoleNumber = idx;
        return mole;
    }

}

const wam = new WhackAMole($('#btn-start'), $('.mole-pic'), $('#score-out'), 12000, 1000, 2000);

wam.btnStart.click(function(){

    if(wam.btnStart.text() === 'Start Game'){
        wam.init();
    }else{
        wam.stop();
    }

});

wam.moles.click(function(){

    if($(this).hasClass('bonked')){
        return;
    }

    wam.bonk( $(this) );

});