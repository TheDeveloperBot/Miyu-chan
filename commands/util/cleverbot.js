const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: ['cb','clever'],
			group: 'util',
			memberName: 'cleverbot',
			description: 'Chat with CleverBot.',
			examples: ['cleverbot','cb'],
			guildOnly: true,

			args: [
				{
					key: 'ddd',
					label: 'ddd',
					prompt: 'Could you please tell me what do you want to say to CleverBot?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		talkbot.write(args.ddd, function (response) {
			return msg.channel.sendMessage(response.message);
		});

};
