//Icons
import { FaPlus, FaBucket, FaEraser } from "react-icons/fa6";
import { AiOutlinePicture } from "react-icons/ai";

//Functions
import { useState, useEffect, React} from 'react';
import { getConnected, swapClasses, setTiles, setColor, getColor, getTilesColors, getTiles, id, setID } from './App';
import { getDBBoards, getSelected, setSelected, supabase } from "./dbFunctions";

//Components
import { NoConnection, Tile, TileHandler } from './App';

//Directs to board designer, or if ID is assigned, then shows thumbnail and directs to settings of that board
export function Board(prop){
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
            if(prop.id){
                if(prop.id === 'current'){

                    const current = await getSelected(window.localStorage.getItem('board'));
                    let currentBoard = [];

                    Object.entries(JSON.parse(current.selected)).forEach((entry) => {
                        const [key, value] = entry;
                        if(key >= 0 && key < 255)
                            currentBoard.push(<Tile size={window.innerHeight / 100} text={key} key={key} c={value}/>)
                    });

                    setBoard(currentBoard);
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
                boardsLocal.push(<Board onClick={() => {setID(result[board][0].props.boardID); toggleBoardAss(); boardTemplate(result[board]); swapClasses('boardAssemblerOn')}} id={board.toString()} key={board}/>);
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
                <Board onClick={() => {toggleBoardAss(); swapClasses('boardAssemblerOn')}} key='0'></Board>
                {boards}
            </div>
        </div>
        );
    else if(getConnected() && boardAss) return <BoardAssembler update={toggleBoardAss} board={boardT}/>
    else return <NoConnection screen='boards' update={update} parent={'boards'}/>
}

export function BoardAssembler(prop){

    const [image, setI] = useState(null);
    const setImage = (img) => {
        setI(img);
    };

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
        await supabase.from('boards').insert({code: window.localStorage.getItem('board'), board: JSON.stringify(getTilesColors().slice(0,255))})
    }

    async function updateBoard(){
        console.log(getTilesColors().slice(0,255))
        
        await supabase.from('boards').update({board: JSON.stringify(getTilesColors().slice(0,255))}).eq('id', id);
    }

    async function updateSelected(){
        await supabase.from('system').update({selected: JSON.stringify(getTilesColors().slice(0,255))}).eq('id', id);
    }

    setColor(currentColor);

    let tiles = []
    let tileNum = 225;
    let tileSize = window.innerWidth * .9 / 15;
    
    for(let row = 0; row < Math.sqrt(tileNum); row++){
        for(let tile = 0; tile < Math.sqrt(tileNum); tile++){
            let color = (prop.board == null) ? 'black' : prop.board[row * Math.sqrt(tileNum) + tile].props.c;

            if(image != null)
                color = (image[1 + row * Math.sqrt(tileNum) + tile]) ? image[row * Math.sqrt(tileNum) + tile] : image[row * Math.sqrt(tileNum) + tile];
            
            tiles.push(<Tile boardID={id} c={color} key={Math.floor(Math.random() * (1000000001))} text={1 + row * Math.sqrt(tileNum) + tile} size={tileSize} editable={true}/>)
        }
    }

    setTiles(tiles);

    let title = (prop.board == null) ? <h1>Create new board</h1> : <h1>Edit your board</h1>;

    return (
        <div>
        {title}
        <div style={{height: '100%', overflowY: 'scroll', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '90vw', height: '90vw', margin: 'auto'}}>
                <TileHandler tiles={tiles} mode={(bucket && eraser) ? 'clear' : (bucket) ? 'bucket' : (eraser) ? 'eraser' : 'normal'}/>
            </div>
            <div style={{width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw'}}>
                <input type="color" defaultValue={getColor()} id="colorPicker" onChange={() => {changeColor()}}></input>
                <button onClick={() => {toggleBucket()}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', marginLeft: '2vw', backgroundColor: (bucket) ? '#cfc1c1' : '#303336'}}><FaBucket size={'75%'} color={(bucket) ? '#303336': '#cfc1c1'}/></button>
                <button onClick={() => {toggleEraser()}} style={{width: '10vw', height: '10vw', border: 'none', borderRadius: '3vw', marginLeft: '2vw', backgroundColor: (eraser) ? '#cfc1c1' : '#303336'}}><FaEraser size={'75%'} color={(eraser) ? '#303336': '#cfc1c1'}/></button>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3vw'}}>
                <button onClick={() => {if(prop.board == null) exportBoard(); else updateBoard(window.localStorage.getItem('board')); prop.update()}} style={{width: '40vw', height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#212529', color: '#cfc1c1', fontWeight: 'bold', marginRight: '5vw'}}>Save</button>
                <button onClick={() => {if(prop.board == null) exportBoard(); else {updateSelected(window.localStorage.getItem('board')); updateBoard(window.localStorage.getItem('board'));} setSelected(localStorage.getItem('board'), getTilesColors()); prop.update()}} style={{width: '20vw', height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#554e6b', color: '#cfc1c1', fontWeight: 'bold', marginRight: '5vw'}}>Use</button>
                <button style={{height: '10vw', border: 'none', borderRadius: '3vw', backgroundColor: '#5e3e4c', color: '#cfc1c1', fontWeight: 'bold'}}><label htmlFor='uploadImage' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><AiOutlinePicture size={'7vw'}/></label></button>
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
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.width);

            var scaleFactor = 15 / Math.min(img.width, img.height); // Change this to scale the image by a different factor
            var scaledCanvas = document.createElement('canvas');
            var scaledCtx = scaledCanvas.getContext('2d');
            scaledCanvas.width = img.width * scaleFactor;
            scaledCanvas.height = img.height * scaleFactor;
            scaledCtx.drawImage(canvas, 0, 0, Math.min(scaledCanvas.width, scaledCanvas.height), Math.min(scaledCanvas.width, scaledCanvas.height));

            // Get pixel data from the scaled canvas
            var imageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
            var pixels = imageData.data;

            let board = []

            // Iterate through pixels
            for (var i = 0; i < pixels.length; i += 4) {
            // pixels[i], pixels[i+1], pixels[i+2], pixels[i+3] represent R, G, B, A values respectively
            var red = pixels[i];
            var green = pixels[i+1];
            var blue = pixels[i+2];
            
            board.push("rgb(" + red + ", " + green + ", " + blue + ")");

            // Do something with the pixel values
            //console.log(i / 4 + " Pixel at (" + (i / 4 % scaledCanvas.width) + ", " + Math.floor(i / 4 / scaledCanvas.width) + "): R=" + red + ", G=" + green + ", B=" + blue + ", A=" + alpha);
            }  

            console.log(board)
            setImage(board)
        };
        img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
}
