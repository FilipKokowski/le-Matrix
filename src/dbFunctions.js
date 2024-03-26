import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://xujfzrydvpziizkztbjp.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amZ6cnlkdnB6aWl6a3p0YmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExNDQwNTUsImV4cCI6MjAyNjcyMDA1NX0.ikspwER5xHsaSPIkO67P-XOzCPNjIaLMDa7o5dCa608");

export async function getCode(){
    const { data } = await supabase.from('boards').select().eq('code', document.getElementById('code').value);
  
    return data;
}

export async function getPowerState(code){
    const { data } = await supabase.from('system').select().eq('code', code);
    
    return data[0]['powerOn'];
}

export async function clearDB(code){
    await supabase.from('boards').delete().eq('code', code);
}
