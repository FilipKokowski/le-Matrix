import { FaHome, FaInstagram, FaMoon} from "react-icons/fa";
import { PiSquaresFourFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { FaPlus, FaPowerOff } from "react-icons/fa6";
import { MdDeleteSweep } from "react-icons/md";
import { IoLogInOutline, IoSend} from "react-icons/io5";

import { createClient } from "@supabase/supabase-js";

import {useState, React, useRef} from 'react';
import './App.css';

const supabase = createClient("https://xujfzrydvpziizkztbjp.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amZ6cnlkdnB6aWl6a3p0YmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNDQwNTUsImV4cCI6MjAyNjcyMDA1NX0.ikspwER5xHsaSPIkO67P-XOzCPNjIaLMDa7o5dCa608");

let tiles = [];
let tilesColors = {};

let color = 'rgb(255,0,0)';

let connected = false;
let togglePower = false;

//Tile representing one pixel on the board
function Tile({size, text, editable}){

  const [currentColor, setBgColor] = useState('rgb(' + Math.floor(Math.random()*(255 + 1)) + ', ' + Math.floor(Math.random()*(255 + 1)) + ', ' + Math.floor(Math.random()*(255 + 1)) + ')');
  const changeColor = () => {
    setBgColor(color);
    tilesColors[text - 1] = color;
  }

  return(
    <div onClick={(editable) ? changeColor : () => {}} style={{width: size, height: size, backgroundColor: currentColor, float: 'left'}}>{text}</div>
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

  const [currentMode, setMode] = useState(localStorage.getItem('power'));

  const changeColor = () => { 
    setMode(!currentMode); 

    console.log(currentMode)
    window.localStorage.setItem('power', currentMode);
}
  
  return <div onClick={ async () => {changeColor(); await supabase.from('system').update({powerOn: currentMode}).eq('code', window.localStorage.getItem('board'))}} style={{width:'14vh', height: '14vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (currentMode) ? '#d15c4f' : '#82A67D', borderRadius: '2vh', marginRight: '2.5vh'}}><FaPowerOff size='50%' color={(currentMode) ? '#f0a49c' : '#aac2a7'}/></div>
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
  const [val, set] = useState(false);
  const update = () => {
    set(!val);
  };

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
  else return <NoConnection screen='home' update={update}/>

}

function Boards(){
  const [val, set] = useState(false);
  const update = () => {
    set(!val);
  };

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
  else return <NoConnection screen='boards' update={update}/>
}

function Settings(){

  const [val, set] = useState(false);
  const update = () => {
    set(!val);
  };

  if(connected)
    return(
      <div>
        <h1>Settings</h1>
        <div>
          <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
            <div style={{marginBottom:'1.5vh', marginRight: '2vh', width: '25.5vh', height: '22vh', backgroundColor: '#F5E7D9', borderRadius: '2vh', overflow: 'hidden'}}><img style={{width: '100%', height: '100%'}} src={require('./res/face.jpg')}></img></div>
            <button style={{width: '14vh', height: '22vh', border: 'none', borderRadius: '2vh', backgroundColor: '#644c75', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><FaMoon size={'50%'} color="#8d70a1"/></button>
          </div>
          <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
            <button style={{width: '14vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e97366', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold', marginRight: '2vh'}}><MdDeleteSweep size={'50%'} color="#f0a49c"/></button>
            <button onClick={() => {window.localStorage.removeItem('board'); connected = false; update()}} style={{width: '26vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e99f66', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><IoLogInOutline size={'50%'} color="#fcd4b6"/></button>
          </div>
        </div>
      </div>
    );
  else return <NoConnection screen='settings' update={update}/>
}

async function connectBoard(){
  const { data } = await supabase.from('boards').select().eq('code', document.getElementById('code').value);

  return data;
}

function NoConnection(prop){
  const codeConfirm = useRef();

  const [connecting, set] = useState(true);

  const swapScreens = (con = []) => { 
    if(con.length != 0){
      connected = (con[0]) ? true : false;
    
      console.log(con[0]['code']);
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
          <button id="codeConfirm" ref={codeConfirm} onClick={async () => {swapScreens(await connectBoard()); prop.update()}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '1.5vh', backgroundColor: '#2f3236', color: '#c9bfb5', fontWeight: 'bold', fontSize: '4vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IoSend size={'75%'}/></button>
        </div>
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
    return <h1>No bitches</h1>
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
            <FaHome onClick={() => {swapClasses('homeOn'); swapScreens('home')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
            <PiSquaresFourFill id='boards' onClick={() => {swapClasses('boardsOn'); swapScreens('boards')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
            <IoIosSettings onClick= {() => { swapClasses('settingsOn'); swapScreens('settings')}} size='4vh' style={{margin: '0 5vh 0 5vh'}}/>
        </div>
    </div>
  );
}

//Main screen
export default function mainPage(){

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