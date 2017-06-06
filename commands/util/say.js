const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['tell','powiedz'],
			group: 'util',
			memberName: 'say',
			description: 'Says a phrase you want to.',
			examples: ['say siema eniu','tell Hi!'],
			guildOnly: true,
			
			args: [
				{
					default: '',
					key: 'text',
					label: 'text',
					prompt: 'Could you please tell me what would you want me to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		if (msg.message.author.id === '309049348786749450' || msg.message.author.id === '160912250578796545' || msg.message.author.id === '280418420359561216') {
			msg.message.delete();
			msg.channel.sendMessage(args.text);
		}
	}
};