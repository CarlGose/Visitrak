const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    console.log("Buckets:", data);
    console.log("Error:", error);
    
    // Attempt to create 'visitor_ids' bucket if not exists
    if (data && !data.find(b => b.name === 'visitor_ids')) {
        const { data: createData, error: createError } = await supabase.storage.createBucket('visitor_ids', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
            fileSizeLimit: 5242880
        });
        console.log("Create Bucket:", createData);
        console.log("Create Error:", createError);
    }
}
checkBuckets();
