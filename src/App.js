import {useState} from 'react';
import './App.css';


function Tile({size}){

  let firstColor = 'rgb(255,0,0)';
  let secondaryColor = 'rgb(255,255,0)';

  const [currentColor, setBgColor] = useState('rgb(255,0,0)');
  const changeColor = () => {
    setBgColor(currentColor === firstColor ? secondaryColor : firstColor);
  }

  return(
    <div onClick={changeColor} style={{width: size, height: size, backgroundColor: currentColor, borderRadius: size / 10, float: 'left', border: (size / 25) + 'px solid rgb(128,0,0)', boxSizing: 'border-box'}}></div>
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
      tiles.push(<Tile size={tileSize}/>)
    }
  }

  return(
    <div style={{width: tileSize * Math.sqrt(tileNum), margin: '0 auto'}}>
      {tiles}
    </div>
  );
}