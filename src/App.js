//Icons
import { FaHome} from "react-icons/fa";
import { PiSquaresFourFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import {  IoSend} from "react-icons/io5";

import './App.css';

//Functions
import {useState, React, useRef, useEffect, createRef} from 'react';
import { getCode } from "./dbFunctions";

//Components
import { Settings } from "./Settings";
import { Boards, colorPickerColor, mode } from "./Boards";
import { Home } from "./Home";

export let id = 0;
let tiles = [];
let tilesColors = [];

let color = '#f6b73c';

let connected = false;

export function setID(ID){ id = ID; }

export function getConnected() {return connected; }
export function setConnected(con) {connected = con; }

export function getTiles() {return tiles;}
export function setTiles(t) {tiles = t;}

export function getTilesColors() {return tilesColors;}
export function setTilesColors(tc) {tilesColors = tc;}

export function getColor() {return color;}
export function setColor(c) {color = c;}

export function TileHandler(prop){
  const [val, set] = useState(false);

  const update = () => {
    set(!val);
  };

  return <div onClick={() => {if(mode === 'clear') {color = 'black'; update();} else if(mode === 'bucket') update(); else if(mode === 'eraser') color = 'black';}}>{prop.tiles}</div>;
}

//Tile representing one pixel on the board
export function Tile(prop){

  //let c = 'rgb(' + Math.floor(Math.random()*(255 + 1)) + ', ' + Math.floor(Math.random()*(255 + 1)) + ', ' + Math.floor(Math.random()*(255 + 1)) + ')'; tilesColors[text - 1] = c; return c;

  const [currentColor, setBgColor] = useState(() => {tilesColors[prop.text - 1] = prop.c; return prop.c;});
  const changeColor = () => {
    if(mode !== 'colorPicker'){
      setBgColor(color);
      tilesColors[prop.text - 1] = color;
    }
    else
      prop.setColorPicker(currentColor);
    
  }

  const divRef = createRef();

  const isTouchOver = (event) => {
    const touch = event.touches[0] // Get the first touch point
    const rect = divRef.current.getBoundingClientRect(); // Get the div's position and size

    console.log(touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom)

    return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    );
  }

  return(
    <div ref={divRef} onTouchMoveCapture={(e) => {isTouchOver(e) && changeColor()}} style={{width: prop.size, height: prop.size, minWidth: prop.size, minHeight: prop.size, backgroundColor: currentColor, float: 'left'}}></div>
  );
}

export function NoConnection(prop){
  const codeConfirm = useRef();

  const [connecting, set] = useState(true);

  const swapScreens = (con = []) => { 
    if(con.length != 0){
      connected = (con[0]) ? true : false;
    
      window.localStorage.setItem('board', con[0]['code']);
      window.localStorage.getItem('board');
    }
    set(!connecting);
  };

  if(connecting)
    return(
      <div style={{height: '100%'}}>
        <h1 style={{fontSize: '8vw'}}>{prop.screen.charAt(0).toUpperCase() + prop.screen.slice(1)}</h1>
        <div style={{display: 'flex', flexDirection: 'column', height: '85%', marginTop: '-8vh', alignItems: 'center', justifyContent: 'center'}}>
          <h2 style={{fontSize: '5vw', width: '75vw'}}>Connect to the board to access {prop.screen}</h2>
          <button onClick={() => {swapScreens()}} style={{width: '50vw', height: '12vw', border: 'none', borderRadius: '2vh', backgroundColor: '#2f3236', color: '#cfc1c1', fontWeight: 'bold', fontSize: '4vw'}}>Connect</button>
        </div>
      </div>
    );
  else return (
    <div style={{height: '100%'}}>
      <h1 style={{fontSize: '8vw'}}>Connect</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%'}}>
        <h2 style={{fontSize: '6vw'}} >Input board code</h2>
        <div style={{width: '73vw', height: '14vw', backgroundColor: '#212529', borderRadius: '2vh', display: 'flex', alignItems: 'center'}}>
          <input type='text' id='code' onKeyDown={(e) => {if(e.key === 'Enter') codeConfirm.current.click()}} maxLength="4" style={{border: 'none', width: '60vw', height: '14vw', borderRadius: '2vh', backgroundColor: 'transparent', fontSize: '3vh'}}></input>
          <button id="codeConfirm" ref={codeConfirm} onClick={async () => {swapScreens(await getCode(document.getElementById('code').value)); prop.update()}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '1.5vh', backgroundColor: '#2f3236', color: '#c9bfb5', fontWeight: 'bold', fontSize: '4vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IoSend size={'75%'}/></button>
        </div>
      </div>
    </div>
  );
}

//Toggles transitions between navbar destinations
export function swapClasses(firstClass){
  document.getElementById('mainBottomPanel').className = firstClass;
}

//Manages bottom panel
function BottomPanelContent(prop){
  if(prop.screen === "home")
    return (<Home swap={prop.swap}/>);
  else if(prop.screen === "boards")
    return (<Boards swap={prop.swap}/>);
  else if(prop.screen === "settings")
    return (<Settings/>);
}

export function toggleNotification(text = 'default', color = '#2a2e32', duration = 1500){
  if(document.getElementById('notification').className === 'notOn')
    document.getElementById('notification').className = 'notOff';
  else{
    document.getElementById('notification').className = 'notOn';

    setTimeout(function() {
      document.getElementById('notification').className = 'notOff';
    }, duration);

  }
  
  document.getElementById('notification').style.backgroundColor = color;
  document.getElementById('notification').innerHTML = '<h2>' + text + '</h2>'
}

function BottomPanel(){
  const [currentScreen, setCurrentScreen] = useState("home"); // Initial screen is "home"

  const swapScreens = (screen) => {
    setCurrentScreen(screen); // Update currentScreen state based on the clicked icon
  };
  
  return (
    <div id="mainBottomPanel" className={currentScreen + 'On'}>
      <BottomPanelContent screen={currentScreen} swap={swapScreens}/>
        <div style={{width: '100vw', height: '7.5vh', display: "flex", justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '2.5vh', backgroundColor: '#212529'}}>
            <FaHome onClick={() => {if(currentScreen != 'home') swapScreens('home')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
            <PiSquaresFourFill id='boards' onClick={() => {if(currentScreen != 'boards') swapScreens('boards')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
            <IoIosSettings onClick= {() => {if(currentScreen != 'settings') swapScreens('settings')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
        </div>
    </div>
  );
}

//Main screen
export default function MainPage(){
  if(window.localStorage.getItem('board'))
    connected = true;

  if('virtualKeyboard' in navigator)
    navigator.virtualKeyboard.overlaysConent = true;

  if(/android|iphone|kindle|ipad/i.test(navigator.userAgent)){
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
        <div id='notification' className="notOff" style={{position: 'absolute', top: '22.5vw', right: '10vw', display:'flex', justifyContent: 'center', alignItems: 'center', width: '80vw', height: '15vw', backgroundColor: '#2a2e32', borderRadius: '4vw'}}></div>
      </div>
    )
  }
  else
    return(
      <div style={{width: '100vw', height: '100vh', backgroundColor: '#212529', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h1>Page only avaiable on mobile devices</h1>
      </div>
    );
}