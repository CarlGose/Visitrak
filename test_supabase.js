import { supabase } from './src/supabaseClient.js';

async function testSupabase() {
    console.log("Testing Supabase Storage...");
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    console.log("Buckets:", buckets, "Error:", listError);
    
    const file = new Blob(['Hello, world!'], { type: 'text/plain' });
    const { data, error } = await supabase.storage.from('visitor_ids').upload('test.txt', file);
    console.log("Upload result:", data, "Error:", error);
}

testSupabase();
