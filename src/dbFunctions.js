import { createClient } from "@supabase/supabase-js";

//Components
import { Tile, toggleNotification } from "./App";

export const supabase = createClient("https://xujfzrydvpziizkztbjp.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amZ6cnlkdnB6aWl6a3p0YmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNDQwNTUsImV4cCI6MjAyNjcyMDA1NX0.ikspwER5xHsaSPIkO67P-XOzCPNjIaLMDa7o5dCa608");

export async function getCode(code){
    const { data } = await supabase.from('system').select().eq('code', code);
  
    return data;
}

export async function getPowerState(code){
    const { data } = await supabase.from('system').select().eq('code', code);
    
    return data[0]['powerOn'];
}

export async function setPowerState(code, state){
    await supabase.from('system').update({powerOn: state}).eq('code', code);   
    toggleNotification((state) ? 'Board has been turned on' : 'Board has been turned off');
}

export async function clearDB(code){
    await supabase.from('boards').delete().eq('code', code);
    toggleNotification('All boards have been erased');
}

export async function getDBBoards(code, editable){

    let {data} = await supabase.from('boards').select().eq('code', code);

    let boards = [];

    data.forEach(element => {
        let board = [];
        Object.entries(JSON.parse(element['board'])).forEach((entry) => {
            const [key, value] = entry;
            if(!isNaN(key))
                board.push(<Tile boardID={element.id} key={key} text={key} c={value} editable={editable} size={window.innerHeight / 100}/>)
        });
        boards.push(board);
    });

    return boards;

}

export async function getDBBoard(id){
    let {data} = await supabase.from('boards').select().eq('id', id);

    let boards = [];

    data.forEach(element => {
        let board = [];
        Object.entries(JSON.parse(element.board)).forEach((entry) => {
            const [key, value] = entry;
            if(!isNaN(key))
                board.push(<Tile boardID={element.id} key={key} text={key} c={value} size={window.innerHeight / 100}/>)
        });
        boards.push(board);
    });

    return boards;
}

export async function setSelected(code, id){
    console.log("dawdaw");
    await supabase.from('system').update({selected: id}).eq('code', code);
}

export async function getSelected(code){
    const {data} = await supabase.from('system').select().eq('code', code);
    return data[0];
}

export async function setBrightness(code, brightness){
    await supabase.from('system').update({brightness: brightness}).eq('code', code);
}

export async function setNightMode(code, from, to, dimmTo = '0'){

    if(from === undefined || to === undefined)
        await supabase.from('system').update({from: null, to: null, mode: null, dimmTo: '0'}).eq('code', code);
    else if(dimmTo === 0)
        await supabase.from('system').update({from: `${from}`, to: `${to}`, mode: 'turnOff', dimmTo: '0'}).eq('code', code);
    else
        await supabase.from('system').update({from: `${from}`, to: `${to}`, mode: 'dimmTo', dimmTo: dimmTo}).eq('code', code);

}


export async function getNightModeInfo(code){
    const {data} = await supabase.from('system').select().eq('code', code);
    
    let fromSecs = parseInt(data[0]['from']?.substring(0,2)) * 60 + parseInt(data[0]['from']?.substring(3,5));
    let toSecs = parseInt(data[0]['to']?.substring(0,2)) * 60 + parseInt(data[0]['to']?.substring(3,5))

    let fromDayName = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
    let toDayName = (fromSecs < toSecs) ? new Date().toLocaleDateString('en-GB', { weekday: 'long' }) : new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-GB', { weekday: 'long' });

    return { from: data[0]['from'], fromDayName: fromDayName, to: data[0]['to'], toDayName: toDayName, mode: data[0]['mode'], dimmTo: data[0]['dimmTo']};
}

export async function getBoardData(id){
    const {data} = await supabase.from('boards').select().eq('id', id);

    return [data[0]?.name, data[0]?.date_of_creation];
}

export async function setBoardData(id, name, date){
    if(name !== null && date === null)
        await supabase.from('boards').update({name: name}).eq('id', id);
    else if(name === null && date !== null)
        await supabase.from('boards').update({date_of_creation: date}).eq('id', id);
    else
        await supabase.from('boards').update({date_of_creation: date, name: name}).eq('id', id);

}
