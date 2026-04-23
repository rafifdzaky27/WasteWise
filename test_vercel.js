const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://lpefgsrvdjcjacwkxgoq.supabase.co', 'sb_publishable_70URDsf5TpY-g4kZyFjVTA_vtYU6oD_');

async function testVercel() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'pradipta@gmail.com',
    password: 'admin123',
  });
  
  const token = authData.session.access_token;
  const refreshToken = authData.session.refresh_token;
  
  // Create base64 encoded string format used by standard Supabase SSR
  const sessionStr = JSON.stringify({
    access_token: token,
    refresh_token: refreshToken
  });
  const cookieValue = Buffer.from(sessionStr).toString('base64');
  
  const res = await fetch('https://waste-wise-rosy.vercel.app/api/deposits', {
    headers: {
      'Cookie': `sb-lpefgsrvdjcjacwkxgoq-auth-token=${cookieValue}`
    }
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
testVercel();
