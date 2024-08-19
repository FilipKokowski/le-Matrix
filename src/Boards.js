//Icons
import { FaPlus, FaEraser, FaRegTrashCan } from "react-icons/fa6";
import { AiOutlinePicture } from "react-icons/ai";
import { CgColorPicker } from "react-icons/cg";



//Functions
import { useState, useEffect, React} from 'react';
import { getConnected, swapClasses, setTiles, setColor, getColor, getTilesColors, id, setID } from './App';
import { getDBBoards, getSelected, setSelected, supabase, getDBBoard, getBoardData, setBoardData} from "./dbFunctions";

//Components
import { NoConnection, Tile, TileHandler } from './App';

export let mode = null;

export let colorPickerColor = null;

//Directs to board designer, or if ID is assigned, shows thumbnail and directs to settings of that board
export function Board(prop){
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
            if(prop.id){
                if(prop.id === 'current'){
                    const current = await getDBBoard(JSON.parse((await getSelected(window.localStorage.getItem('board'))).selected));

                    setBoard(current);
                } else {
                    const result = await getDBBoards(window.localStorage.getItem('board'));
                    setBoard(result[prop.id]);

                }
            }
        };

        fetchBoards();
    }, []);

    if(prop.id)
        return (
        <div onClick={prop.onClick} style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#303336', borderRadius: '5vw', float: 'left', margin: '0 2.5vh 0 2.5vh', overflow: "hidden"}}>
            {/* Thumbnail of the board*/}
            {board}
        </div>
        )
    else
        return (
        <div onClick={prop.onClick} style={{width: '15vh', height: '15vh', minWidth: '15vh', backgroundColor: '#303336', borderRadius: '5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'left', margin: '0 2.5vh 0 2.5vh'}}>
            <FaPlus size={'10vh'} color="#494e52"/>
        </div>
        )

}
  
export function Boards(prop){
    const [val, set] = useState(false);
    const update = () => {
        set(!val);
    };

    const [boardAss, setBoardAss] = useState(false);
    const toggleBoardAss = (className) => {
        setBoardAss(!boardAss);
        swapClasses(className);
    };

    const [boardT, setBoardTemplate] = useState(null);
    const boardTemplate = (template) => {
        setBoardTemplate(template);
    };

    const [boards, setBoards] = useState(null);
    useEffect(() => {
        const fetchBoards = async () => {
            const result = await getDBBoards(window.localStorage.getItem('board'));
            
            let boardsLocal = []

            for(let board = 0; board < result.length; board++){
                boardsLocal.push(<Board onClick={() => {setID(result[board][0].props.boardID); toggleBoardAss('boardsOn'); boardTemplate(result[board]); swapClasses('boardAssemblerOn')}} id={board.toString()} key={board}/>);
            }
            setBoards(boardsLocal);
        };

        fetchBoards();
    }, []);

    if(getConnected() && !boardAss)
        return (
        <div>
            <h1>Your boards</h1>
            <div id='slider' style={{height: '15vh', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '6vh', overflowX: 'scroll'}}> 
                <Board onClick={() => {toggleBoardAss('boardsOn'); swapClasses('boardAssemblerOn')}} key='0'></Board>
                {boards}
            </div>
        </div>
        );
    else if(getConnected() && boardAss) return <BoardAssembler swap={prop.swap} update={toggleBoardAss} board={boardT}/>
    else return <NoConnection screen='boards' update={update} parent={'boards'}/>
}

function ToolBar(prop){
    const [currentColor, setBgColor] = useState(() => { setColor(prop.tiles[112].props.c); return getColor(); });
    const changeColor = () => {
        setBgColor(document.getElementById('colorPicker').value);
        setColor(document.getElementById('colorPicker').value)
    }

    const [colorPicker, setColorPicker] = useState((mode === 'colorPicker') ? true : false);
    const toggleColorPicker = () => {
        setColorPicker(!colorPicker);
        mode = (!colorPicker) ? 'colorPicker' : null;
        console.log(mode)
    };

    const [eraser, setEraser] = useState(false);
    const toggleEraser = () => {
        setEraser(!eraser);
        mode = (!eraser) ? 'eraser' : null;
        console.log(mode)
    };


    return (
        <div style={{width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw'}}>
            <input type="color" id="colorPicker" defaultValue={getColor()} onChange={() => {changeColor()}}></input>
            <button onClick={() => {if(eraser) {toggleEraser();} toggleColorPicker()}} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', marginLeft: '2vw', backgroundColor: (colorPicker) ? '#cfc1c1' : '#303336'}}><CgColorPicker size={'75%'} color={(colorPicker) ? '#303336': '#cfc1c1'}/></button>
            <button onClick={() => {if(colorPicker) {toggleColorPicker();} toggleEraser()}} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', marginLeft: '2vw', backgroundColor: (eraser) ? '#cfc1c1' : '#303336'}}><FaEraser size={'75%'} color={(eraser) ? '#303336': '#cfc1c1'}/></button>
        </div>
    );

}

export function BoardAssembler(prop){

    const [image, setI] = useState(null);
    const setImage = (img) => {
        setI(img);
    };

    const [tileColor, setTileColor] = useState(null);
    const setColorPicker = (c) => {
        setTileColor(c);
    };

    const [boardName, setBN] = useState();

    useEffect(() => {
        const fetchBoardName = async () => {
            let name = (await getBoardData(id))[0];
            setBN(name === undefined ? 'Board' : name);
        }

        fetchBoardName();
    }, [])


    async function exportBoard(){
        await supabase.from('boards').insert({code: window.localStorage.getItem('board'), board: JSON.stringify(getTilesColors().slice(0,255))})
    }

    async function updateBoard(){
        let name = document.getElementById('boardName').value;
        
        await supabase.from('boards').update({board: JSON.stringify(getTilesColors().slice(0,255))}).eq('id', id);
        await setBoardData(id, name, new Date().toJSON().slice(0,10));
    }

    async function removeBoard(){        
        await supabase.from('boards').delete().eq('id', id);
    }


    let tiles = []
    let tileNum = 225;
    let tileSize = window.innerWidth * .9 / 15;
    
    for(let row = 0; row < Math.sqrt(tileNum); row++){
        for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
            let color = '#000000';
            if(tileColor == null){
                color = (prop.board == null) ? '#000000' : prop.board[row * Math.sqrt(tileNum) + tile].props.c;

                if(image !== null)
                    color = (image[1 + row * Math.sqrt(tileNum) + tile]) ? image[row * Math.sqrt(tileNum) + tile] : image[row * Math.sqrt(tileNum) + tile];
            }
            else{
                color = (getTilesColors() == null) ? '#000000' : getTilesColors()[row * Math.sqrt(tileNum) + tile];

                if(image !== null)
                    color = (image[1 + row * Math.sqrt(tileNum) + tile]) ? image[row * Math.sqrt(tileNum) + tile] : image[row * Math.sqrt(tileNum) + tile];
                }
            tiles.push(<Tile setColorPicker={setColorPicker} id='Tile' boardID={id} c={color} key={Math.floor(Math.random() * (1000000001))} text={1 + row * Math.sqrt(tileNum) + tile} size={tileSize} editable={true}/>)
        }
    }
    

    setTiles(tiles);

    let title = (prop.board == null) ? 
        <h1>Create <input onChange={() => { document.getElementById('boardName').value = document.getElementById('boardName').value.toLowerCase()}} id="boardName" style={{height: '3vh', width: '22vh', fontSize: '3vh', marginLeft: '1vh', fontWeight: 'bold', background: 'none', border: 'none', backgroundColor: '#212529', borderRadius: '1vh'}} type="text" maxLength={10} defaultValue="Board"></input></h1> 
       :<h1 onChange={() => { document.getElementById('boardName').value = document.getElementById('boardName').value.toLowerCase()}} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Edit <input id="boardName" style={{height: '3vh', width: '22vh', fontSize: '2.75vh', marginLeft: '1vh', fontWeight: 'bold', background: 'none', border: 'none', backgroundColor: '#212529', borderRadius: '1vh'}} type="text" maxLength={10} defaultValue={boardName}></input></h1>;

    return (
        <div>
        {title}
        <div style={{height: '100%', overflowY: 'scroll', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '90vw', height: '90vw', margin: 'auto'}}>
                <TileHandler tiles={tiles}/>
            </div>
            <ToolBar tiles={tiles}/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3vw'}}>
                <button onClick={() => {if(prop.board == null) exportBoard(); else {removeBoard(window.localStorage.getItem('board'));} prop.update('homeOn'); prop.swap('home')}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#aa4444', color: '#ed8787', fontWeight: 'bold', marginRight: '5vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><FaRegTrashCan size={'65%'}></FaRegTrashCan></button>
                <button onClick={() => {if(prop.board == null) exportBoard(); else {updateBoard(window.localStorage.getItem('board'));} prop.update('homeOn'); prop.swap('home')}} style={{width: '30vw', height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#212529', color: '#cfc1c1', fontWeight: 'bold', marginRight: '5vw'}}>Save</button>
                <button onClick={() => {if(prop.board == null) exportBoard(); else {updateBoard(window.localStorage.getItem('board'));} setSelected(localStorage.getItem('board'), id); prop.update('homeOn'); prop.swap('home');}} style={{width: '20vw', height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#554e6b', color: '#a499c4', fontWeight: 'bold', marginRight: '5vw'}}>Use</button>
                <button style={{height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#5e3e4c', color: '#ab8998', fontWeight: 'bold'}}><label htmlFor='uploadImage' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><AiOutlinePicture size={'7vw'}/></label></button>
                <input type="file" onChange={() => {loadImage(setImage)}} id='uploadImage' hidden></input>
            </div>
        </div>
        </div>
    );
}

function loadImage(setImage){
    if(document.getElementById('uploadImage').files[0]){
        var file = document.getElementById('uploadImage').files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var size = Math.min(img.width, img.height);

                canvas.width = 15;
                canvas.height = 15;

                var x = (img.width - size) / 2;
                var y = (img.height - size) / 2;

                ctx.drawImage(img, x, y, size, size, 0, 0, 15, 15);

                var imageData = ctx.getImageData(0, 0, 15, 15);
                var pixels = imageData.data;

                let board = [];

                for (var i = 0; i < pixels.length; i += 4) {
                    var red = pixels[i];
                    var green = pixels[i + 1];
                    var blue = pixels[i + 2];

                    board.push("#" + toHex(red) + toHex(green) + toHex(blue));
                    console.log(board[board.length - 1]);
                }

                console.log(board);
                setImage(board);
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}
