const commando = require('discord.js-commando');
var unirest = require('unirest')
var rn = require('random-number');
var gen96 = rn.generator({
    min: 1,
    max: 96,
    integer: true
});

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'yuri',
            aliases: [],
            group: 'nsfw',
            memberName: 'yuri',
            description: 'Displays a random Yuri picture.',
            examples: ['yuri'],
            guildOnly: true,
        });
    }

    async run(msg) {
        msg.delete();
        if (!msg.channel.name.startsWith("nsfw-")) {
            return msg.reply('You must be so desperated to run NSFW command in NON NSFW channel.');
        }
        yuri(msg);
    }
};

function yuri(msg) {
	const url = 'http://konachan.com/post.xml?tags=yuri&page=' + gen96();
    unirest.get(url) // Fetching 100 yuri pics
        .end(function(result) {
            var xml2js = require('xml2js')
            if (result.body.length < 75) {
                msg.reply('sorry, nothing found.') // Correct me if it's wrong.
            } else {
                xml2js.parseString(result.body, (err, reply) => {
                    if (err) {
                        msg.channel.sendMessage('The API returned an unconventional response.')
                    } else {
                        var count = Math.floor((Math.random() * reply.posts.post.length))
                        if (isCached(url, count)) {
                            yuri(msg);
                            return;
                        }
                        cache(url, count);
                        return msg.embed({
                            color: 15473237,
                            author: {
                                name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                                icon_url: msg.author.displayAvatarURL
                            },
                            url: 'http:' + reply.posts.post[count].$.file_url,
                            image: {
                                url: 'http:' + reply.posts.post[count].$.file_url
                            }
                        });
                    }
                })
            }
        })
}

let map = [];

function cache(page, number) {
    if (!(page.split('=').pop() in map)) {
        map[page.split('=').pop()] = [];
    }
    map[page.split('=').pop()][number] = 'used';
    //console.log("cache " + page.split('=').pop() + " #" + number);
}

function isCached(page, number) {
    if (!(page.split('=').pop() in map)) {
        return false;
    }
    //console.log("isCached " + !(map[page.split('=').pop()][number] === undefined));
    return !(map[page.split('=').pop()][number] === undefined);
}