const config = require('../utils/config');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(config.supabase.url, config.supabase.apiKey);

const checkSupabaseConn = async () => {
  
  try{
    const {data, error} = await supabase
    .from('tbl_handbook')
    .select('id')
    .limit(1)
    .maybeSingle();

    if(error) throw error;

    return {
      status: 'connected',
      responseTime: 'healthy'
    }

  }catch(error) {
    return {
      status: 'error',
      responseTime: 'error.message'
    }
  }

}

module.exports = { checkSupabaseConn }