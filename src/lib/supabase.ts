import { createClient } from '@supabase/supabase-js'

// Both values are public by design: they ship to every visitor's browser.
// What the key can do is limited by Row Level Security in the database.
// Never put the secret (service role) key here.
export const SUPABASE_URL = 'https://qbikujozfytbaqnennxx.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_zZnXC2IoCXQAPG71pe8gdg_Wl5jWN3Q'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
