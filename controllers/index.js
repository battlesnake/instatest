module.exports = function(req, res) {
	var cmd = req.query.command || '';
	var kvp = req.query || null;
	if (kvp) {
		delete kvp.command;
		delete kvp.__proto__;
	}
	res.render('index', { title: 'Instatest: Sandbox for testing instagram API commands', command: cmd, query: kvp, locals: { } });
};
