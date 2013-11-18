var insta = require('../insta');

function check(str, charset) {
	for (var i = 0; i < str.length; i++) {
		if (charset.indexOf(str.charAt(i)) === -1)
			return null;
	}
	return str;
}

function checkHex(str) {
	return check(str, '0123456789abcdefABCDEF+-._');
}

function checkInt(str) {
	return check(str, '0123456789+-._');
}

function checkStr(str) {
	return encodeURIComponent(str);
}

module.exports = function(req, res) {
	function callback(template) {
		return function (result, error) {
			if (error)
				res.status(500).send(error);
			else
				res.render(template, { data: result });
		};
	}
	var commands = {
		'user/get'		: function () { insta('/users/' + checkInt(req.query['userid']), callback('user_info')); },
		'user/search'	: function () { insta('/users/search?q=' + encodeURIComponent(req.query['userq']), callback('user_list')); },
		'media/get'		: function () { insta('/media/' + checkHex(req.query['mediaid']), callback('media_info')); },
		'media/search'	: function () { insta('/tags/' + checkStr(req.query['mediaq']) + '/media/recent', callback('media_list')); }
	};
	var command = req.query.command;
	if (command && commands[command])
		commands[command]();
	else
		res.send(418, 'Unknown command: "' + command + '"');
};
