"use strict";

var onloads = [];

window.onload = function () {
	onloads.map(function (e) { e(); });
};
