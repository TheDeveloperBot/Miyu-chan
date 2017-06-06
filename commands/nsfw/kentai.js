const commando = require('discord.js-commando');
var unirest = require('unirest')
var rn = require('random-number');
var gen13 = rn.generator({
    min: 1,
    max: 13,
    integer: true
});
var gen31 = rn.generator({
    min: 1,
    max: 31,
    integer: true
});
var gen43 = rn.generator({
    min: 1,
    max: 43,
    integer: true
});
var gen76 = rn.generator({
    min: 1,
    max: 76,
    integer: true
});
var gen230 = rn.generator({
    min: 1,
    max: 230,
    integer: true
});

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'kentai',
            aliases: [],
            group: 'nsfw',
            memberName: 'kentai',
            description: 'Search kentai pictures',
            examples: ['kentai', 'kentai nsfw'],
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
        kentai(msg, args);
    }
};

function kentai(msg, args) {
    //Safe for work
    if (args.nsfw === '') {
		const url = 'http://konachan.net/post.xml?tags=kantai_collection&page=' + gen230();
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching kentai') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                kentai(msg, args);
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
        let url = '';
        switch (args.nsfw) {
            case "pussy":
                url = 'http://konachan.com/post.xml?tags=pussy+kantai_collection&page=' + gen13();
                break;
            case "breasts":
                url = 'http://konachan.com/post.xml?tags=breasts+kantai_collection&page=' + gen76();
                break;
            case "underwear":
                url = 'http://konachan.com/post.xml?tags=underwear+kantai_collection&page=' + gen43();
                break;
            case "2girls":
                url = 'http://konachan.com/post.xml?tags=2girls+kantai_collection&page=' + gen31();
                break;
            default:
                url = 'http://konachan.com/post.xml?tags=kantai_collection&page=' + gen230();
                break;
        }
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching kentai') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                kentai(msg, args);
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