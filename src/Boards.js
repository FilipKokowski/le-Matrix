//Icons
import { FaPlus, FaPowerOff, FaBucket, FaEraser } from "react-icons/fa6";

//Functions
import { useState, useEffect, React} from 'react';
import { getConnected, swapClasses, setTiles, setColor, getColor, getTilesColors } from './App';
import { getDBBoards, supabase } from "./dbFunctions";

//Components
import { NoConnection, Tile, TileHandler } from './App';

export function Boards(){
    const [val, set] = useState(false);
    const update = () => {
        set(!val);
    };

    const [boardAss, setBoardAss] = useState(false);
    const toggleBoardAss = () => {
        setBoardAss(!boardAss);
        swapClasses('boardsOn');
    };

    if(getConnected() && !boardAss)
        return (
        <div>
            <h1>Your boards</h1>
            <div id='slider' style={{height: '15vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '6vh', overflowX: 'scroll'}}> 
                <Board onClick={() => {toggleBoardAss(); swapClasses('boardAssemblerOn')}}/>
                <Board onClick={() => {toggleBoardAss(); swapClasses('boardAssemblerOn')}}/>
            </div>
        </div>
        );
    else if(getConnected() && boardAss) return <BoardAssembler update={toggleBoardAss}/>
    else return <NoConnection screen='boards' update={update} parent={'boards'}/>
}

  //Directs to board designer, or if ID is assigned, then shows thumbnail and directs to settings of that board
export function Board(prop){
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
        if(prop.id){
            const result = await getDBBoards(window.localStorage.getItem('board'));
            setBoard(result[result.length - 1]);
        }
        };

        fetchBoards();
    }, []);

    if(prop.id)
        return (
        <div onClick={prop.onClick} style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#303336', borderRadius: '3vh', float: 'left', margin: '0 2.5vh 0 2.5vh', overflow: "hidden"}}>
            {/* Thumbnail of the board*/}
            {board}
        </div>
        )
    else
        return (
        <div onClick={prop.onClick} style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#303336', borderRadius: '3vh', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'left', margin: '0 2.5vh 0 2.5vh'}}>
            <FaPlus size={'10vh'} color="#494e52"/>
        </div>
        )

}
  
export function BoardAssembler(prop){

    const [bucket, setBucket] = useState(false);

    const toggleBucket = () => {
        setBucket(!bucket);
    };

    const [eraser, setEraser] = useState(false);

    const toggleEraser = () => {
        setEraser(!eraser);
    };

    const [currentColor, setBgColor] = useState(getColor());
    const changeColor = () => {
        setBgColor(document.getElementById('colorPicker').value);
    }

    async function exportBoard(){
        await supabase.from('boards').insert({code: window.localStorage.getItem('board'), board: JSON.stringify(getTilesColors())})
    }

    setColor(currentColor);

    let tiles = []
    let tileNum = 225;
    let tileSize = window.innerWidth * .9 / 15;


    for(let row = 0; row < Math.sqrt(tileNum); row++){
        for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
        tiles.push(<Tile c="black" key={1 + row * Math.sqrt(tileNum) + tile} text={1 + row * Math.sqrt(tileNum) + tile} size={tileSize} editable={true}/>)
        }
    }

    setTiles(tiles);

    return (
        <div>
        <h1>Create new board</h1>
        <div style={{height: '100%', overflowY: 'scroll', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '90vw', height: '90vw', margin: 'auto'}}>
            <   TileHandler tiles={tiles} mode={(bucket && eraser) ? 'clear' : (bucket) ? 'bucket' : (eraser) ? 'eraser' : 'normal'}/>
            </div>
            <div style={{width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw'}}>
                <input type="color" defaultValue="#f6b73c" id="colorPicker" onChange={() => {changeColor()}}></input>
                <button onClick={() => {toggleBucket()}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', marginLeft: '2vw', backgroundColor: (bucket) ? '#cfc1c1' : '#303336'}}><FaBucket size={'75%'} color={(bucket) ? '#303336': '#cfc1c1'}/></button>
                <button onClick={() => {toggleEraser()}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', marginLeft: '2vw', backgroundColor: (eraser) ? '#cfc1c1' : '#303336'}}><FaEraser size={'75%'} color={(eraser) ? '#303336': '#cfc1c1'}/></button>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3vw'}}>
                <button onClick={() => {exportBoard(); prop.update()}} style={{width: '40vw', height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#212529', color: '#cfc1c1', fontWeight: 'bold'}}>Save</button>
            </div>
        </div>
        </div>
    );
}