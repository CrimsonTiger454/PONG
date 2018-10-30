import React from 'react';

const GameControls = props => {

    
   

    return (
        <article>
            <h1>Select Velocity and winning score</h1>
            <input type='text' onChange={(event) => {props.setMaxScore(event)}} value={props.maxScore} placeholder="max score"></input>
            <br/>
            <input type='text' onChange={(event) => {props.setInitVel(event)}} value={props.initVel} placeholder="velocity"></input>
            <br/>

            <section className='ballcolorselect'>
            <h1>Select Ball Color</h1>
            <div id="greenyellow" onClick={(event) => {props.setBallColor(event)}}></div>
            <div id="red" onClick={(event) => {props.setBallColor(event)}}></div>
            <div id="aqua" onClick={(event) => {props.setBallColor(event)}}></div>
            <div id="orange" onClick={(event) => {props.setBallColor(event)}}></div>
            </section>

            <section className='paddlecolorselect'>
            <h1>Select Paddle Color</h1>
            <div id="darkorchid" onClick={(event) => {props.paddleColor(event)}}></div>
            <div id="darkorange" onClick={(event) => {props.paddleColor(event)}}></div>
            <div id="darkred" onClick={(event) => {props.paddleColor(event)}}></div>
            <div id="darkslateblue" onClick={(event) => {props.paddleColor(event)}}></div>
            </section>
            <br/>
            <button onClick={() => {props.toggleGameActive()}}>Start Game</button>
        </article>
    )
}

export default GameControls;