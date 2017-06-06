const commando = require('discord.js-commando');
const got = require('got');
const request = require('request');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'dog',
			aliases: ['dog','piesek','piesel','pieseg'],
			group: 'fun',
			memberName: 'dog',
			description: 'Displays random Dog picture.',
			examples: ['dog','piesel'],
			guildOnly: true
		});
	}

	async run(msg) {
		got('http://random.dog/woof')
			.then(response => {
				return msg.embed({
					color: 3447003,
					author: {
						name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
						icon_url: msg.author.displayAvatarURL
					},
					image: { url: 'https://random.dog/'+response.body }
				});
			})
			.catch(error => {
				console.log(error.response.body);
			});
	}
};