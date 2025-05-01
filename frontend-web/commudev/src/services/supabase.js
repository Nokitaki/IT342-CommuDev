// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key from the Supabase dashboard
// Replace these with your actual project values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tnsexcbnhyhvbiwasppj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc2V4Y2JuaHlodmJpd2FzcHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDI5MTQsImV4cCI6MjA1OTAxODkxNH0.1npcQHaSu7Ls6u5xRoR4L3ugUG52xHIZuwOhK4Cgpws';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      // Include your JWT auth token for RLS policies
      get Authorization() {
        const token = localStorage.getItem('token');
        if (token) {
          return `Bearer ${token}`;
        }
        return undefined;
      }
    }
  }
});

// Helper function to check if Supabase connection is working
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_presence').select('count', { count: 'exact', head: true });
    
    if (error) {
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

// Automatically test connection when this module is imported
testSupabaseConnection();

export default supabase;