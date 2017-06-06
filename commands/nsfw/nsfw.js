const commando = require('discord.js-commando');

module.exports = class ChannelCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'nsfw',
            aliases: ['autonsfw'],
            group: 'nsfw',
            memberName: 'nsfw',
            description: 'Toggle AutoNSFW',
            examples: ['nsfw', 'autonsfw'],
            guildOnly: true,
        });
        client.autonsfw = true;
    }

    async run(msg) {
        msg.delete();
        if (msg.client.autonsfw) {
            msg.reply('AutoNSFW has been disabled!');
        } else {
            msg.reply('AutoNSFW has been enabled!');
        }
        msg.client.autonsfw = !msg.client.autonsfw;
    }
};