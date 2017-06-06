/* eslint-disable no-console */
const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const token = 'MzIwNjA2NjA1MTg2MTcwODgw.DBSAZw.55o9qHB4zNUBFCFbYxRAaKS0ST8';
const music = require('./music');

var cleverbotio = require("cleverbot.io"),//kurfa on jest po angielsku
bot = new cleverbotio("Ozo3jcknOF8FMHuX", "RPZhudsPuABSFjesJzf24LpRegGkx2lI");
const session = 'animumylove.test';
bot.setNick(session);
bot.create(function (err, session) {});

var cleverbot = require("cleverbot-node");
talkbot = new cleverbot;
talkbot.configure({botapi: 'CC2jfuINqXBONtE7TNt4a4nOeTQ'});
cleverbot.prepare(function(){});

const client = new commando.Client({
    owner: '309049348786749450',
	commandPrefix: ';'
});

//music(client, { //WLACZYC MUZYKE?
//	prefix: '.'
//});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		client.user.setGame("@Poke my Love ❤", "https://www.twitch.tv/tpacce");
		var opts = {
                name: '@Poke my Love ❤',
                url: 'https://www.twitch.tv/tpacce',
                type: 1
        };

        client.user.setStatus("dnd", opts);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('message', message => {
		if (message.author.id !== "320606605186170880" && message.channel.name === "cleverbot") {
			talkbot.write(message.content, function (response) {
				return message.channel.sendMessage(response.message);
			});
			/*bot.ask(args.ddd, function (err, response) {
				return message.channel.sendMessage(response);
			});*/
		}
	});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerGroup('fun', '4Fun')
	.registerGroup('music', 'Music')
	.registerGroup('util', 'Utils')
	.registerGroup('nsfw', 'NSFW')
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);