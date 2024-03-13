import { GiHamburgerMenu  } from "react-icons/gi";

import {useState, useRef} from 'react';
import './App.css';

let tiles = [];
let tilesColors = {};

let color = 'rgb(255,0,0)';

function Tile({size, text}){

  const [currentColor, setBgColor] = useState('rgb(255,0,0)');
  const changeColor = () => {
    setBgColor(color);
    tilesColors[text - 1] = color;
  }

  return(
    <div onClick={changeColor} style={{width: size, height: size, backgroundColor: currentColor, borderRadius: size / 10, float: 'left', border: (size / 25) + 'px solid rgb(128,0,0)', boxSizing: 'border-box'}}>{text}</div>
  );
}

function ColorPicker(){
  const [currentColor, setBgColor] = useState(color);
  const changeColor = () => {
    setBgColor('rgb(' + document.getElementById('red').value + ', ' + document.getElementById('green').value + ', ' + document.getElementById('blue').value + ')');
  }

  color = currentColor;
  
  return(
    <div>
      <input onChange={changeColor} type='range' min='0' max='255'  id='red' style={{accentColor: 'red'}}></input><br/>
      <input onChange={changeColor} type='range' min='0' max='255' id='green' style={{accentColor: 'green'}}></input><br/>
      <input onChange={changeColor} type='range' min='0' max='255'  id='blue' style={{accentColor: 'blue'}}></input>
      <div style={{width: '10vw', height: '10vw', backgroundColor: currentColor}}></div>
    </div>
  );
}

function Button({width, height, backgroundColor, color, text}){
  return (
    <button onClick={() => {console.log('clicked')}}style={{width: width, height: height, color: color, backgroundColor: backgroundColor, border: 'none', borderRadius: '1.5vh', fontSize: '2.25vh', fontWeight: 'bold'}}>{text}</button>
  );
}

export default function mainPage(){

  tiles = [];
  let tileNum = 121;
  let tileSize = window.innerWidth / tileNum * (Math.sqrt(tileNum) * (9/10));


  for(let row = 0; row < Math.sqrt(tileNum); row++){
    for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
      tiles.push(<Tile size={tileSize} text={1 + row * Math.sqrt(tileNum) + tile}/>)
    }
  }

  return(
    /*<div style={{width: tileSize * Math.sqrt(tileNum), margin: '0 auto'}}>
      <div>{tiles}</div>
      <ColorPicker/>
      <button onClick={() => sendMatrix()}>Send</button>
    </div>*/
    <div style={{width: '100vw', height: '100vh', backgroundColor: '#F8B47F', overflow: 'hidden'}}>
      <div className="mainTopPanel">
        <div style={{width: '100vw', height: '2.5vh', paddingTop: '2.5vh', paddingLeft: '2.5vw'}}>
         <GiHamburgerMenu size={'3vh'}/>
        </div>
        <h1 style={{margin: '1vh 0 0 2.5vw'}}>Hello There!</h1>
      </div>
      <div className="mainBottomPanel" style={{display: 'block'}}>
        <div style={{width: '100vw', display: "flex", justifyContent: 'center', position: 'absolute', bottom: '5vh'}}>
          <Button width='30vh' height='6vh' backgroundColor='#BD7F4D' color='#451800' text='Add new matrix'/>
        </div>
      </div>
    </div>
  );
}