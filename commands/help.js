const Discord = require('discord.js'); // Discord API interaction

module.exports.run = async (bot, message, args, config, cooldown, instagram) => {
	let prefix = config['DEFAULT_PREFIX'];
	let PreviewCommand = args[0];

	let CommandsDesc = "";
	bot.commands.forEach(command => {
        command = command['config'];

		if(command.OwnerCommand && !config['SYSTEM_ADMIN_IDS'].includes(message.author.id)) return; // Return if not authed so it wont display
		let CommandName = prefix + command.name;
		let CommandDesc = command.description;

        CommandsDesc += `**${CommandName}** - ${CommandDesc}\n\n`;
	});

	let HelpEmbed = new Discord.RichEmbed()
    .setAuthor(bot.user.username + ' help', bot.user.avatarURL)
    .setDescription(CommandsDesc)
    .setFooter(prefix + 'help [command] for more detail')
    .setTimestamp()
    .setColor(config['COLOR']);

    if(!PreviewCommand) return message.channel.send(HelpEmbed);

    let PreviewingCommand;

    if (bot.commands.has(PreviewCommand)) {
    	PreviewingCommand = bot.commands.get(PreviewCommand);
    } else if (bot.aliases.has(PreviewCommand)) {
    	PreviewingCommand = bot.commands.get(bot.aliases.get(PreviewCommand));
    };
    CommandConfig = PreviewingCommand['config'];

    if(CommandConfig.OwnerCommand && !config['SYSTEM_ADMIN_IDS'].includes(message.author.id)) return message.channel.send(HelpEmbed);

    let CommandAliases = CommandConfig.aliases;
    if(CommandAliases.length === 0) {
    	CommandAliases = "N/A"
    } else {
    	CommandAliases = CommandAliases.join('`, `')
    };
    CommandsDesc = "";
    CommandsDesc += `**${prefix}${CommandConfig.name}** - ${CommandConfig.description}

    Usage: \`${prefix}${CommandConfig.usage()}\`

    Aliases: \`${CommandAliases}\``;

    let PreviewEmbed = new Discord.RichEmbed()
    .setAuthor(bot.user.username + ' help', bot.user.avatarURL)
    .setDescription(CommandsDesc)
    .setColor(config['COLOR']);

    message.channel.send(PreviewEmbed);
};

module.exports.config = {
	name: "help",
	description: "Display a list of commands",
	usage() {
		return this.name;
	},
	aliases: ["commands"],
	OwnerCommand: false,
	PremiumCommand : false
};