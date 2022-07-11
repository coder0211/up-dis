require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');

const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const serverPort = process.env.PORT || 3002;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	global.clientDis = (global.clientDis ? global.clientDis : client);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
// client.channels.cache.get('982488139690029106').send()

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

let index = require("./src/routes/index");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", index);
app.use(function (req, res) {
	res.status(404).send({
		url: req.originalUrl + " not found."
	});
});

app.listen(serverPort);