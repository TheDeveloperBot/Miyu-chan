const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['inv'],
			group: 'util',
			memberName: 'invite',
			description: 'Displays invite link of bot.',
			examples: ['invite', 'inv'],
			guildOnly: true
		});
	}

	async run(msg) {
		msg.channel.sendMessage('https://discordapp.com/oauth2/authorize?&client_id=320606605186170880&scope=bot');
	}
};