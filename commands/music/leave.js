const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['exit','stop','exit'],
			group: 'music',
			memberName: 'leave',
			description: 'Leave voice channel and stop music.',
			examples: ['leave','stop'],
			guildOnly: true,
		});
	}

	async run(msg) {
		msg.delete();
		if (!msg.guild.voiceConnection) {
			return msg.reply(':broken_heart: You didn\'t add me to a voice channel yet, baka! ｡゜(｀Д´)゜｡');
		}
		if (!msg.member.voiceChannel) {
			return msg.reply(':broken_heart: You have to be in a voice channel to remove me, baka! ｡゜(｀Д´)゜｡');
		}
		const voiceConnection = msg.guild.voiceConnection;
			
		// End the stream and disconnect.
		if (voiceConnection.player.dispatcher) { //TODO Do I fixed it?
			voiceConnection.player.dispatcher.end();
		}
		voiceConnection.disconnect();
		msg.channel.sendMessage(`I will stop streaming to your server now, ${msg.author}-san. (-ω-、)`);
	}
};