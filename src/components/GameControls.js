import React from 'react';

const GameControls = props => {
    console.log(props);

   

    return (
        <article>
            <h1>Select Velocity and winning score</h1>
            <input type='text' onChange={(event) => {props.setMaxScore(event)}} value={props.maxScore} placeholder="max score"></input>
            <br/>
            <input type='text' onChange={(event) => {props.setInitVel(event)}} value={props.initVel} placeholder="velocity"></input>
            <br/>
            <button onClick={() => {props.toggleGameActive()}}>Start Game</button>

            <section className='colorselect'>
            <h1>Select Ball Color</h1>
            <div id="greenyellow" onClick={(event) => {props.setBallColor(event)}}></div>
            <div id="red" onClick={(event) => {props.setBallColor(event)}}></div>
            <div id="aqua" onClick={(event) => {props.setBallColor(event)}}></div>
            <div id="orange" onClick={(event) => {props.setBallColor(event)}}></div>
            </section>
        </article>
    )
}

export default GameControls;