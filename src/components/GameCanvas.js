import React, { Component } from "react";
import axios from "axios";

class GameCanvas extends Component {
  constructor() {
    super();
    this.deadBalls =  []; // I belive that this is the source of the memory leak, 
    //because the original code was never reseting or clearing this array, it would just grow bigger and sap more and more memrory.
    // clearing this array after every game should fix the issue.
    this.maxScore = null;
    this.initVelocity = null;
    this.ballData = {};
    this.paddle1Data = {};
    this.paddle2Data = {};
  }



  componentDidMount = () => {
    this._initializeGameCanvas();
    this.setState({maxScore: this.maxScore += this.props.maxScore *1})
    this.setState({initVelocity: this.initVelocity += this.props.initVel *1})
    console.log('score', this.maxScore,
    'initvel', this.initVelocity)
  };


  resetGame () {
    this.deadBalls = []; //clearing the deadballs array after each game should clear up memory leak.
    this.maxScore = null;
    this.initVelocity = null;
    this.p1Score = 0;
    this.p2Score = 0;
    window.location.reload(); /*I added this as a quick solution to my timeout, which I couldn't get to stop running after a game ended.
    Which negates the reset values and deadball clear. I just wasn't sure how to get the set timeout loop to end */
  }

  ballDataChange (ballObj) {
    if(ballObj.velocityX) {
      this.gameBall.velocityX = ballObj.velocityX;
    }

    if(ballObj.velocityY) {
      this.gameBall.velocityY = ballObj.velocityY;
    }

    if(ballObj.height) {
      this.gameBall.height = ballObj.height;
    }

    if(ballObj.width) {
      this.gameBall.width = ballObj.width;
    }

    if(ballObj.color) {
      this.gameBall.color  = `#${ballObj.color.hex}`;

    }
  }

  p1DataChange (p1Obj) {
    if(p1Obj.velocityX) {
      this.player1.velocityX = p1Obj.velocityX;
    }

    if(p1Obj.velocityY) {
      this.player1.velocityY = p1Obj.velocityY;
    }

    if(p1Obj.height) {
      this.player1.height = p1Obj.height;
    }

    if(p1Obj.width) {
      this.player1.width = p1Obj.width;
    }

    if(p1Obj.color) {
      this.player1.color  = `#${p1Obj.color.hex}`;
    }
  }

  p2DataChange(p2Obj) {
    if(p2Obj.velocityX) {
      this.player2.velocityX = p2Obj.velocityX;
    }

    if(p2Obj.velocityY) {
      this.player2.velocityY = p2Obj.velocityY;
    }

    if(p2Obj.height) {
      this.player2.height = p2Obj.height;
    }

    if(p2Obj.width) {
      this.player2.width = p2Obj.width;
    }

    if(p2Obj.color) {
      this.player2.color  = `#${p2Obj.color.hex}`;

    }
  }

  //recursion weeeeee
  getGameData () {
    axios.get('https://wwwforms.suralink.com/pong.php?accessToken=pingPONG').then((res) => {
      let {newDelay} = res.data.gameData;
      let {gameData} = res.data;
      console.log(newDelay)

      if(this.props.gameActive === true ) {
        setTimeout(() => {
          this.getGameData();
          console.log('timeout fired', gameData)
          let {ball, paddle1, paddle2} = gameData;

          //ball data check
          if(ball.length === 0) {
            console.log('ball will not change')
          } else {
            console.log('ball will change', ball);
              this.ballDataChange(ball);
          }

          //paddle1 data check
          if(paddle1.length === 0) {
            console.log('paddle1 will not change')
          } else {
            console.log('paddle1 will change', paddle1);
            this.p1DataChange(paddle1);
          }

          //paddle2 data check
          if(paddle2.length === 0) {
            console.log('paddle2 will not change')
          } else {
            console.log('paddle2 will change', paddle2)
            this.p2DataChange(paddle2);
          }

        }, newDelay? newDelay : null);

      } else {
        return null;
      }
       
    });
  }

  _initializeGameCanvas = () => {
    // initialize canvas element and bind it to our React class
    this.canvas = this.refs.pong_canvas;
    this.ctx = this.canvas.getContext("2d");

    // declare initial variables
    this.p1Score = 0;
    this.p2Score = 0;
    this.keys = {};

    // server request for game data
    this.getGameData();
    

    // add keyboard input listeners to handle user interactions
    window.addEventListener("keydown", e => {
      this.keys[e.keyCode] = 1;
      if (e.target.nodeName !== "INPUT") e.preventDefault();
    });
    window.addEventListener("keyup", e => delete this.keys[e.keyCode]);

    // instantiate our game elements
    this.player1 = new this.GameClasses.Box({
      x: 10,
      y: 200,
      width: 15,
      height: 80,
      color: `${this.props.paddleColor}`,
      velocityY: 3
    });
    this.player2 = new this.GameClasses.Box({
      x: 725,
      y: 200,
      width: 15,
      height: 80,
      color: `${this.props.paddleColor}`,
      velocityY: 3
    });
    this.boardDivider = new this.GameClasses.Box({
      x: this.canvas.width / 2 - 2.5,
      y: -1,
      width: 5,
      height: this.canvas.height + 1,
      color: "#FFF"
    });
    this.gameBall = new this.GameClasses.Box({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: 15,
      height: 15,
      color: `${this.props.ballColor}`,
      velocityX: this.initVelocity,
      velocityY: this.initVelocity
    });

    // start render loop
    this._renderLoop();
  };

