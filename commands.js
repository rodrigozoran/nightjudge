const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, channelId, token } = require('./config/config.json');


const commands = [
    new SlashCommandBuilder().setName('denunciar').setDescription('Replies with pong!')
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId, channelId), { body: commands })
    .then((data) => console.log(`Você registrou ${data.length} comando na aplicação.`))
    .catch(console.error);