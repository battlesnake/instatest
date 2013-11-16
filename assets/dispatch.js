function dispatch(command) {
	var target = Array.prototype.slice.call(arguments, 1)
		.map(
			function (id) {
				/* Name of data field */
				if (typeof id === 'string') {
					return encodeURIComponent(id) + '=' + encodeURIComponent(document.getElementById(id).value);
				}
				/* Object */
				else if (typeof id === 'object') {
					var obj = [ ];
					var str = '';
					for (var key in id)
						str += (str ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(id[key]);
					return str;
				}
			})
		.reduce(
			function (accum, current) {
				return accum + '&' + current;
			},
			'ajax?command=' + encodeURIComponent(command));
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200)
				receive(xhr.responseText);
			else if (xhr.status >= 300)
				alert('Command "' + command + '" failed to execute, return code = ' + xhr.status);
		}
	};
	xhr.open('GET', target);
	xhr.send();
}

function receive(value) {
	document.getElementById('mainview').innerHTML = value;
}