  // recursively process game state and redraw canvas
  _renderLoop = () => {
    this._ballCollisionY();
    this._userInput(this.player1);
    this._userInput(this.player2);
    this.frameId = window.requestAnimationFrame(this._renderLoop);
  };

  // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  _ballCollisionY = () => {
    if (
      this.gameBall.y + this.gameBall.velocityY <= 0 ||
      this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
        this.canvas.height
    ) {
      this.gameBall.velocityY = this.gameBall.velocityY * -1;
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._ballCollisionX();
  };

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  _ballCollisionX = () => {
    if (
      (this.gameBall.x + this.gameBall.velocityX <=
        this.player1.x + this.player1.width &&
        this.gameBall.y + this.gameBall.velocityY > this.player1.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player1.y + this.player1.height) ||
      (this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >=
        this.player2.x &&
        this.gameBall.y + this.gameBall.velocityY > this.player2.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player2.y + this.player2.height)
    ) {
      this.gameBall.velocityX = this.gameBall.velocityX * -1;
    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - 15
    ) {
      this.p2Score += 1;
      this.deadBalls.push(this.gameBall);
      this.gameBall = new this.GameClasses.Box({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 15,
        height: 15,
        color:  `${this.props.ballColor}`,
        velocityX: this.initVelocity,
        velocityY: this.initVelocity
      });
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1;
      this.deadBalls.push(this.gameBall);
      this.gameBall = new this.GameClasses.Box({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 15,
        height: 15,
        color: `${this.props.ballColor}`,
        velocityX: this.initVelocity-1 ,
        velocityY: this.initVelocity
      });
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._drawRender();
  };

  // clear canvas and redraw according to new game state
  _drawRender = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._displayScore1();
    this._displayScore2();
    this._drawBox(this.player1);
    this._drawBox(this.player2);
    this._drawBox(this.boardDivider);
    this._drawBox(this.gameBall);
  };

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color;
    this.ctx.fillRect(box.x, box.y, box.width, box.height);
  };

  // render player 1 score
  _displayScore1 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(
      this.p1Score,
      this.canvas.width / 2 - (this.p1Score > 9 ? 55 : 45),
      30
    );
    if(this.p1Score === this.maxScore) {
      alert('Player 1 WINS!');
      this.resetGame();
      this.props.toggleGameActive();
    }
  };

  // render player 2 score
  _displayScore2 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(this.p2Score, this.canvas.width / 2 + 33, 30);
    if(this.p2Score === this.maxScore) {
      alert('Player 2 WINS!');
      this.resetGame();
      this.props.toggleGameActive();
    }
  };

  //track user input
  _userInput = () => {
    if (87 in this.keys) {
      if (this.player1.y - this.player1.velocityY > 0)
        this.player1.y -= this.player1.velocityY;
    } else if (83 in this.keys) {
      if (
        this.player1.y + this.player1.height + this.player1.velocityY <
        this.canvas.height
      )
        this.player1.y += this.player1.velocityY;
    }

    if (38 in this.keys) {
      if (this.player2.y - this.player2.velocityY > 0)
        this.player2.y -= this.player2.velocityY;
    } else if (40 in this.keys) {
      if (
        this.player2.y + this.player2.height + this.player2.velocityY <
        this.canvas.height
      )
        this.player2.y += this.player2.velocityY;
    }
  };

  GameClasses = (() => {
    return {
      Box: function Box(opts) {
        let { x, y, width, height, color, velocityX, velocityY } = opts;
        this.x = x || 10;
        this.y = y || 10;
        this.width = width || 40;
        this.height = height || 50;
        this.color = color || "#FFF";
        this.velocityX = velocityX || 2;
        this.velocityY = velocityY || 2;
      }
    };
  })();

  render() {
    return (
      <div>
      <canvas
        id="pong_canvas"
        ref="pong_canvas"
        width="750"
        height="500"
        style={{ background: "#12260e", border: "4px solid #FFF" }}
      />
      <button onClick={() => {this.props.toggleGameActive(); this.resetGame();}}>END GAME</button>
      </div>
    );
  }
}

export default GameCanvas;
