'use strict';

let TaskController = {};
let channel_id = '982488139690029106';

TaskController.listTasks = (req, res) => {
	clientDis.channels.cache.get(channel_id).send('Hello here!');
	res.json({});
};

TaskController.createTask = (req, res) => {
	var { message, img } = req.body;
	if (message) { clientDis.channels.cache.get(channel_id).send(message); }
	if (img) {
		clientDis.channels.cache.get(channel_id).send({ files: img.split(',') })
			.then(msg => {
				var text = "", attachments = msg.attachments;
				// console.log(attachments);
				for (var [key, value] of attachments) {
					// console.log(key);
					text += value.url + ' [' + value.contentType + '], ';
				}
				clientDis.channels.cache.get(channel_id).send('URL images: ' + text);
			});
	}
	res.json({ success: true, data: message });
};

module.exports = TaskController;