const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'lenny',
			aliases: ['lenny'],
			group: 'util',
			memberName: 'lenny',
			description: 'Displays lenny face.',
			examples: ['lenny'],
			guildOnly: true
		});
	}

	async run(msg) {
		msg.delete();
		msg.channel.sendMessage('( ͡° ͜ʖ ͡°)');
	}
};