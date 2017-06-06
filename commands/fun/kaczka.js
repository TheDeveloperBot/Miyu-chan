const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'kaczka',
			aliases: ['sexipan','rudy','mokry','mokryleb','ciapak','ciapaty','noob','idiota','debil','cipa','chuj','cymbal','pedal','gej','cipka'],
			group: 'fun',
			memberName: 'kaczka',
			description: 'Displays pictures of Kaczka',
			examples: ['kaczka','mokry'],
			guildOnly: true
		});
	}

	async run(msg) {
		msg.delete();
		return msg.embed({
			color: 3447003,
			author: {
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				icon_url: msg.author.displayAvatarURL
			},
			image: { url: 'https://cdn.discordapp.com/attachments/302583813517869057/320722284207800321/13001279_171724276554429_7123140405869977782_n.jpg'					}
		});
	}
};