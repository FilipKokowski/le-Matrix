import { createClient } from "@supabase/supabase-js";

import { Tile } from "./App";

const supabase = createClient("https://xujfzrydvpziizkztbjp.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amZ6cnlkdnB6aWl6a3p0YmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNDQwNTUsImV4cCI6MjAyNjcyMDA1NX0.ikspwER5xHsaSPIkO67P-XOzCPNjIaLMDa7o5dCa608");

export async function getCode(code){
    const { data } = await supabase.from('system').select().eq('code', code);
  
    return data;
}

export async function getPowerState(code){
    const { data } = await supabase.from('system').select().eq('code', code);
    
    return data[0]['powerOn'];
}

export async function setPowerState(code, state){

    console.log(code + "   " + state);

    await supabase.from('system').update({powerOn: state}).eq('code', code);   
}

export async function clearDB(code){
    await supabase.from('boards').delete().eq('code', code);
}

export async function getDBBoards(code, editable){

    let {data} = await supabase.from('boards').select().eq('code', code);

    let boards = [];

    data.forEach(element => {
        let board = [];
        Object.entries(JSON.parse(element['board'])).forEach((entry) => {
            const [key, value] = entry;
            //console.log(`${(isNaN(key)) ? 255 : key}: ${value}`);
            if(!isNaN(key))
                board.push(<Tile key={key} text={key} c={value} editable={editable} size={window.innerHeight / 100}/>)
        });
        boards.push(board);
    });

    return boards;

}
