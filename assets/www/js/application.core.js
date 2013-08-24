// JSLint, include this before tests
// var window, cordova, $, document, navigator, ga_storage, handleAutoChangerSuccess, handleAutoChangerError, handleAcServiceSuccess, handleAcBootServiceSuccess, handleAcWallWidthSuccess, handleAcTimerSuccess, toast, updateView, handleUpdateCheckerSuccess, handleUpdateCheckerError, onDeviceReady, adjustStyle, createDatabase, updateDatabase, onPause, onResume, pressBackButton, initSettings, setTimeout, togglePanel, onConfirmBackup, onConfirmRestore, checkConnection, getFavorites, showTopicContent, checkContentVersionIndex, releaseAudio, pauseAudio, Connection, showTopicContentOffline;

/* PhoneGap plugin functions */

// Toasts
function toast(text, duration) {
	var toasts = cordova.require("cordova/plugin/toasts");
	if (duration === "short") {
		toasts.showShort(
			text,
			function () {
				console.info("PhoneGap Plugin: Toast short: callback success");
			},
			function () {
				console.error("PhoneGap Plugin: Toast short: callback error");
			}
		);
	} else if (duration === "long") {
		toasts.showLong(
			text,
			function () {
				console.info("PhoneGap Plugin: Toast long: callback success");
			},
			function () {
				console.error("PhoneGap Plugin: Toast long: callback error");
			}
		);
	} else {
		toasts.cancel(
			function () {
				console.info("PhoneGap Plugin: Toast cancel: callback success");
			},
			function () {
				console.error("PhoneGap Plugin: Toast cancel: callback error");
			}
		);
	}
}

// Share
function share(subject, text) {
	var shares = cordova.require("cordova/plugin/share");
	shares.show(
		{subject: subject, text: text},
		function () {
			console.info("PhoneGap Plugin: Share: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: Share: callback error");
		}
	);
}

// Appstore
function appstore(link, type) {
	var appstores = cordova.require("cordova/plugin/appstore");
	appstores.show(
		{link: link, type: type},
		function () {
			console.info("PhoneGap Plugin: Appstore: callback success");
		},
		function () {
			console.error("PhoneGap Plugin: Appstore: callback error");
		}
	);
}

// PackageVersion
function getPackageVersion() {
	var packageVersion = cordova.require("cordova/plugin/packageversion"), currentVersion;
	packageVersion.get(
		function (version) {
			console.info("PhoneGap Plugin: PackageVersion: callback success");
			currentVersion = version;
		},
		function () {
			console.error("PhoneGap Plugin: PackageVersion: callback error");
			currentVersion = "unknown";
		}
	);
	return currentVersion;
}
/* END PhoneGap plugins */

// device ready
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	// let the function "isDeviceReady" know that the event "deviceready" has been fired
	window.deviceReady = true;
	// execute when app resumes from pause
	document.addEventListener("resume", onResume, false);
	// execute when app goes to pause (home button or opening other app)
	document.addEventListener("pause", onPause, false);
	// override default backbutton behavior with own
	document.addEventListener("backbutton", pressBackButton, false);
	// demonstrate panel menu on first boot
	if (window.localStorage.getItem('firstBoot') === null) {
		$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_menu_selected.png");
		setTimeout(function () {
			togglePanel('#panelMenuIndex');
		}, 500);
		setTimeout(function () {
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_menu.png");
			togglePanel('#panelMenuIndex');
		}, 1500);
		window.localStorage.setItem('firstBoot', 'done');
	}
}

// function to execute other code AFTER the deviceready event
function isDeviceReady(action) {
	if (window.deviceReady === true) {
		var connection = checkConnection();
		switch (action) {
		case "toastReady":
			toast("Holo Light with Dark action bar example\nDevice is ready according to PhoneGap.\nConnection type: " + connection, "short");
			break;
		case "action2":
			// code
			break;
		case "action3":
			// code
			break;
		}
	} else {
		window.setTimeout("isDeviceReady(\"" + action + "\");", 100);
	}
}

