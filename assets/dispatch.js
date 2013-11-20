"use strict";

var title = 'sigma-pi.co.uk';
var command, query;

/* Dispatch a query */
function dispatch(command, args) {
	/* Expand field IDs to KVPs and merge all KVP objects into one store */
	var kvs = Array.prototype.slice.call(arguments, 1)
		.map(function (kv) {
				/* Name of data field */
				if (typeof kv === 'string') {
					var o = { };
					o[kv] = document.getElementById(kv).value;
					return o;
				}
				else {
					return kv;
				}
			})
		.reduce(function (accum, current) {
				for (var key in current)
					accum[key] = current[key];
				return accum;
			},
			{});
	/* Merge field values into kv store to preserve other field values in ajax history */
	Array.prototype
		.forEach.call(document.getElementsByClassName('queryfield'),
			function (field) {
				if (typeof kvs[field.id] === 'undefined' && field.value)
					kvs[field.id] = field.value;
			});
	/* Create key-value array from kvs object */
	var kva = [ { key: 'command', value: command } ];
	for (var key in kvs)
		kva.push({ key: key, value: kvs[key] });
	/* Create query string */
	var query = '?' + kva
		.map(function (kv) {
				return encodeURIComponent(kv.key) + '=' + encodeURIComponent(kv.value);
			})
		.join('&');
	ajaxCall(query, command);
	return true;
}

/* Create XHR and send it */
function ajaxCall(query, command) {
	var xhr = new XMLHttpRequest();
	displayData('');
	spinStart();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			spinStop();
			if (xhr.status == 200) {
				var data = xhr.responseText;
				/* Save address to page history */
				window.history.pushState(data, title, query);
				displayData(data);
			}
			else if (xhr.status >= 300)
				alert('Command "' + command + '" failed to execute, return code = ' + xhr.status);
		}
	};
	xhr.open('GET', 'ajax' + query);
	xhr.send();
}

/* Display data */
function displayData(data) {
	document.getElementById('mainview').innerHTML = data;
}

/* Handle intra-page navigation events */
window.onpopstate = function (event) {
	displayData(event.state);
};

onloads.push(function () {
	if (!command)
		return;
	/* Populate query fields */
	for (var key in query) {
		var field = document.getElementById(key);
		if (field)
			field.value = query[key];
	}
	/* Dispatch query to populate content viewer */
	dispatch(command, query)
});

