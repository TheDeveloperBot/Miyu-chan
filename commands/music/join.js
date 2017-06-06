const commando = require('discord.js-commando');
const WebSocket = require('ws');

const stream = 'http://listen.moe:9999/stream';
const streamOptions = { seek: 0, volume: 1 };

let ws;
let radioJSON;

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['music','play'],
			group: 'music',
			memberName: 'join',
			description: 'Play Listen.MOE',
			examples: ['join','music'],
			guildOnly: true,
		});
		connectWS(client,'wss://listen.moe/api/v2/socket');
	}

	async run(msg) {
		msg.delete();
		const voiceChannel = msg.member.voiceChannel;
		if (voiceChannel && voiceChannel.type === 'voice') {
			const nowplaying = `${radioJSON.artist_name ? `${radioJSON.artist_name} - ` : ''}${radioJSON.song_name}`;
			const anime = radioJSON.anime_name ? `Anime: ${radioJSON.anime_name}` : '';
			const requestedBy = radioJSON.requested_by ? `Requested by: [${radioJSON.requested_by}](https://forum.listen.moe/u/${radioJSON.requested_by})` : '';
			const song = `${nowplaying}\n\n${anime}\n${requestedBy}`;

			voiceChannel.join()
			  .then(connection => {
				  let dispatcher = connection.playStream(stream, streamOptions);
			  })
			.catch(console.error);
			return msg.channel.send({embed: {
				color: 15473237,
				author: {
				  name: msg.member.username,
				  icon_url: msg.member.avatarURL
				},
				title: 'LISTEN.moe (Click here to add the radio bot to your server)',
				url: 'https://discordapp.com/oauth2/authorize?&client_id=320606605186170880&scope=bot&permissions=36702208',
				//description: 'This is a test embed to showcase what they look like and what they can do.',
				fields: [
					{ name: 'Now playing', value: song },
					{ name: 'Radio Listeners', value: radioJSON.listeners, inline: true }
				],
				timestamp: new Date(),
				footer: {
				  icon_url: msg.member.avatarURL,
				  text: '© Miyu-chan'
				},
				thumbnail: { url: 'http://i.imgur.com/Jfz6qak.png' }
			  }
			});
		}
		else {
			msg.reply('You need to be in voice channel first!');
		}
	}
	
	

};

function connectWS(client,info) {
	if (ws) ws.removeAllListeners();
	try {
		ws = new WebSocket(info);
		console.log(`WEBSOCKET: Connection A-OK!`);
	} catch (error) {
		setTimeout(() => connectWS(client,info), 3000);
		console.log(`WEBSOCKET: Couldn't connect, reconnecting...`);
	}

	ws.on('message', data => {
		try {
			if (data) {
				radioJSON = JSON.parse(data);
				client.radioJSON = radioJSON;
			}
		} catch (error) {
			console.log(error);
		}
	});
	ws.on('close', () => {
		setTimeout(() => connectWS(client,info), 3000);
		console.log(`WEBSOCKET: Connection closed, reconnecting...`);
	});
	ws.on('error', console.log);
}
