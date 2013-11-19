var path = require('path');
var https = require('https');

var cid = process.env['CLIENT_ID'];
var cse = process.env['CLIENT_SECRET'];

if (!cid.length)
	throw 'CLIENT_ID not set - did you remember to `source vars`?';

module.exports = function (query, callback) {
	var uri = path.join('/v1/', query) + (query.indexOf('?') == -1 ? '?' : '&') + 'client_id=' + encodeURIComponent(cid);
	console.log('insta: ' + uri);
	var req = https.request(
		{
			host: 'api.instagram.com',
			port: 443,
			path: uri,
			method: 'GET',
			headers: {
				'Connection': 'keep-alive'
			}
		},
		function (result) {
			var json = '';
			result.on('data', function (chunk) {
				json += chunk;
			});
			result.on('end', function () {
				if (json.substr(0, 9) == '<!DOCTYPE') {
					callback(data, 'Unknown error');
				}
				else {
					var data = JSON.parse(json).data;
					callback(data, null);
				}
			});
		});
	req.on('error', function (error) {
		callback(null, error.message);
	});
	req.end();
}
