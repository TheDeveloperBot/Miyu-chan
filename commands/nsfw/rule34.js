const commando = require('discord.js-commando');
var unirest = require('unirest')

module.exports = class ChannelCommand extends commando.Command {
	
	constructor(client) {
		super(client, {
			name: 'rule34',
			aliases: ['r34','34'],
			group: 'nsfw',
			memberName: 'rule34',
			description: 'Search porn for you!',
			examples: ['rule34','r34'],
			guildOnly: true,
			
			args: [
				{
					default: '',
					key: 'ddd',
					label: 'ddd',
					prompt: 'Could you please tell me what do you want to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		msg.delete();
		if (!msg.channel.name.startsWith("nsfw-")) {
			return msg.reply('You must be so desperated to run NSFW command in NON NSFW channel.');
		}
		unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + args.ddd) // Fetching 100 rule34 pics
		  .end(function (result) {
			var xml2js = require('xml2js')
			if (result.body.length < 75) {
			  msg.reply(':broken_heart: Unfortunately, I couldn\'t find rule34 matching '+args.ddd) // Correct me if it's wrong.
			} else {
			  xml2js.parseString(result.body, (err, reply) => {
				if (err) {
				  msg.channel.sendMessage('The API returned an unconventional response.')
				} else {
				  var count = Math.floor((Math.random() * reply.posts.post.length))
					return msg.embed({
						color: 15473237,
						author: {
							name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
							icon_url: msg.author.displayAvatarURL
						},
						title: 'NSFW - NOT SAFE FOR WORK',
						url: 'http:' + reply.posts.post[count].$.file_url,
						image: { url: 'http:' + reply.posts.post[count].$.file_url }
					});
				}
			  })
			}
		})
	}
};