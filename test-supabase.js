import { createClient } from '@supabase/supabase-js';

// Test Supabase connection
const supabaseUrl = 'https://wutntfsizmxmjhhgduew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dG50ZnNpem14bWpoaGdkdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTMxMjksImV4cCI6MjA5Mzk4OTEyOX0._ndlqSN1ujOOhgHxtmb01RhPsq-KBmX9QDPiH3ZHZLw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test basic connection
    const { data, error } = await supabase.from('modules').select('count').single();

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Modules count:', data);

    // Test auth
    console.log('Testing auth configuration...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Current session:', session ? 'Active' : 'None');

    return true;
  } catch (err) {
    console.error('❌ Test failed:', err);
    return false;
  }
}

testConnection();