// override default back button handling
function pressBackButton() {
	// if panel is not open, then go on
	if (window.localStorage.getItem('panelLeft') === 'closed' && window.localStorage.getItem('panelRight') === 'closed') {
		if ($.mobile.activePage.is('#indexPage')) {
			navigator.app.exitApp();
		} else {
			window.history.back();
		}
	// else close panels first, and stop further action
	} else {
		var divLeftId, divRightId;
		if (window.localStorage.getItem('panelLeft') === 'open') {
			divLeftId = '#panelMenu' + window.localStorage.getItem("divIdGlobal");
			$(divLeftId).panel("close");
		} else if (window.localStorage.getItem('panelRight') === 'open') {
			divRightId = '#panelMenuRight' + window.localStorage.getItem("divIdGlobal");
			$(divRightId).panel("close");
		}
	}
}

// pause app
function onPause() {
	toast('App paused', 'short');
}

// resume app
function onResume() {
	toast('App resumed', 'short');
}

// get current date as string
function currentDate() {
	var today = new Date(), dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear(), date = yyyy + "-" + mm + "-" + dd;
	return date;
}

// get current connection type
function checkConnection() {
	var networkState = navigator.connection.type, states = {};
	states[Connection.UNKNOWN] = 'Unknown';
	states[Connection.ETHERNET] = 'Ethernet';
	states[Connection.WIFI] = 'WiFi';
	states[Connection.CELL_2G] = '2G';
	states[Connection.CELL_3G] = '3G';
	states[Connection.CELL_4G] = '4G';
	states[Connection.NONE] = 'None';
	return states[networkState];
}

// clear to first boot state
function clearFirstBoot() {
	window.localStorage.clear();
	navigator.app.exitApp();
}

// default left panelmenu (define menu for all pages)
function panelMenu(divId) {
	var panel = '#panelMenu' + divId + 'UL';
	$(panel).children().remove('li');
	$(panel).append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">jpHolo</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#indexPage"><img src="./images/icons/ic_action_home.png" class="ui-li-icon largerIcon">Holo light/dark</a></li>');
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">Other pages</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#secondPage"><img src="./images/icons/ic_action_info.png" class="ui-li-icon largerIcon">Holo dark</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#thirdPage"><img src="./images/icons/ic_action_info.png" class="ui-li-icon largerIcon">Holo light</a></li>');
	$(panel).listview('refresh');
}

// default right panelmenu (define menu for all pages)
function panelMenuRight(divId) {
	var panel = '#panelMenuRight' + divId + 'UL';
	$(panel).children().remove('li');
	$(panel).append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">Play Store links</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="appstore(\'org.teusink.droidpapers\', \'app\')"><img src="./images/icons/ic_action_home.png" class="ui-li-icon largerIcon">DroidPapers</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="appstore(\'Teusink.org\', \'pub\')"><img src="./images/icons/ic_action_info.png" class="ui-li-icon largerIcon">Teusink.org</a></li>');
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">App info</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="toast(\'Current version: ' + getPackageVersion() + '\', \'short\')"><img src="./images/icons/ic_action_info.png" class="ui-li-icon largerIcon">Current version</a></li>');
	$(panel).listview('refresh');
}

// panel open and closed handling
function panelHandling() {
	$("#panelMenu" + window.localStorage.getItem("divIdGlobal")).panel({
		open: function (e, ui) {
			if (e) { e.preventDefault(); }
			window.localStorage.setItem("panelLeft", 'open');
		}
	});
	$("#panelMenu" + window.localStorage.getItem("divIdGlobal")).panel({
		close: function (e, ui) {
			if (e) { e.preventDefault(); }
			window.localStorage.setItem("panelLeft", 'closed');
		}
	});
	$("#panelMenuRight" + window.localStorage.getItem("divIdGlobal")).panel({
		open: function (e, ui) {
			if (e) { e.preventDefault(); }
			window.localStorage.setItem("panelRight", 'open');
		}
	});
	$("#panelMenuRight" + window.localStorage.getItem("divIdGlobal")).panel({
		close: function (e, ui) {
			if (e) { e.preventDefault(); }
			window.localStorage.setItem("panelRight", 'closed');
		}
	});
}

