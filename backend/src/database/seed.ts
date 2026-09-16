import { supabase } from '../config/supabase.js';
import { logger } from '../app.js';

export async function ensureDefaultSetup(): Promise<{ orgId: string, botId: string } | null> {
  try {
    // 1. Check for existing organization
    let { data: org } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single();

    if (!org) {
      logger.info('No organization found. Creating default organization...');
      const { data: newOrg, error } = await supabase
        .from('organizations')
        .insert([{ name: 'AIG Hospital' }])
        .select('id')
        .single();
      
      if (error) throw error;
      org = newOrg;
    }

    // 2. Check for existing bot instance
    let { data: bot } = await supabase
      .from('bot_instances')
      .select('id')
      .eq('organization_id', org.id)
      .limit(1)
      .single();

    if (!bot) {
      logger.info('No bot instance found. Creating default bot...');
      const { data: newBot, error } = await supabase
        .from('bot_instances')
        .insert([{ organization_id: org.id, name: 'AIG Main Bot' }])
        .select('id')
        .single();
      
      if (error) throw error;
      bot = newBot;
    }

    return { orgId: org.id, botId: bot.id };
  } catch (error) {
    logger.error({ err: error }, 'Failed to ensure default setup in DB');
    return null;
  }
}
