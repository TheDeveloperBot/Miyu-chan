const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'nowplaying',
			aliases: ['np'],
			group: 'music',
			memberName: 'nowplaying',
			description: 'Displays now playing music.',
			examples: ['nowplaying','np'],
			guildOnly: true,
		});
	}

	async run(msg) {
		msg.delete();
		if (!msg.guild.voiceConnection) {
			return msg.reply(':broken_heart: You didn\'t add me to a voice channel yet, baka! ｡゜(｀Д´)゜｡');
		}
		const nowplaying = `${msg.client.radioJSON.artist_name ? `${msg.client.radioJSON.artist_name} - ` : ''}${msg.client.radioJSON.song_name}`;
		const anime = msg.client.radioJSON.anime_name ? `Anime: ${msg.client.radioJSON.anime_name}` : '';
		const requestedBy = msg.client.radioJSON.requested_by ? `Requested by: [${msg.client.radioJSON.requested_by}](https://forum.listen.moe/u/${msg.client.radioJSON.requested_by})` : '';
		const song = `${nowplaying}\n\n${anime}\n${requestedBy}`;

		return msg.channel.sendEmbed({
			color: 15473237,
			fields: [{ name: 'Now playing', value: song }]
		});
	}
};