// toggle panel menu (open/close)
function togglePanel(panel) {
	$(panel).panel("toggle");
}

// press effect in header bar
function pressEffectHeader(share, light) {
	if (light === false) {
		// header title press effect (left panel)
		$(document).on('vmousedown', "#headerTitle" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_menu_selected.png");
		});
		$(document).on('vmouseup', "#headerTitle" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_menu.png");
		});
	} else {
		// header title press effect (left panel)
		$(document).on('vmousedown', "#headerTitle" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_arrow_selected.png");
		});
		$(document).on('vmouseup', "#headerTitle" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_arrow.png");
		});
	}
	// overflow title press effect (right panel)
	$(document).on('vmousedown', "#headerOverflow" + window.localStorage.getItem("divIdGlobal"), function (e) {
		if (e) { e.preventDefault(); }
		$("#headerOverflow" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_overflow_selected_header.png");
	});
	$(document).on('vmouseup', "#headerOverflow" + window.localStorage.getItem("divIdGlobal"), function (e) {
		if (e) { e.preventDefault(); }
		$("#headerOverflow" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_overflow_header.png");
	});
	// share press effect
	if (share === true) {
		$(document).on('vmousedown', "#headerShare" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerShare" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_share_selected_header.png");
		});
		$(document).on('vmouseup', "#headerShare" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerShare" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_share_header.png");
		});
	}
}

// press effect in footer bar
function pressEffectFooter(button1, button2) {
	// button1 press effect
	if (button1 === true) {
		$(document).on('vmousedown', "#footerShare" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#footerShare" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_share_selected_header.png");
		});
		$(document).on('vmouseup', "#footerShare" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#footerShare" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_share_header.png");
		});
	}
	// button2 press effect
	if (button2 === true) {
		$(document).on('vmousedown', "#footerToast" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#footerToast" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_list_selected_header.png");
		});
		$(document).on('vmouseup', "#footerToast" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#footerToast" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_action_list_header.png");
		});
	}
}

// initialize page variables and elements on create
function initPageVarsOnCreate(id) {
	// every page
	// do nothing
	// every page but...	
	if (id !== "Index") {
		toast('This is not the Index page', 'short');
	}
	// specific page...
	if (id === "Index") {
		isDeviceReady("toastReady");
	} else if (id === "Second") {
		toast('Holo Dark example', 'short');
	} else if (id === "Third") {
		toast('Holo Light example', 'short');
	}
}

// initialize page variables on beforeshow
function initPageVarsOnShow(id) {
	// every page...
	window.localStorage.setItem("panelLeft", 'closed');
	window.localStorage.setItem("divIdGlobal", id);
	window.localStorage.setItem("shareTagSubject", 'JQM Example');
	window.localStorage.setItem("shareTagText", 'A nice PhoneGap and JQM example by Teusink.org http://teusink.blogspot.com/2013/04/android-example-app-with-phonegap-and.html #TeusinkOrg');
	panelMenu(id);
	panelMenuRight(id);
	panelHandling();
	// every page but...
	if (id !== "Third") {
		pressEffectHeader(true, false);
	}
	// specific page...
	if (id === "Index") {
		pressEffectFooter(true, true);
	} else if (id === "Second") {
		pressEffectFooter(true, true);
	} else if (id === "Third") {
		pressEffectHeader(true, true);
	}
}

// below is to tie page events to pages so that the 2 functions above (initPageVarsOn...) will execute

// #indexPage
$(document).on('pagebeforeshow', '#indexPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Index');
});
$(document).on('pagecreate', '#indexPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Index');
});

// #secondPage
$(document).on('pagebeforeshow', '#secondPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Second');
});
$(document).on('pagecreate', '#secondPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Second');
});

// #thirdPage
$(document).on('pagebeforeshow', '#thirdPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Third');
});
$(document).on('pagecreate', '#thirdPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Third');
});