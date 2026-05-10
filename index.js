// REPLACE THE FIRST 10 LINES WITH THIS:
import http from 'node:http';

const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('RWF Bot is Active');
}).listen(port, '0.0.0.0'); // Adding '0.0.0.0' helps Railway find it faster

console.log(`[Railway] Health check server listening on port ${port}`);
import { Client, GatewayIntentBits } from 'discord.js';
//import { botConfig } from './src/config/bot.js'; // This imports your settings like colors and presence

// 1. Initialize the Bot with permissions to see members
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers // Required to see people joining
    ]
});

// 2. The "Ready" Event - Tells you in Railway logs if the bot is alive
client.once('ready', () => {
    console.log(`✅ RWF Bot is online as ${client.user.tag}`);
});

// 3. THE NICKNAME LOGIC - This runs when a user joins
client.on('guildMemberAdd', async (member) => {
    console.log(`[RWF] New member detected: ${member.user.tag}. Checking database...`);

    try {
        const response = await fetch('https://kwuwcenkwixegdtbqkjo.supabase.co/functions/v1/discord-set-nickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // This uses the Secret you set in both Lovable and Railway
                'Authorization': `Bearer ${process.env.DISCORD_WEBHOOK_SECRET}` 
            },
            body: JSON.stringify({
                user_id: member.id,
                guild_id: member.guild.id
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log(`[RWF] Success! Nickname set to: ${result.nickname}`);
        } else {
            console.error(`[RWF] Backend error: ${result.error}`);
        }
    } catch (error) {
        console.error("[RWF] Could not reach Lovable Edge Function:", error);
    }
});

// 4. Start the bot using the token from Railway Variables
client.login(process.env.DISCORD_TOKEN);

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
        console.log(`Pinging Lovable for new member: ${member.user.tag}`);
    } catch (error) {
        console.error("Failed to ping Lovable:", error);
    }
});
