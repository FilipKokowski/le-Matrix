//Icons
import { FaMoon } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { IoLogInOutline } from "react-icons/io5";

//Functions
import { useState, React} from 'react';
import { clearDB } from "./dbFunctions";

//Components
import { NoConnection, setConnected, getConnected } from './App';

export function Settings(){

    const [val, set] = useState(false);
    const update = () => {
      set(!val);
    };
  
    if(getConnected())
      return(
        <div>
          <h1>Settings</h1>
          <div>
            <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
              <div style={{marginBottom:'1.5vh', marginRight: '2vh', width: '25.5vh', height: '22vh', backgroundColor: '#F5E7D9', borderRadius: '2vh', overflow: 'hidden'}}><img style={{width: '100%', height: '100%'}} src={require('./res/face.jpg')}></img></div>
              <button style={{width: '14vh', height: '22vh', border: 'none', borderRadius: '2vh', backgroundColor: '#644c75', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><FaMoon size={'50%'} color="#8d70a1"/></button>
            </div>
            <div style={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
              <button onClick={() => {clearDB(window.localStorage.getItem('board'))}}style={{width: '14vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e97366', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold', marginRight: '2vh'}}><MdDeleteSweep size={'50%'} color="#f0a49c"/></button>
              <button onClick={() => {window.localStorage.removeItem('board'); setConnected(false); update()}} style={{width: '26vh', height: '14vh', border: 'none', borderRadius: '2vh', backgroundColor: '#e99f66', color: '#FFF6E8', fontSize: '2.25vh', fontWeight: 'bold'}}><IoLogInOutline size={'50%'} color="#fcd4b6"/></button>
            </div>
          </div>
        </div>
      );
    else return <NoConnection screen='settings' update={update}/>
  }