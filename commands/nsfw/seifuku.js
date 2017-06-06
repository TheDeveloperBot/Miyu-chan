const commando = require('discord.js-commando');
var unirest = require('unirest')
var rn = require('random-number');
var gen31 = rn.generator({
    min: 1,
    max: 31,
    integer: true
});
var gen45 = rn.generator({
    min: 1,
    max: 45,
    integer: true
});
var gen72 = rn.generator({
    min: 1,
    max: 72,
    integer: true
});
var gen123 = rn.generator({
    min: 1,
    max: 123,
    integer: true
});
var gen180 = rn.generator({
    min: 1,
    max: 180,
    integer: true
});
var gen835 = rn.generator({
    min: 1,
    max: 835,
    integer: true
});

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'seifuku',
            aliases: [],
            group: 'nsfw',
            memberName: 'seifuku',
            description: 'Search seifuku pictures',
            examples: ['seifuku', 'seifuku nsfw'],
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
        if (!msg.channel.name.startsWith("nsfw-")) {
            return msg.reply('You must be so desperated to run NSFW command in NON NSFW channel.');
        }
        if (msg.channel.name.startsWith("nsfw-") && msg.client.autonsfw && args.nsfw === '') {
            args.nsfw = 'nsfw';
        }
        seifuku(msg, args);
    }
};

function seifuku(msg, args) {
    //Safe for work
    if (args.nsfw === '') {
		const url = 'http://konachan.net/post.xml?tags=seifuku&page=' + gen835();
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching seifuku') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                seifuku(msg, args);
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
        let url = '';
        switch (args.nsfw) {
            case "pussy":
                url = 'http://konachan.com/post.xml?tags=pussy+seifuku&page=' + gen45();
                break;
            case "breasts":
                url = 'http://konachan.com/post.xml?tags=breasts+seifuku&page=' + gen123();
                break;
            case "underwear":
                url = 'http://konachan.com/post.xml?tags=underwear+seifuku&page=' + gen180();
                break;
            case "2girls":
                url = 'http://konachan.com/post.xml?tags=2girls+seifuku&page=' + gen72();
                break;
            default:
                url = 'http://konachan.com/post.xml?tags=seifuku&page=' + gen835();
                break;
        }
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching seifuku') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                seifuku(msg, args);
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