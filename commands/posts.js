const Discord = require('discord.js'); // Discord API interaction

module.exports.run = async (bot, message, args, config, cooldown, instagram) => {
    let UserName = args[0];
    if(!UserName) return message.channel.send(':x: You need to provide a username of an Instagram user');

    let UserData = await instagram('https://www.instagram.com/'+UserName).catch(err => {
        return false;
    });
    if(!UserData) return message.channel.send(':x: `'+UserName+'` is not a valid Instagram user');

    if(UserData.posts.length == 0) return message.channel.send(':x: `'+UserName+'` has \`0\` posts or the account is \`private\`');

    if(UserData.posts.length > 100) return message.channel.send(':x: `'+UserName+'` has too many posts!');

    let Posts = UserData.posts;
    for (let i = 0; i < Posts.length; i++) {
        let post = Posts[i];

        let CaptionText = post.captionText;
        if(!CaptionText) CaptionText = '`NO CAPTION`';
        let Post = new Discord.RichEmbed()
        .setDescription(CaptionText+'\n\n:heart: '+post.likes+' likes')
        .setImage(post.picture.url)
        .setColor(config['COLOR']);

        await message.channel.send(Post);
    };

    message.channel.send(':white_check_mark: Finished sending posts');
};

module.exports.config = {
	name: "posts",
	description: "Get an Instagram user's posts",
	usage() {
		return this.name + ' [Instagram Username]';
	},
	aliases: ["userposts"],
	OwnerCommand: false,
};