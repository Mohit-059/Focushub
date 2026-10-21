import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaxnjlvmleatujixiyst.supabase.co';
const supabaseAnonKey = 'sb_publishable_73d6GzHAvCOLQGj_XoL8Hg_AJ0SSUJA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);