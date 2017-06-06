const commando = require('discord.js-commando');
//const got = require('got');
//const request = require('request');
var rn = require('random-number');
var gen = rn.generator({
    min: 1,
    max: 4767,
    integer: true
});

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'ass',
            aliases: ['dupcia', 'ladna', 'ladnapani', 'dupa', 'sexi', 'ladnadupcia', 'ladnadupa', 'dupencja', 'dupeczka'],
            group: 'nsfw',
            memberName: 'ass',
            description: 'Displays a random Ass pictures.',
            examples: ['ass', 'dupa'],
            guildOnly: true,
        });
    }

    async run(msg) {
        msg.delete();
        if (!msg.channel.name.startsWith("nsfw-")) {
            return msg.reply('You must be so desperated to run NSFW command in NON NSFW channel.');
        }
        ass(msg);
    }
};

function ass(msg) {
    var data = gen();
    while ((data + "").length < 5) {
        data = "0" + data;
    }
    if (isCached(data)) {
        ass(msg);
        return;
    }
    cache(data);
    return msg.embed({
        color: 15473237,
        author: {
            name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
            icon_url: msg.author.displayAvatarURL
        },
		url: 'http://media.obutts.ru/butts_preview/' + data + '.jpg',
        image: {
            url: 'http://media.obutts.ru/butts_preview/' + data + '.jpg'
        }
    });
    /*got('http://api.oboobs.ru/noise/1/')
    	.then(response => {
    		const json = JSON.parse(response.body);
    		const img = json["0"]["preview"];
    		return msg.embed({
    			color: 3447003,
    			author: {
    				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
    				icon_url: msg.author.displayAvatarURL
    			},
    			image: { url: 'http://media.oboobs.ru/'+img }
    		});
    	})
    	.catch(error => {
    		console.log(error.response.body);
    	});*/
}

let map = [];

function cache(number) {
    map[number] = 'used';
}

function isCached(number) {
    return number in map;
}