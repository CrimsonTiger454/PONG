import React, { Component } from 'react';

import GameCanvas from './components/GameCanvas';
import GameControls from './components/GameControls';

class GameInterface extends Component {
    constructor() {
        super();
        this.state = {
            gameActive: false,
            maxScore: '',
            initVel: '',
            ballColor: ''
        }
        this.toggleGameActive = this.toggleGameActive.bind(this);
        this.setMaxScore = this.setMaxScore.bind(this);
        this.setInitVel = this.setInitVel.bind(this);
        this.setBallColor = this.setBallColor.bind(this);
    }

    toggleGameActive () {
        this.setState({gameActive: !this.state.gameActive});
        console.log(this.state.gameActive)
      }
      

      setMaxScore (event) {
        this.setState({maxScore: event.target.value});
        console.log(this.state.maxScore)
      }

      setInitVel(event) {
        if(event.target.value <=3 && event.target.value >= 1) {
        this.setState({initVel: event.target.value});
        console.log('game interface initvel value', this.state.initVel)
        } else {
            alert('velocity must be either 1, 2, or 3')
        }
      }

      setBallColor(event) {
        this.setState({ballColor: event.target.id});
        console.log('selected color: ', this.state.ballColor)
      }
    

    render() {
        return (
            <main style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {this.state.gameActive? <GameCanvas toggleGameActive={this.toggleGameActive} maxScore={this.state.maxScore} initVel={this.state.initVel} ballColor={this.state.ballColor}/> : <GameControls toggleGameActive={this.toggleGameActive} setMaxScore={this.setMaxScore} maxScore={this.state.maxScore} setInitVel={this.setInitVel} initVel={this.initVel} setBallColor={this.setBallColor}/>}

                </section>
            </main>
        )
    }
}

export default GameInterface;   