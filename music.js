const YoutubeDL = require('youtube-dl');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyAQECMe3RTeRcpwzKYDhA3QcoTeAYa0AtY');

/**
 * Takes a discord.js client and turns it into a music bot.
 * Thanks to 'derekmartinez18' for helping.
 * 
 * @param {Client} client - The discord.js client.
 * @param {object} options - (Optional) Options to configure the music bot. Acceptable options are:
 * 							prefix: The prefix to use for the commands (default '!').
 * 							global: Whether to use a global queue instead of a server-specific queue (default false).
 * 							maxQueueSize: The maximum queue size (default 20).
 * 							anyoneCanSkip: Allow anybody to skip the song.
 * 							clearInvoker: Clear the command message.
 * 							volume: The default volume of the player.
 */
module.exports = function (client, options) {
	// Get all options.
	let PREFIX = (options && options.prefix) || '!';
	let GLOBAL = (options && options.global) || false;
	let MAX_QUEUE_SIZE = (options && options.maxQueueSize) || 20;
	let DEFAULT_VOLUME = (options && options.volume) || 50;
	let ALLOW_ALL_SKIP = (options && options.anyoneCanSkip) || false;
	let CLEAR_INVOKER = (options && options.clearInvoker) || false;

	// Create an object of queues.
	let queues = {};

	// Catch message events.
	client.on('message', msg => {
		const message = msg.content.trim();

		// Check if the message is a command.
		if (message.toLowerCase().startsWith(PREFIX.toLowerCase())) {
			// Get the command and suffix.
			const command = message.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim();
			const suffix = message.substring(PREFIX.length + command.length).trim();

			// Process the commands.
			switch (command) {
				case 'play':
					return play(msg, suffix);
				case 'skip':
					return skip(msg, suffix);
				case 'queue':
					return queue(msg, suffix);
				case 'pause':
					return pause(msg, suffix);
				case 'volume':
					return volume(msg, suffix);
				case 'leave':
					return leave(msg, suffix);
				case 'clearqueue':
					return clearqueue(msg, suffix);
			}
			if (CLEAR_INVOKER) {
				msg.delete();
			}
		}
	});

	/**
	 * Checks if a user is an admin.
	 * 
	 * @param {GuildMember} member - The guild member
	 * @returns {boolean} - 
	 */
	function isAdmin(member) {
		return member.hasPermission("ADMINISTRATOR");
	}

	/**
	 * Checks if the user can skip the song.
	 * 
	 * @param {GuildMember} member - The guild member
	 * @param {array} queue - The current queue
	 * @returns {boolean} - If the user can skip
	 */
	function canSkip(member, queue) {
		if (ALLOW_ALL_SKIP) return true;
		else if (queue[0].requester === member.id) return true;
		else if (isAdmin(member)) return true;
		else return false;
	}

	/**
	 * Gets the song queue of the server.
	 * 
	 * @param {integer} server - The server id. 
	 * @returns {object} - The song queue.
	 */
	function getQueue(server) {
		// Check if global queues are enabled.
		if (GLOBAL) server = '_'; // Change to global queue.

		// Return the queue.
		if (!queues[server]) queues[server] = [];
		return queues[server];
	}

	/**
	 * The command for adding a song to the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response edit.
	 */
	function play(msg, suffix) {
		// Make sure the user is in a voice channel.
		if (msg.member.voiceChannel === undefined) return msg.channel.sendMessage(wrap('You\'re not in a voice channel.'));

		// Make sure the suffix exists.
		if (!suffix) return msg.channel.sendMessage(wrap('No video specified!'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.channel.sendMessage(wrap('Maximum queue size reached!'));
		}

		// Get the video information.
		msg.channel.sendMessage(wrap('Searching...')).then(response => {
			msg.delete();
			var searchstring = suffix;
			
			if (searchstring.indexOf("?list=") > -1|| searchstring.indexOf("&list=") > -1) {
				youtube.getPlaylist(searchstring)
				.then(playlist => {
					response.edit(`:mega: Found playlist **${playlist.title}**`);
					playlist.getVideos()
						.then(videos => {
							videos.forEach(function(video) {
								video.requester = {};
								video.requester.id = msg.author.id;
								video.requester.name = msg.author.username;
								video.webpage_url = `https://www.youtube.com/watch?v=${video.id}`;
								video.duration = '';
								queue.push(video);
								// Play if only one element in the queue.
								if (queue.length === 1) executeQueue(msg, queue);
							});
							msg.channel.sendMessage(wrap(`:mega: Added to queue -> **${playlist.title} (${videos.length === 50 ? '50+' : videos.length})**`)).then((response) => {
								response.delete(5000);
							});
							response.delete(3000);
						})
						.catch(console.log);
				})
				.catch(console.log);
				return;
			} else {
	
			//:warning: Could not queue Cat House Sessions #001 by Cat Dealers: Track is longer than 21 minutes! (60:17)	
				var resultss = [];
				
				var ddd = "```Markdown\n#Song selection. Type the song number to continue.\n```";
				youtube.searchVideos(searchstring, 5)
				.then(results => {//${results.length} num
					resultss = results;
					var i = 0;
					var dd = ddd;
					results.forEach(function(result) {
						dd = dd + `\n${i+1}. [${result.title}]`; //(https://www.youtube.com/watch?v=${result.id})`;
						response.edit(dd);
						i++;
					});
					response.react('1⃣').then((messageReaction) => {
						const collector = response.createReactionCollector(
														 (reaction, user) => user.id === msg.author.id,
														 { time: 15000 }
														);
														collector.on('collect', r => {
															console.log(`Collected ${r.emoji.name}`)
															var info = {};
															switch(`${r.emoji.name}`) {
																case "1⃣":
																	info = resultss[0];
																	break;
																case "2⃣":
																	info = resultss[1];
																	break;
																case "3⃣":
																	info = resultss[2];
																	break;
																case "4⃣":
																	info = resultss[3];
																	break;
																case "5⃣":
																	info = resultss[4];
																	break;
															}
															if (info.title) {
																response.delete();
																//YoutubeDL.getInfo(`https://www.youtube.com/watch?v=${info.id}`, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
																	info.requester = {};
																	info.requester.id = msg.author.id;
																	info.requester.name = msg.author.username;
																	info.webpage_url = `https://www.youtube.com/watch?v=${info.id}`;
																	info.duration = '';
																	queue.push(info);
																	// Play if only one element in the queue.
																	if (queue.length === 1) executeQueue(msg, queue);
																	msg.channel.sendMessage(wrap(`:mega: Added to queue -> **${info.title} ${info.duration}**`)).then((response) => {
																		response.delete(5000);
																	});
																//});
															}
														});
														collector.on('end', collected => console.log(`Collected ${collected.size} items`));
						if (results.length >= 2) {
							response.react('2⃣').then((messageReaction) => {
								if (results.length >= 3) {
									response.react('3⃣').then((messageReaction) => {
										if (results.length >= 4) {
											response.react('4⃣').then((messageReaction) => {
												if (results.length >= 4) {
													response.react('5⃣').then((messageReaction) => {
														if (response.deletable) {
															response.delete(10000);
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
					//map[msg.author.id] = results;
				})
				.catch(console.log);
			}

				/* Queue the video.
				response.edit(wrap('Queued: ' + info.title)).then(() => {
					queue.push(info);
					// Play if only one element in the queue.
					if (queue.length === 1) executeQueue(msg, queue);
				}).catch(console.log);
				
				client.on("messageReactionAdd", (messageReaction, user) => {console.log(`${messageReaction.emoji}`);console.log(user.id)});
				client.on("messageReactionRemove", (messageReaction, user) => console.log(messageReaction));
				client.on("messageReactionRemoveAll", (messageReaction) => console.log(messageReaction));
				
				//msg.channel.sendMessage(wrap(':mega: Added to queue -> **' + info.title + ' (dlugosc)**'));*/
		}).catch(console.log);
	}


	/**
	 * The command for skipping a song.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function skip(msg, suffix) {
		msg.delete();
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.sendMessage(wrap('No music being played.'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canSkip(msg.member, queue)) return msg.channel.sendMessage(wrap('You cannot skip this as you didn\'t queue it.')).then((response) => {
			response.delete(5000);
		});

		// Get the number to skip.
		let toSkip = 1; // Default 1.
		if (!isNaN(suffix) && parseInt(suffix) > 0) {
			toSkip = parseInt(suffix);
		}
		toSkip = Math.min(toSkip, queue.length);

		// Skip.
		queue.splice(0, toSkip - 1);

		// Resume and stop playing.
		const dispatcher = voiceConnection.player.dispatcher;
		if (voiceConnection.paused) dispatcher.resume();
		dispatcher.end();

		msg.channel.sendMessage(wrap(':white_check_mark: The DJ has decided to skip!'));//toSkip num
	}

	/**
	 * The command for listing the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function queue(msg, suffix) {
		msg.delete();
		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Get the queue text.
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n');

		// Get the status of the queue.
		let queueStatus = 'Stopped';
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection !== null) {
			const dispatcher = voiceConnection.player.dispatcher;
			queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
		}

		// Send the queue and status.
		msg.channel.sendMessage(wrap('Queue (' + queueStatus + '):\n' + text));
	}

	/**
	 * The command for pausing the current song.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function pause(msg, suffix) {
		msg.delete();
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.sendMessage(wrap(':broken_heart: No music being played.'));

		if (!isAdmin(msg.member))
			return msg.channel.sendMessage(wrap('You are not authorized to use this.'));

		// Pause or Resume.
		const dispatcher = voiceConnection.player.dispatcher;
		if (dispatcher.paused) {
			dispatcher.resume();
			msg.channel.sendMessage(wrap(':mega: Playback unpaused.'));
		}
		else {
			dispatcher.pause();
			msg.channel.sendMessage(wrap(':mega: Player paused.'));
		}
	}

	/**
	 * The command for leaving the channel and clearing the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function leave(msg, suffix) {
		msg.delete();
		if (isAdmin(msg.member)) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.sendMessage(wrap(':broken_heart: I\'m not in any channel!.'));
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			if (voiceConnection.player.dispatcher) { //TODO Do I fixed it?
				voiceConnection.player.dispatcher.end();
			}
			voiceConnection.disconnect();
		} else {
			msg.channel.sendMessage(wrap(':broken_heart: You don\'t have permission to use that command!'));
		}
	}

	/**
	 * The command for clearing the song queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function clearqueue(msg, suffix) {
		msg.delete();
		if (isAdmin(msg.member)) {
			const queue = getQueue(msg.guild.id);

			queue.splice(0, queue.length);
			msg.channel.sendMessage(wrap(':broken_heart: Queue cleared!'));
		} else {
			msg.channel.sendMessage(wrap(':broken_heart: You don\'t have permission to use that command!'));
		}
	}

	/**
	 * The command for changing the song volume.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function volume(msg, suffix) {
		msg.delete();
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.sendMessage(wrap(':broken_heart: No music being played.'));

		if (!isAdmin(msg.member))
			return msg.channel.sendMessage(wrap(':broken_heart: You are not authorized to use this.'));

		// Get the dispatcher
		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 200 || suffix < 0) return msg.channel.sendMessage(wrap(':broken_heart: Volume out of range!')).then((response) => {
			response.delete(5000);
		});

		msg.channel.sendMessage(wrap("Volume set to " + suffix));
		dispatcher.setVolume((suffix/100));
	}

	/**
	 * Executes the next song in the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {object} queue - The song queue for this server.
	 * @returns {<promise>} - The voice channel.
	 */
	function executeQueue(msg, queue) {
		// If the queue is empty, finish.
		if (queue.length === 0) {
			msg.channel.sendMessage(wrap(':mega: Finished playing queue! Hope you enjoyed it.')).then((response) => {
				response.delete(5000);
			});

			// Leave the voice channel.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection !== null) return voiceConnection.disconnect();
		}

		new Promise((resolve, reject) => {
			// Join the voice channel if not already in one.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) {
				// Check if the user is in a voice channel.
				if (msg.member.voiceChannel) {
					msg.channel.sendMessage(wrap(':white_check_mark: Connected to channel **' + msg.channel.name.charAt(0).toUpperCase() + msg.channel.name.slice(1) + '**!')).then((response) => {
						response.delete(3000);
					});
					msg.member.voiceChannel.join().then(connection => {
						resolve(connection);
					}).catch((error) => {
						console.log(error);
					});
				} else {
					// Otherwise, clear the queue and do nothing.
					queue.splice(0, queue.length);
					reject();
				}
			} else {
				resolve(voiceConnection);
			}
		}).then(connection => {
			// Get the first item in the queue.
			const video = queue[0];

			//console.log(video.webpage_url);

			// Play the video.
			video.duration = "";
				msg.channel.sendMessage(wrap(`:mega: Now Playing in **${msg.member.voiceChannel.name}**: ${video.title} ${video.duration} requested by **${video.requester.name}**`)).then(() => {
				//response.delete(5000)
				
				let dispatcher = connection.playStream(ytdl(video.webpage_url, {filter: 'audioonly'}));//, {seek: 0, volume: (DEFAULT_VOLUME/100)});

				connection.on('error', (error) => {
					console.log("ERROR CONNECTION");
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('error', (error) => {
					console.log("ERROR DISPATCHER");
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('end', () => {
					console.log("END OF MUSIC");
					// Wait a second.
					setTimeout(() => {
						if (queue.length > 0) {
							// Remove the song from the queue.
							queue.shift();
							// Play the next song in the queue.
							executeQueue(msg, queue);
						}
					}, 1000);
				});
			}).catch((error) => {
				console.log(error);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}

/**
 * Wrap text in a code block and escape grave characters.
 * 
 * @param {string} text - The input text.
 * @returns {string} - The wrapped text.
 */
function wrap(text) {
	return text;
	//return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}