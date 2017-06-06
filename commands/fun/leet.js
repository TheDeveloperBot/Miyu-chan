const commando = require('discord.js-commando');
var leetspeak = require('leetspeak')

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'leet',
			aliases: ['1337'],
			group: 'fun',
			memberName: 'leet',
			description: '1\'Ll 3nc0d3 Y0uR Me5s@g3 1Nt0 l337sp3@K!',
			examples: ['leet','1337'],
			guildOnly: true,
			
			args: [
				{
					key: 'ddd',
					label: 'ddd',
					prompt: 'Could you please tell me what do you want to translate to Leet?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		msg.reply(leetspeak(args.ddd));
	}
};