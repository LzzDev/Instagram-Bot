const Discord = require('discord.js'); // Discord API interaction

module.exports.run = async (bot, message, args, config, cooldown, instagram) => {
    let UserName = args[0];
    if(!UserName) return message.channel.send(':x: You need to provide a username of an Instagram user');

    let UserData = await instagram('https://www.instagram.com/'+UserName).catch(err => {
        return false;
    });
    if(!UserData) return message.channel.send(':x: `'+UserName+'` is not a valid Instagram user');

    let Info = new Discord.RichEmbed()
    .setTitle(UserData.username+' - Information')
    .addField('Posts', UserData.postCount, true)
    .addField('Followers', UserData.subscriberCount, true)
    .addField('Following', UserData.subscribtions, true)
    .addField('Full name', UserData.fullName || 'N/A', true)
    .addField('Private', UserData.isPrivate, true)
    .addField('Verified', UserData.isVerified, true)
    .addField('Bio', UserData.bio || 'N/A', true)
    .setThumbnail(UserData.avatarHD)
    .setColor(config['COLOR'])

    message.channel.send(Info);
};

module.exports.config = {
	name: "userinfo",
	description: "Get an Instagram user's information",
	usage() {
		return this.name + ' [Instagram Username]';
	},
	aliases: ["userinfo", "lookup"],
	OwnerCommand: false,
};