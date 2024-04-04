//Icons
import { FaPowerOff } from "react-icons/fa6";
import { FaInstagram} from "react-icons/fa";

//Functions
import { useState, useEffect, React} from 'react';
import { getConnected, setTiles, swapClasses, toggleNotification } from './App';
import { setPowerState, getPowerState } from "./dbFunctions";

//Components
import { NoConnection, Tile } from './App';
import { Board, BoardAssembler } from "./Boards";

export function PowerButton(){
    const [currentMode, setMode] = useState(null);

    //Get power state from the database and assign it to currentMode
    useEffect(() => {
        (async () => {
            const powerState = await getPowerState(window.localStorage.getItem('board'));
            setMode(!powerState);
        }) ();
    }, []);

    const changeColor = () => { 
        setMode(!currentMode); 
    }

    return <div onClick={ async () => {changeColor(); setPowerState(window.localStorage.getItem('board'), !(await getPowerState(window.localStorage.getItem('board'))))}} style={{width:'14vh', height: '14vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: (currentMode) ? '#d15c4f' : '#82A67D', borderRadius: '2vh', marginRight: '2.5vh'}}><FaPowerOff size='50%' color={(currentMode) ? '#f0a49c' : '#aac2a7'}/></div>
}
  
  
//Navbar destinations
export function Home(prop){
    const [val, set] = useState(false);
    const update = () => {
        set(!val);
    };

    const [boardAss, setBoardAss] = useState(false);
    const toggleBoardAss = () => {
        setBoardAss(!boardAss);
        swapClasses('homeOn');
    };

    if(getConnected() && !boardAss){
        const boardThumbnailSize = window.innerHeight / 100 * 15;
        
        let tiles = [];
        let tileNum = 225;
        let tileSize = boardThumbnailSize / 15;

        for(let row = 0; row < Math.sqrt(tileNum); row++){
            for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
                tiles.push(<Tile key={1 + row * Math.sqrt(tileNum) + tile} size={tileSize}/>)
            }
        }

        setTiles(tiles);

        return (
        <div>
            <h1>Home</h1>
            <div style={{width: '42.5vh', height: '17vh', backgroundColor: '#303336', margin: '0 auto', paddingRight: '1.25vh', paddingTop: '2vh', borderRadius: '4vw'}}>
                <Board id='current'/>
                <h2 style={{marginTop: '0'}}>Random colors</h2>
                <h3>Set since 11.09.2001</h3>
                <button onClick={() => { prop.swap('boards');}} style={{width: '20vh', height: '5vh', border: 'none', borderRadius: '2vh', backgroundColor: '#212529', color: '#cfc1c1', fontWeight: 'bold', fontSize: '1.75vh'}}>Change board</button>
            </div>
            <div style={{width:'100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5vh'}}>
                <div>
                    <div onClick={() => {window.location.href='https://www.instagram.com/direct/t/104475757669880/';}} style={{width:'14vh', height: '14vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderRadius: '2vh', marginRight: '1.5vh', marginBottom: '1.75vh'}}>
                        <FaInstagram size='75%' color='white'/>
                    </div>
                    <PowerButton/>
                </div>
                <div style={{overflow: 'hidden', width:'27vh', height: '30vh',  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5E7D9', borderRadius: '4vw'}}>
                    <img style={{height: '30vh'}} src={require('./res/cat.png')}></img>
                </div>   
            </div>
        </div>
        );
    }
    else if(getConnected())
        return <BoardAssembler update={toggleBoardAss}/>
    else return <NoConnection screen='home' update={update}/>

}