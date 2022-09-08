const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { token } = require('./config/config.json')
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
const discordModals = require('discord-modals');
discordModals(client);
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

client.on('ready', () => {
    console.log('Bot online.')
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'denunciar') {
		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('denuncias')
			.setTitle('Faça sua denúncia');

		// Add components to modal

		// Create the text input components
		const seuId = new TextInputBuilder()
			.setCustomId('seuId')
			.setLabel("Qual seu ID?")
            .setMinLength(1)
            .setMaxLength(4)
			.setStyle(TextInputStyle.Short);
        
        const idDenunciado = new TextInputBuilder()
		.setCustomId('idDenunciado')
		.setLabel("Qual ID denunciado?")
        .setMinLength(1)
        .setMaxLength(4)
		.setStyle(TextInputStyle.Short);

		const descricao = new TextInputBuilder()
			.setCustomId('descricao')
			.setLabel("Descreva o ocorrido (sem textão).")
			.setStyle(TextInputStyle.Paragraph);
        
        const video = new TextInputBuilder()
		.setCustomId('video')
		.setLabel("Link do video no youtube.")
		.setStyle(TextInputStyle.Short);

		const seuIdInput = new ActionRowBuilder().addComponents(seuId);
		const idDenunciadoInput = new ActionRowBuilder().addComponents(idDenunciado);
        const descricaoInput = new ActionRowBuilder().addComponents(descricao);
        const videoInput = new ActionRowBuilder().addComponents(video);

		// Add inputs to the modal
		modal.addComponents(seuIdInput, idDenunciadoInput, descricaoInput, videoInput);

		// Show the modal to the user
		await interaction.showModal(modal);

        if (!interaction.isModalSubmit()) return;


	}
});

client.on('interactionCreate', interaction => {
	if (interaction.type !== InteractionType.ModalSubmit) return;

	// Get the data entered by the user
    const denunciante = interaction.fields.getTextInputValue('seuId');
    const denunciado = interaction.fields.getTextInputValue('idDenunciado');
    const description = interaction.fields.getTextInputValue('descricao');
    const linkVideo = interaction.fields.getTextInputValue('video');
	//console.log({ denunciante, denunciado, description, linkVideo });

    let channelDen = interaction.guild.channels.cache.find(ch => ch.id === '1016452009777442916');

    const embedDen = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Resumo da Denúncia')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
        { name: 'ID in-game do denunciante', value: denunciante },
        //{ name: '\u200B', value: '\u200B' },
        { name: 'ID in-game do denunciado', value: denunciado, inline: false },
        //{ name: '\u200B', value: '\u200B' },
        { name: 'Descrição do ocorrido', value: description, inline: false },
        //{ name: '\u200B', value: '\u200B' },
        { name: 'Prova em vídeo', value: linkVideo, inline: false },
    )
    .setTimestamp()
    channelDen.send({ embeds: [embedDen] });

    //channelDen.send(denunciante, denunciado, description, linkVideo)

});

client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ModalSubmit) return;
	if (interaction.customId === 'denuncias') {
		await interaction.reply({ content: 'Denúncia enviada com sucesso aos administradores!' });
	}
});

client.login(token);