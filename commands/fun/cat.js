const commando = require('discord.js-commando');
const got = require('got');
const request = require('request');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['cat','kotek','kotel','kotelek','kicia','kici','koteg'],
			group: 'fun',
			memberName: 'cat',
			description: 'Displays random Cat picture.',
			examples: ['cat','kotel'],
			guildOnly: true
		});
	}

	async run(msg) {
		got('http://random.cat/meow')
			.then(response => {
				const json = JSON.parse(response.body);
				const img = json["file"];
				return msg.embed({
					color: 3447003,
					author: {
						name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
						icon_url: msg.author.displayAvatarURL
					},
					image: { url: img }
				});
			})
			.catch(error => {
				console.log(error.response.body);
			});
	}
};