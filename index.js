/*
--------------------
	MODULES
--------------------
*/

const fs = require('fs'); // File System -- Used for commands/Ticket transcripts
const Discord = require('discord.js'); // Discord API interaction
const instagram = require('user-instagram'); // Instagram API interaction



/*
--------------------
	UTILITIES
--------------------
*/
const config = require('./config.json');



/*
--------------------
	DISCORD CLIENT
--------------------
*/
const bot = new Discord.Client();
	  bot.commands = new Map();
	  bot.aliases  = new Map();

let cooldown = new Set();
setInterval(function() {
	cooldown.clear();
}, 3000);



/*
--------------------
	COMMAND HANDLER
--------------------
*/
fs.readdir('./commands', function(error, files) {
	if(error) throw new Error(error);
	files.forEach(file => {
		if(!file.endsWith('.js')) return;
		let CommandFile = require(`./commands/${file}`);
		let FileName = file.split('.')[0];

		bot.commands.set(FileName, CommandFile);
		CommandFile['config'].aliases.forEach(alias => {
			bot.aliases.set(alias, CommandFile['config'].name)
		});
	});
});

//Commands
bot.on('message', async function(message) {
	if(message.author.bot || message.channel.type == 'dm') return;

	let prefix = config['DEFAULT_PREFIX'];
	if(!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();

	let CommandFile;
	if (bot.commands.has(command)) {
    	CommandFile = bot.commands.get(command);
	} else if (bot.aliases.has(command)) {
		CommandFile = bot.commands.get(bot.aliases.get(command));
	};

	if(!CommandFile) return;
	if(CommandFile['config'].OwnerCommand && !config['SYSTEM_ADMIN_IDS'].includes(message.author.id)) return; // Return if not authed

	CommandFile.run(bot, message, args, config, cooldown, instagram); // Run command
});



/*
--------------------
	BOT EVENTS
--------------------
*/
bot.on('ready', function() {
	console.log(`${bot.user.username} is ready with ${bot.guilds.size} servers + ${bot.users.size} users`);

	/*
	ACTIVITY TYPES:
		PLAYING
		STREAMING
		LISTENING
		WATCHING
	*/
	bot.user.setActivity(config['DEFAULT_PREFIX']+'help | '+bot.guilds.size+' servers');
});



/*
--------------------
	CONNECT BOT
--------------------
*/
bot.login(config.TOKEN);