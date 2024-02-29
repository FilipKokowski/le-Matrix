import {useState} from 'react';
import './App.css';

let color = 'rgb(255,0,0)';

function Tile({size, text}){


  const [currentColor, setBgColor] = useState('rgb(255,0,0)');
  const changeColor = () => {
    setBgColor(color);
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

  color = currentColor
  
  return(
    <div>
      <input onChange={changeColor} type='range' min='0' max='255' defaultValue='128' id='red' style={{accentColor: 'red'}}></input><br/>
      <input onChange={changeColor} type='range' min='0' max='255' defaultValue='128' id='green' style={{accentColor: 'green'}}></input><br/>
      <input onChange={changeColor} type='range' min='0' max='255' defaultValue='128' id='blue' style={{accentColor: 'blue'}}></input>
      <div style={{width: '10vw', height: '10vw', backgroundColor: currentColor}}></div>
    </div>
  );
}

export default function mainPage(){

  console.log(window.innerWidth);

  let tiles = [];
  let tileNum = 121;

  let tileSize = window.innerWidth / tileNum * (Math.sqrt(tileNum) * (9/10));
  
  console.log(2 * tileSize);


  console.log((window.innerWidth - 2 * tileSize) / 5);


  for(let row = 0; row < Math.sqrt(tileNum); row++){
    for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
      tiles.push(<Tile size={tileSize} text={1 + row * Math.sqrt(tileNum) + tile}/>)
    }
  }

  return(
    <div style={{width: tileSize * Math.sqrt(tileNum), margin: '0 auto'}}>
      {tiles}
      <ColorPicker/>
    </div>
  );
}