import { FaHome, FaInstagram, FaMoon} from "react-icons/fa";
import { PiSquaresFourFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { FaPlus, FaPowerOff } from "react-icons/fa6";
import { MdDeleteSweep } from "react-icons/md";
import { IoLogInOutline } from "react-icons/io5";

import {useState, useEffect} from 'react';
import './App.css';

let tiles = [];
let tilesColors = {};

let color = 'rgb(255,0,0)';

let connected = true;
let togglePower = false;

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

function PowerButton(){
  const [currentMode, setMode] = useState(togglePower);
  const changeColor = () => { setMode(!currentMode); togglePower = currentMode; }
  
  return <div onClick={() => {changeColor()}} style={{width:'14vh', height: '14vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (currentMode) ? '#d15c4f' : '#82A67D', borderRadius: '2vh', marginRight: '2.5vh'}}><FaPowerOff size='50%' color={(currentMode) ? '#f0a49c' : '#aac2a7'}/></div>
}

//Directs to board designer, or if ID is assigned, then shows thumbnail and directs to settings of that board
function Board({id, inner}){
  if(id)
    return (
      <div style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#303336', borderRadius: '3vh', float: 'left', margin: '0 2.5vh 0 2.5vh', overflow: "hidden"}}>
        {/* Thumbnail of the board*/}
        {inner}
      </div>
    )
  else
    return (
      <div style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#303336', borderRadius: '3vh', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'left', margin: '0 2.5vh 0 2.5vh'}}>
        <FaPlus size={'10vh'} color="#494e52"/>
      </div>
    )
}

//Navbar destinations
function Home(){
  if(connected){
  const boardThumbnailSize = window.innerHeight / 100 * 15;
  
  tiles = [];
  let tileNum = 225;
  let tileSize = boardThumbnailSize / 15;


  for(let row = 0; row < Math.sqrt(tileNum); row++){
    for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
      tiles.push(<Tile key={1 + row * Math.sqrt(tileNum) + tile} size={tileSize}/>)
    }
  }

  return (
    <div>
      <h1>Home</h1>
      <div style={{width: '42.5vh', height: '17vh', backgroundColor: '#303336', margin: '0 auto', paddingRight: '1.25vh', paddingTop: '2vh', borderRadius: '2vh'}}>
        <Board id='2' inner={tiles}/>
        <h2 style={{marginTop: '0'}}>Random colors</h2>
        <h3>Set since 11.09.2001</h3>
        <button style={{width: '20vh', height: '5vh', border: 'none', borderRadius: '2vh', backgroundColor: '#212529', color: '#cfc1c1', fontWeight: 'bold', fontSize: '1.75vh'}}>Change board</button>
      </div>
      <div style={{width:'100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5vh'}}>
        <div>
          <div onClick={() => {window.location.href='https://www.instagram.com/direct/t/104475757669880/';}} style={{width:'14vh', height: '14vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderRadius: '2vh', marginRight: '1.5vh', marginBottom: '1.75vh'}}>
            <FaInstagram size='75%' color='white'/>
          </div>
          <PowerButton/>
        </div>
        <div style={{overflow: 'hidden', width:'27vh', height: '30vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5E7D9', borderRadius: '2vh'}}>
          <img style={{height: '30vh'}} src={require('./res/cat.png')}></img>
        </div>   
      </div>
    </div>
  );
  }
  else return <NoConnection screen='home'/>

}

function Boards(){
  if(connected)
    return (
      <div>
        <h1>Your boards</h1>
        <div id='slider' style={{height: '15vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '6vh', overflowX: 'scroll'}}> 
          <Board/>
          <Board/>
        </div>
      </div>
    );
  else return <NoConnection screen='boards'/>
}

function Settings(){
  if(connected)
    return(
      <div>
        <h1>Settings</h1>
        <div>
          <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
            <div style={{marginBottom:'1.5vh', marginRight: '2vh', width: '25.5vh', height: '22vh', backgroundColor: '#F5E7D9', borderRadius: '2vh', overflow: 'hidden'}}><img style={{width: '100%', height: '100%'}} src={require('./res/hampster.webp')}></img></div>
            <button style={{width: '14vh', height: '22vh', border: 'none', borderRadius: '2vh', backgroundColor: '#644c75', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><FaMoon size={'50%'} color="#8d70a1"/></button>
          </div>
          <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
            <button style={{width: '14vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e97366', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold', marginRight: '2vh'}}><MdDeleteSweep size={'50%'} color="#f0a49c"/></button>
            <button style={{width: '26vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e99f66', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><IoLogInOutline size={'50%'} color="#fcd4b6"/></button>
          </div>
        </div>
      </div>
    );
  else return <NoConnection screen='settings'/>
}

function Connect(){
  return(
    <div>
      <h1>Connect</h1>
    </div>
  );
}

function NoConnection({screen}){
  const [connectionScreen, set] = useState(false);

  const swapScreens = () => { set(!connectionScreen); connected = connectionScreen; console.log(connected)};

  return(
    <div style={{height: '100%'}}>
      <h1>{screen.charAt(0).toUpperCase() + screen.slice(1)}</h1>
      <div style={{display: 'flex', flexDirection: 'column', height: '85%', marginTop: '-8vh', alignItems: 'center', justifyContent: 'center'}}>
        <h2 style={{color: '#c9bfb5', fontSize: '2.5vh', width: '75vw'}}>Connect to the board to access {screen}</h2>
        <button onClick={() => {swapScreens()}} style={{width: '20vh', height: '5vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e99f66', color: '#FFF6E8', fontWeight: 'bold', fontSize: '2vh'}}>Connect</button>
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
  else if(screen === "connect")
    return <Connect/>
  else
    return (<h1>Error: Screen not found</h1>);
}

function BottomPanel(){
  const [currentScreen, setCurrentScreen] = useState("home"); // Initial screen is "boards"

  const swapScreens = (screen) => {
    setCurrentScreen(screen); // Update currentScreen state based on the clicked icon
  };

  return (
    <div id="mainBottomPanel" className={currentScreen + 'On'}>
      <BottomPanelContent screen={currentScreen}/>
        <div style={{width: '100vw', height: '7.5vh', display: "flex", justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '2.5vh', backgroundColor: '#212529'}}>
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