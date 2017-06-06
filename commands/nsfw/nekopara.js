const commando = require('discord.js-commando');
var unirest = require('unirest')
var rn = require('random-number');
var gen9 = rn.generator({
    min: 1,
    max: 9,
    integer: true
});

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'nekopara',
            aliases: ['neko'],
            group: 'nsfw',
            memberName: 'nekopara',
            description: 'Search nekopara pictures',
            examples: ['nekopara', 'neko nsfw'],
            guildOnly: true,

            args: [{
                default: '',
                key: 'nsfw',
                label: 'nsfw',
                prompt: 'Would you want to see NSFW pictures?',
                type: 'string'
            }]
        });
    }

    async run(msg, args) {
        msg.delete();
        if (msg.channel.name.startsWith("nsfw-") && msg.client.autonsfw && args.nsfw === '') {
            args.nsfw = 'nsfw';
        }
        nekopara(msg, args);
    }
};

function nekopara(msg, args) {
    //Safe for work
    if (args.nsfw === '') {
		const url = 'http://konachan.net/post.xml?tags=nekopara&page=' + gen9();
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching nekopara') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                nekopara(msg, args);
                                return;
                            }
                            cache(url, count);
                            return msg.embed({
                                color: 16716947,
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
    } /*NOT SAFE FOR WORK*/
    else {
        if (!msg.channel.name.startsWith("nsfw-")) {
            return msg.reply('You must be so desperated to run NSFW command in NON NSFW channel.');
        }
		const url = 'http://konachan.net/post.xml?tags=nekopara&page=' + gen9();
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching nekopara') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                nekopara(msg, args);
                                return;
                            }
                            cache(url, count);
                            return msg.embed({
                                color: 16716947,
                                author: {
                                    name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                                    icon_url: msg.author.displayAvatarURL
                                },
                                title: 'NSFW - NOT SAFE FOR WORK',
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