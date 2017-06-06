const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'author',
			aliases: ['autor','tpaccus','tpacce'],
			group: 'util',
			memberName: 'author',
			description: 'Displays author of bot.',
			examples: ['author', 'tpaccus'],
			guildOnly: true
		});
	}

	async run(msg) {
		msg.channel.sendMessage('❤❤❤KOCHAM TPACCUSIA TO MOJ BOG I STWORCA!!!');
	}
};