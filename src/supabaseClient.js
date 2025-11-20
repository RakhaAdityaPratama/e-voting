import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hsiryfjbckzpxsizcddp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzaXJ5ZmpiY2t6cHhzaXpjZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTA0NjIsImV4cCI6MjA3OTA4NjQ2Mn0.jlbC9sOG7Zki0pXxGwzMP9wq8eA-3wXna61MQ1639zo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
})
