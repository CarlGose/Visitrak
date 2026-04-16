const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const code = fs.readFileSync('src/supabaseClient.js', 'utf8');
  
  // Extract with regex
  let urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
  let keyMatch = code.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);
  
  // Try another format if not found
  if (!urlMatch) urlMatch = code.match(/VITE_SUPABASE_URL\s*['"]?([^'"]+)['"]?/);
  if (!keyMatch) keyMatch = code.match(/VITE_SUPABASE_ANON_KEY\s*['"]?([^'"]+)['"]?/);

  // Maybe they use process.env or import.meta.env, let's just fetch from VITE params if they exist
  const envContent = fs.readFileSync('.env', 'utf8').split('\n');
  let url = '';
  let key = '';
  for(let line of envContent) {
     if(line.includes('VITE_SUPABASE_URL')) url = line.split('=')[1].trim();
     if(line.includes('VITE_SUPABASE_ANON_KEY')) key = line.split('=')[1].trim();
  }

  if (urlMatch) url = urlMatch[1];
  if (keyMatch) key = keyMatch[1];

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('guards').select('*').limit(1);
  if(error) console.error(error);
  else console.log(Object.keys(data[0] || {}));
}

check();
