import { FaHome } from "react-icons/fa";
import { PiSquaresFourFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

import {useState} from 'react';
import './App.css';

let tiles = [];
let tilesColors = {};

let color = 'rgb(255,0,0)';

//Tile representing one pixel on the board
function Tile({size, text}){

  const [currentColor, setBgColor] = useState('rgb(' + Math.floor(Math.random()*(255 + 1)) + ', ' + Math.floor(Math.random()*(255 + 1)) + ', ' + Math.floor(Math.random()*(255 + 1)) + ')');
  const changeColor = () => {
    setBgColor(color);
    tilesColors[text - 1] = color;
  }

  return(
    <div onClick={changeColor} style={{width: size, height: size, backgroundColor: currentColor, float: 'left'}}>{text}</div>
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

//Directs to board designer, or if ID is assigned, then shows thumbnail and directs to settings of that board
function Board({id, inner}){
  if(id)
    return (
      <div style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#F5E7D9', borderRadius: '3vh', float: 'left', margin: '0 2.5vh 0 2.5vh', overflow: "hidden"}}>
        {/* Thumbnail of the board*/}
        {inner}
      </div>
    )
  else
    return (
      <div style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#F5E7D9', borderRadius: '3vh', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'left', margin: '0 2.5vh 0 2.5vh'}}>
        <FaPlus size={'10vh'} color="#DBCFC2"/>
      </div>
    )
}

//Navbar destinations
function Home(){
  const boardThumbnailSize = window.innerHeight / 100 * 15;
  
  tiles = [];
  let tileNum = 225;
  let tileSize = boardThumbnailSize / 15;


  for(let row = 0; row < Math.sqrt(tileNum); row++){
    for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
      tiles.push(<Tile size={tileSize}/>)
    }
  }

  return (
    <div>
      <h1>Home</h1>
      <div>
        <Board id='2' inner={tiles}/>
        <h2>Random shit</h2>
        <h3>Set since 11.09.2001</h3>
        <button style={{width: '20vh', height: '5vh', border: 'none', borderRadius: '1.5vh', backgroundColor: '#e99f66', color: '#FFF6E8'}}>Change board</button>
      
      
      </div>
    </div>
  );
}

function Boards(){
  return (
    <div>
      <h1>Your boards</h1>
      <div id='slider' style={{height: '15vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '6vh', overflowX: 'scroll'}}> 
        <Board/>
        <Board/>
      </div>
    </div>
  );
}

function Settings(){
  return(
    <div>
      <h1>Settings</h1>
      <div style={{display: 'flex', flexDirection: 'column', height: '47vh', marginTop: '-8vh', alignItems: 'center', justifyContent: 'center'}}>
        <h2 style={{color: '#c9bfb5', fontSize: '2.5vh', width: '75vw'}}>Connect to the board to access settings</h2>
        <button style={{width: '20vh', height: '5vh', border: 'none', borderRadius: '1.5vh', backgroundColor: '#e99f66', color: '#FFF6E8', fontWeight: 'bold', fontSize: '2vh'}}>Connect</button>
      </div>
    </div>
  );
}

//Toggles transitions between navbar destinations
function swapClasses(firstClass){
  document.getElementById('mainBottomPanel').className = '';
  document.getElementById('mainBottomPanel').classList.add(firstClass);
}

//Manages bottom panel
function BottomPanelContent({screen}){
  if(screen === "home")
    return (<Home/>);
  else if(screen === "boards")
    return (<Boards/>);
  else if(screen === "settings")
    return (<Settings/>);
  else
    return (<h1>Error: Screen not found</h1>);
}

function BottomPanel(){
  const [currentScreen, setCurrentScreen] = useState("home"); // Initial screen is "boards"

  const swapScreens = (screen) => {
    setCurrentScreen(screen); // Update currentScreen state based on the clicked icon
  };

  return (
    <div id="mainBottomPanel" className="homeOn">
      <BottomPanelContent screen={currentScreen}/>
        <div style={{width: '100vw', height: '7.5vh', display: "flex", justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '2.5vh', backgroundColor: '#BD7F4D'}}>
            {/*<Button width='30vh' height='6vh' backgroundColor='#BD7F4D' color='#451800' text='Add new matrix'/>*/}
            <FaHome onClick={() => {swapClasses('homeOn'); swapScreens('home')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
            <PiSquaresFourFill onClick={() => {swapClasses('boardsOn'); swapScreens('boards')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
            <IoIosSettings onClick= {() => { swapClasses('settingsOn'); swapScreens('settings')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
        </div>
    </div>
  );
}


//Main screen
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
    <div style={{width: '100vw', height: '100vh', overflow: 'hidden'}}>
      <div className="mainTopPanel">
        <div style={{width: '100vw', height: '2.5vh', paddingTop: '2.5vh', paddingLeft: '2.5vw'}}>
          <h1 style={{margin: '1vh 0 0 2.5vw'}}>Hello There!</h1>
        </div>
        <BottomPanel/>
      </div>
    </div>
  );
}