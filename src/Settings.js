//Icons
import { FaMoon} from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { IoLogInOutline } from "react-icons/io5";

//Functions
import { useState, React, useEffect} from 'react';
import { clearDB, setNightMode, setBrightness, getNightModeScope } from "./dbFunctions";

//Components
import { NoConnection, setConnected, getConnected, swapClasses } from './App';

export function Settings(){

  const [val, set] = useState(false);
  const update = () => {
    set(!val);
  };

  const [nightMode, setNM] = useState(false);
  const toggleNightMode = () => {
    setNM(!nightMode);
    swapClasses((!nightMode) ? 'nightModeOn' : 'settingsOn');
  }

  const sliderDimmest = '2f4d4b';
  const sliderBrightest = '08a177';

  const calculateColor = (val) => {

    let diffred = Number('0x' + sliderBrightest.substring(0,2)) - Number('0x' + sliderDimmest.substring(0,2));
    let red = Number('0x' + sliderDimmest.substring(0,2)) + diffred * val / 100;
    
    let diffgreen = Number('0x' + sliderBrightest.substring(2,4)) - Number('0x' + sliderDimmest.substring(0,2));
    let green = Number('0x' + sliderDimmest.substring(2,4)) + diffgreen * val / 100;
    
    let diffblue = Number('0x' + sliderBrightest.substring(4,6)) - Number('0x' + sliderDimmest.substring(0,2));
    let blue = Number('0x' + sliderDimmest.substring(4,6)) + diffblue * val / 100;


    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  }

  //Restoring saved thumb color
  var style = document.createElement('style');
  style.innerHTML = `
      #dimmSlider::-webkit-slider-thumb {
          background: ${calculateColor(window.localStorage.getItem('dimmSlider'))};
      }
      #dimmSlider::-moz-range-thumb {
          background: ${calculateColor(window.localStorage.getItem('dimmSlider'))};
      }
  `;
  document.head.appendChild(style);


  //Updating value and color of a slider on interaction
  const [sliderVal, setSV] = useState(window.localStorage.getItem('dimmSlider'));
  const sliderUpdate = (val) => {
    setSV(val);
    
    window.localStorage.setItem('dimmSlider', val);

    var style = document.createElement('style');
    style.innerHTML = `
        #dimmSlider::-webkit-slider-thumb {
            background: ${calculateColor(val)};
        }
        #dimmSlider::-moz-range-thumb {
            background: ${calculateColor(val)};
        }
    `;

    document.head.appendChild(style);

    setBrightness(window.localStorage.getItem('board'), val);

    //console.log('rgb(' + red + ", " + green + ", " + blue + ")");
  }
  
  if(getConnected() && !nightMode)
    return(
      <div>
        <h1>Settings</h1>
        <div>
          <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
            <div style={{marginBottom:'1.5vh', marginRight: '2vh', width: '26vh', height: '22vh', backgroundColor: '#F5E7D9', borderRadius: '2vh', overflow: 'hidden'}}><img style={{width: '100%', height: '100%'}} src={require('./res/dog.png')}></img></div>
            <button onClick={() => {toggleNightMode()}} style={{width: '14vh', height: '22vh', border: 'none', borderRadius: '2vh', backgroundColor: '#644c75', fontSize: '2.25vh', fontWeight: 'bold'}}><FaMoon size={'50%'} color="#8d70a1"/></button>
          </div>
          <div style={{width: '100vw', display: 'flex', justifyContent: 'center', paddingBottom: '2vh'}}>
            <button onClick={() => {clearDB(window.localStorage.getItem('board'))}}style={{width: '14vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e97366', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold', marginRight: '2vh'}}><MdDeleteSweep size={'50%'} color="#f0a49c"/></button>
            <button onClick={() => {window.localStorage.removeItem('board'); setConnected(false); update()}} style={{width: '26vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e99f66', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><IoLogInOutline size={'50%'} color="#fcd4b6"/></button>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', width: '42vh', height: '6vh', border: 'none', borderRadius: '2vh', paddingLeft: '1vh', backgroundColor: '#50956F', fontSize: '2.25vh', fontWeight: 'bold'}}>
              {/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '5vh', height: '5vh', color: '#FFF6E8', borderRadius: '2.5vh', backgroundColor: '#2f4d4b'}}><FaLightbulb size={'50%'} color="#437573"/></div> */}
              <input type="range" defaultValue={window.localStorage.getItem('dimmSlider')} id="dimmSlider" onChange={() => {sliderUpdate(document.getElementById('dimmSlider').value)}}></input>
            </div>
          </div>
        </div>
      </div>
    );
  else if(nightMode)
      return <NightMode toggleNightMode={toggleNightMode}/>
  else return <NoConnection screen='settings' update={update}/>
}

function NightMode(prop){

  const [nightMode, toggleNightMode] = useState(window.localStorage.getItem('nightMode') === "true");

  const [mode, setMode] = useState(-1);
  const changeMode = (m) => {
    setMode(m);
  };
  
  const [NMScope, setNMScope] = useState();

  useEffect(() => {
      const fetchNMScope = async () => {
          let scope = await getNightModeScope(window.localStorage.getItem('board'));
          setNMScope(scope);
      }

      fetchNMScope();
  }, [])


  return (
    <div>
      <h1>Night Mode</h1>
      <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
        <input id='from' type="time" defaultValue={NMScope?.[0]}></input>
        <input id='to' type="time" defaultValue={NMScope?.[1]}></input>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <button onClick={() => {toggleNightMode(!nightMode); changeMode(-1); window.localStorage.setItem('nightMode', !nightMode)}} style={{marginTop: '4vw', width: '15vw', height: '10vw', border: 'none', borderRadius: '2vw', backgroundColor: (nightMode) ? '#77dd77' : '#ee6666', color: (nightMode) ? '#274f27': '#912a2a', fontWeight: 'bold'}}>Toggle</button>
        <button onClick={() => {if(!nightMode) {prop.toggleNightMode(); setNightMode(window.localStorage.getItem('board')); } else if(document.getElementById('from').value !== '' && document.getElementById('to').value !== '' && (!isNaN(parseInt(document.getElementById('dimmTo').value)) || mode === 2)) {prop.toggleNightMode(); setNightMode(window.localStorage.getItem('board'), document.getElementById('from').value, document.getElementById('to').value, (mode === 2) ? 0 : document.getElementById('dimmTo').value);}}} style={{marginTop: '4vw', width: '10vw', height: '10vw', border: 'none', borderRadius: '2vw', backgroundColor: '#303336', color: '#cfc1c1', fontWeight: 'bold'}}>Set</button>
        <button onClick={() => {if(nightMode) changeMode(2)}} style={{marginTop: '4vw', width: '20vw', height: '10vw', border: 'none', borderRadius: '2vw', backgroundColor: (mode === 2) ? '#cfc1c1' : '#303336', color: (mode === 2) ? '#303336': '#cfc1c1', fontWeight: 'bold'}}>Turn off</button>
        <button onClick={() => {if(nightMode) changeMode(3)}} style={{marginTop: '4vw', width: '27vw', height: '10vw', border: 'none', borderRadius: '2vw', backgroundColor: (mode === 3) ? '#cfc1c1' : '#303336', color: (mode === 3) ? '#303336': '#cfc1c1', fontWeight: 'bold'}}>Dimm to <input id='dimmTo' type="text" maxLength={2} style={{background: 'transparent', width: '6vw', border: 'none', color: (mode === 3) ? '#303336': '#cfc1c1', borderBottom: '1px solid'}}></input> %</button>
      </div>
    </div>
  )
}
