const commando = require('discord.js-commando');
//const got = require('got');
//const request = require('request');
var unirest = require('unirest')
var rn = require('random-number');
var gen6 = rn.generator({
    min: 1,
    max: 6,
    integer: true
});
var gen10 = rn.generator({
    min: 1,
    max: 10,
    integer: true
});
var gen27 = rn.generator({
    min: 1,
    max: 27,
    integer: true
});
var gen41 = rn.generator({
    min: 1,
    max: 41,
    integer: true
});
var gen225 = rn.generator({
    min: 1,
    max: 225,
    integer: true
});

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'catgirl',
            aliases: ['catgirls', 'cg'],
            group: 'nsfw',
            memberName: 'catgirl',
            description: 'Displays random Cat Girl picture.',
            examples: ['catgirl', 'cg nsfw', 'cg pussy', 'cg pussy tail', 'cg breasts'],
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
        catgirl(msg, args);
    }
};

function catgirl(msg, args) {
    //Safe for work
    if (args.nsfw === '') {
        unirest.post('http://konachan.net/post.xml?tags=catgirl+nekomimi&page=' + gen225())
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching catgirl/nekomimi') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                catgirl(msg, args);
                                return;
                            }
                            cache(url, count);
                            return msg.embed({
                                color: 3447003,
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
            case "pussy tail":
                url = 'http://konachan.com/post.xml?tags=pussy+tail+catgirl&page=' + gen6();
                break;
            case "pussy":
                url = 'http://konachan.com/post.xml?tags=pussy+catgirl&page=' + gen10();
                break;
            case "breasts":
                url = 'http://konachan.com/post.xml?tags=breasts+catgirl&page=' + gen55();
                break;
            case "underwear":
                url = 'http://konachan.com/post.xml?tags=underwear+catgirl&page=' + gen41();
                break;
            case "2girls":
                url = 'http://konachan.com/post.xml?tags=2girls+catgirl&page=' + gen27();
                break;
            default:
                url = 'http://konachan.com/post.xml?tags=catgirl+nekomimi&page=' + gen225();
                break;
        }
        unirest.get(url)
            .end(function(result) {
                var xml2js = require('xml2js')
                if (result.body.length < 75) {
                    msg.reply(':broken_heart: Unfortunately, I couldn\'t find picture matching catgirl/nekomimi') // Correct me if it's wrong.
                } else {
                    xml2js.parseString(result.body, (err, reply) => {
                        if (err) {
                            msg.channel.sendMessage('The API returned an unconventional response.')
                        } else {
                            var count = Math.floor((Math.random() * reply.posts.post.length))
                            if (isCached(url, count)) {
                                catgirl(msg, args);
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
    /*
    got(`http://catgirls.brussell98.tk/api${args.nsfw === 'nsfw' ? '/nsfw' : ''}/random`)
    	.then(response => {
    		const json = JSON.parse(response.body);
    		const img = json["url"];
    		if (args.nsfw === '') {
    			return msg.embed({
    				color: 3447003,
    				author: {
    					name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
    					icon_url: msg.author.displayAvatarURL
    				},
    				image: { url: img }
    			});
    		}
    		else {
    			return msg.embed({
    				color: 15473237,
    				author: {
    					name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
    					icon_url: msg.author.displayAvatarURL
    				},
    				title: 'NSFW - NOT SAFE FOR WORK',
    				image: { url: img }
    			});
    		}
    	})
    	.catch(error => {
    		console.log(error.response.body);
    	});*/
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