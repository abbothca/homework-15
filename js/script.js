"use strict"
const MAX_COUNT_BALLS = 40;
const sours = document.getElementById("sours");

class Bubble {
    #link;
    #score;
    #timeOfCreate;

    #resetCurrentBubble() {
        this.#link.textContent = ""
        this.#link.classList.remove("clicked");
        this.#link.classList.add("element");
        return this;
    }

    constructor(className) {
        let newBubbleDOM = document.createElement("div");
        newBubbleDOM.classList.add("element", "circle");
        sours.append(newBubbleDOM);
        this.#link = newBubbleDOM;
        this.#score = 1;
        this.#timeOfCreate = new Date();
    }

    get link() {
        return this.#link;
    }

    get score() {
        return this.#score;
    }

    set score(value) {
        this.#score = value;
    }

    addClickListener(gameObject) {
        this.#link.addEventListener("click", (event) => {
            this.freeze(gameObject);
            gameObject.addClicked(this);
        })
    }

    resetThis() {
        this.#resetCurrentBubble();
        return this;
    }

    freeze(gameObject) {
        this.#link.textContent = `+${this.score}`;
        setTimeout(((gameObject) => {
            this.#link.classList.remove("element");
            this.#link.classList.add("clicked");
        }).bind(this, gameObject), 300);
        return this;
    }
}

class SpecialBubbles extends Bubble {
    constructor(className) {
        super(className);
    }

    showClick() {
        console.group("click");
        console.log("You clicked special bubble!");
        console.table(this);
        console.groupEnd();
    }
}

class BadBubble extends SpecialBubbles {
    #color = "#c05353";
    #timeDelay;
    lastNulledScore;

    #createNewBadBubble() {
        return new BadBubble("circle");
    }

    constructor(className) {
        super(className);
        this.score = 0;
        this.#timeDelay = +(Math.random() * 1000).toFixed(0);
        this.lastNulledScore = undefined;
    }

    set color(color) {
        this.#color = color;
    }


    addClickListener(gameObject) {        
        this.link.addEventListener("click", (event) => {
            this.showClick();
            this.color();
            this.resetAll(gameObject);
            let newBadOne = this.#createNewBadBubble();
            newBadOne.addClickListener(gameObject);
            this.lastNulledScore = gameObject.currentScore;
            gameObject.currentScore = 0;
            gameObject.balls.push(newBadOne);
            gameObject.clearClicked();
        })
    }

    resetAll(gameObject) {
        gameObject.balls.forEach((element) => {
            element.resetThis();
        });

    }

    color() {
        document.body.style.backgroundColor = this.#color;
        setTimeout(() => {
            document.body.style = "";
        }, this.#timeDelay)
    }
}

class GoodBubble extends SpecialBubbles {
    color;
    #timeDelay = 500;
    #specialScore;

    #createNewBubble() {
        let newBubble = new Bubble("circle");
        newBubble.score = this.#specialScore;
        return newBubble;
    }

    constructor(className) {
        super(className);
        this.score = 0;
        this.color = "green";
        this.#specialScore = 15;
    }

    changeColor() {
        this.link.style.backgroundColor = this.color;
        setTimeout(() => {
            this.link.style.backgroundColor = "";
        }, this.#timeDelay)
    }


    addClickListener(gameObject) {
        this.link.addEventListener("click", (event) => {
            this.showClick();
            const newOne = this.#createNewBubble();
            newOne.addClickListener(gameObject);
            gameObject.balls.push(newOne);
            this.changeColor();
            gameObject.checkState();
        })
    }
}

class Game {
    #maxBalls;
    balls;
    #currentScore;
    clicked;

    constructor(startAmountBalls) {
        this.balls = [];
        this.clicked = [];
        this.#currentScore = 0;
        this.#maxBalls = MAX_COUNT_BALLS;

        let goodBubbleNumber = +(startAmountBalls / 3).toFixed(0);
        let badBubbleNumber = goodBubbleNumber + 1;

        for (let i = 0; i < startAmountBalls; i++) {
            if (i === badBubbleNumber) {
                let badOne = new BadBubble("circle");
                this.balls.push(badOne);
                continue;
            };
            if (i === goodBubbleNumber) {
                let goodOne = new GoodBubble("circle");
                this.balls.push(goodOne);
                continue;
            };
            let one = new Bubble("circle");
            this.balls.push(one);
        }

        this.balls.forEach((element) => {
            element.addClickListener(this);
        })
    }

    get currentScore() {
        return this.#currentScore;
    }

    set currentScore(value) {
        this.#currentScore = value;
    }

    get maxBalls() {
        return this.#maxBalls;
    }

    get balls() {
        return this.balls;
    }

    clearClicked() {
        this.clicked = [];
        this.score = 0;
    }

    checkState() {
        if (this.currentScore > 50) {
            this.gameOver();
            alert(`You score more then 50! (${this.currentScore})`)
        }

        if (this.maxBalls <= this.balls.length) {
            this.gameOver();
            alert("Too much balls!!!")
        }
    }

    addClicked(element) {
        this.clicked.push(element);
        this.currentScore += element.score;
        this.checkState();
    }

    gameOver() {
        console.log("Game over!");
        Game.pauseAnimation();
        this.balls.forEach((element) => {
            if (this.clicked.includes(element)) {
                return;
            }

            element.link.classList.add("not-clicked");
        })
    }

    static pauseAnimation() {
        document.body.classList.add("disabled");
    }
}

let game = new Game(5);