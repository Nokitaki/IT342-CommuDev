// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key from the Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tnsexcbnhyhvbiwasppj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc2V4Y2JuaHlodmJpd2FzcHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDI5MTQsImV4cCI6MjA1OTAxODkxNH0.1npcQHaSu7Ls6u5xRoR4L3ugUG52xHIZuwOhK4Cgpws';

// Create a Supabase client with simple configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase connection is working
export const testSupabaseConnection = async () => {
  try {
    // Try a simpler test that won't require specific tables or auth
    const { data, error } = await supabase
      .from('user_presence')
      .select('*')
      .limit(1);
    
    // If there's an error but it's just that the table doesn't exist, that's still a success
    // (just means connection works but that specific table doesn't exist)
    if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      console.log('✅ Supabase connection successful (table doesn\'t exist but connection works)');
      return true;
    } else if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Cannot connect to Supabase:', error);
    return false;
  }
};

// Check if we should use Supabase at all
export const canUseSupabaseStorage = async () => {
  try {
    // Check if bucket exists
    const { data, error } = await supabase.storage.getBucket('chat-images');
    
    if (error) {
      console.log('Cannot use Supabase storage:', error.message);
      return false;
    }
    
    // Try to access the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('chat-images')
      .list('test', { limit: 1 });
      
    if (filesError && filesError.message.includes('permission')) {
      console.log('No permission to use Supabase storage');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Supabase storage:', error);
    return false;
  }
};

export default supabase;