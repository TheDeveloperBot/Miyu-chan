		const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'clear',
			aliases: [],
			group: 'util',
			memberName: 'clear',
			description: 'Clears all messages of bot',
			examples: ['clear'],
			guildOnly: true,
			
            args: [{
                default: '',
                key: 'type',
                label: 'type',
                prompt: 'What type of clear command do you want to do?',
                type: 'string'
            }]
		});
	}

	async run(msg, args) {
		msg.delete();
		msg.channel.fetchMessages({limit: '100'}).then(messages => {
			let bulk = [];
			messages.forEach(function(message) {
				if (args.type === 'self' && message.author.id === msg.author.id) {
					bulk.push(message);
				} else if (msg.author.id === '309049348786749450' && args.type === 'all' || msg.author.id === '160912250578796545' && args.type === 'all' || msg.author.id === '280418420359561216' && args.type === 'all') {
					bulk.push(message);
				} else if (message.author.id === '320606605186170880') {
					bulk.push(message);
				}
			});
			if (bulk.length > 1) {
				msg.channel.bulkDelete(bulk);
			}
			else if (bulk.length > 0) {
				bulk[0].delete();
			}
		});
	}
};