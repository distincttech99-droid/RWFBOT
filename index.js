import './src/app.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { BotConfig } from './bot.js'; // This links it to your settings file

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// THIS IS THE BRAIN
client.on('guildMemberAdd', async (member) => {
    try {
        await fetch('https://kwuwcenkwixegdtbqkjo.supabase.co/functions/v1/discord-set-nickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DISCORD_WEBHOOK_SECRET}` 
            },
            body: JSON.stringify({ user_id: member.id, guild_id: member.guild.id })
        });
    } catch (error) {
        console.error("Failed to connect to Lovable:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
