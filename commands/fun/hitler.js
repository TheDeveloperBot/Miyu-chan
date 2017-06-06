const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'hitler',
			aliases: ['hail','hailhitla','hailhitler','hitla'],
			group: 'fun',
			memberName: 'hitler',
			description: 'Displays fun hitler picture.',
			examples: ['hitler','hail'],
			guildOnly: true
		});
	}

	async run(msg) {
		return msg.embed({
			color: 3447003,
			author: {
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				icon_url: msg.author.displayAvatarURL
			},
			image: { url: 'https://img-9gag-fun.9cache.com/photo/aOmDrpE_700b.jpg' }
		});
	}
};