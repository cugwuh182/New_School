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
//DB Functions
 function querySuccess(tx, results) {
 alert("query success run")
     var len = results.rows.length;
     alert(len);
     //alert("Table: " + len + " rows found.");
     //var list = $('#indexContentTest ul').empty();
     //for (var i=0; i<5; i++){
      //   list.append('<li>' + results.rows.item(i).field3);
    // }

    // if (len === 0) {
       //  list.append('<li> No Records Found');
    // }

 }


 function testQuery(tx) {
     tx.executeSql('SELECT * FROM classroom', [], querySuccess, errorCB);
     alert("query executed");
 }



 function errorCB(err) {
     alert("Error processing SQL: "+err.code);
 }






function onDeviceReady(){
document.addEventListener("menubutton", onMenuKeyDown, false);
    var db = window.sqlitePlugin.openDatabase("classroom", "1.0", "Exam", 2000000);
    alert("db opened");
db.transaction(function(tx) {
                    testQuery(tx);
                }, errorCB);



//news_onReady();
}






Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

 function news_onReady (){

 if (navigator.network.connection.type == Connection.NONE) {
     loadNews();

 }
 else {
     updateNews();

 };
 }

function event_onReady(){

     if (navigator.network.connection.type == Connection.NONE) {
         loadEvents();

     }
     else {
         updateEvents();

     };

}
function updateNews() {
                                news = $('#indexContent ul').empty();
                                loading('show');
$.ajax({

                       			//type: 'GET',
                       			    url: 'http://myschool.com.ng/toolbox/mobile-app/news/index.php',
                       			   	dataType: 'jsonp',
                                   	jsonp: 'jsoncallback',
                                   	timeout: 50000,
                                   	success: function(data, status){
                                   	$.each(data, function(i,item){
                                           //var temp_news = item.headline;
                                           var news_item_headline = JSON.stringify(item.headline);
                                           var news_item_detail = JSON.stringify(item.detail);
                                           localStorage.setItem('news_headline_' + i, news_item_headline);
                                           localStorage.setItem('news_detail_' + i, news_item_detail);
                                           //var news_items = JSON.parse(localStorage.getItem('news_headline_' + i));
                                           //uncomment this next line to load news after update
                                           //news.append('<li><a onclick="displayNewsDetail('+ i +');" data-role="button">' + news_items + '</a>');
                       				});
                       				loading('hide');
                       				loadNews();
                       				//toast("Updated Successfully");

                       			},
                       			error: function() {
                       				loading('hide');
                       				loadNews()
                       				//news.append('<li> Loading Failed! <a onclick="updateNews();" data-role="button">Click To Try Again</a>');
                       				//loadNews();
                           			}
                       		});
}



function loadNews(){
        news = $('#indexContent ul').empty();
        //loading('show');
        for (n=0; n<4; n++)
         {
            //key = localStorage.key(n);
            //var length = localStorage.length;
            //alert(length);
            //var news_load = localStorage.key(n);
            var news_items = JSON.parse(localStorage.getItem('news_headline_' + n));
         // var news_items_load =[];
        //news_load = ;//localStorage.getArray('news')[i];
        news.append('<li><a onclick="displayNewsDetail('+ n +');" data-role="button">' + news_items + '</a>');
       }
        loading('hide');

}

function displayNewsDetail(item){
        $.mobile.changePage($('#fourthPage'), {
        transition:"slide"
        });
        news_headline = $('#NewsHeadline').empty();
        news_detail = $('#NewsDetail').empty();
        headline = JSON.parse(localStorage.getItem('news_headline_' + item));
        detail = JSON.parse(localStorage.getItem('news_detail_' + item));
        news_headline.append(headline);
        news_detail.append(detail);

}


function displayAllNews(){
$.mobile.changePage($('#fifthPage'), {
transition:"slide"
});
news_all = $('#NewsAllContent ul').empty();
for (n=0; n<30; n++)
{
    var allNews = JSON.parse(localStorage.getItem('news_headline_' + n));
    news_all.append('<li><a onclick="displayNewsDetail('+ n +');" data-role="button">' + allNews);
}

}

//Events Management Source

function updateEvents() {

                                events = $('#indexEventsContent ul').empty();
                                loading('show');
$.ajax({

                       			//type: 'GET',
                       			    url: 'http://myschool.com.ng/toolbox/mobile-app/events/index.php',
                       			   	dataType: 'jsonp',
                                   	jsonp: 'jsoncallback',
                                   	timeout: 30000,
                                   	success: function(data, status){
                                   	$.each(data, function(i,item){
                                           //var temp_news = item.headline;
                                           var events_item_date = JSON.stringify(item.event_date);
                                           var events_item_detail = JSON.stringify(item.detail);
                                           localStorage.setItem('events_date_' + i, events_item_date);
                                           localStorage.setItem('events_detail_' + i, events_item_detail);
                                           //var events_items = JSON.parse(localStorage.getItem('events_headline_' + i));
                                           //uncomment this next line to load news after update
                                           //news.append('<li><a onclick="displayNewsDetail('+ i +');" data-role="button">' + news_items + '</a>');
                       				});
                       				loading('hide');
                       				loadEvents();
                       				//toast("Updated Successfully");

                       			},
                       			error: function() {
                       				loading('hide');
                       				//events.append('<li> Loading Failed! <a onclick="updateNews();" data-role="button">Tap Here To Try Again</a>');
                       				loadEvents();
                           			}
                       		});
}

function loadEvents(){
        news = $('#indexEventsContent ul').empty();
        loading('show');
        for (n=0; n<30; n++)
         {
            //key = localStorage.key(n);
            //var length = localStorage.length;
            //alert(length);
            //var news_load = localStorage.key(n);
            var events_items = JSON.parse(localStorage.getItem('events_date_' + n));
            var events_items_detail = JSON.parse(localStorage.getItem('events_detail_' + n));
            var dateArray = events_items.split('-');
            var day = dateArray[0];
            var month = dateArray[1];
            var year = dateArray[2];
            var month_word = "";

            	if (month === "01") {
            		month_word = "Jan";
            	} else if (month === "02") {
            		month_word = "Feb";
            	} else if (month === "03") {
            	    month_word = "Mar";
            	} else if (month === "04") {
            	    month_word = "Apr";
            	} else if (month === "05") {
            	    month_word = "May";
            	} else if (month === "06"){
            	    month_word = "Jun";
            	} else if (month === "07"){
            	    month_word = "Jul";
            	} else if (month === "08"){
            	    month_word = "Aug";
            	} else if (month === "09"){
            	    month_word = "Sept";
            	} else if (month === "10"){
            	    month_word = "Oct";
            	} else if (month === "11"){
            	    month_word = "Nov";
            	} else if (month === "12"){
            	    month_word = "Dec";
            	}


         // var news_items_load =[];
        //news_load = ;//localStorage.getArray('news')[i];
        news.append('<li><a class=day>'+ day +'<span class=month>'+ month_word +'</span><span class=year>'+ year +'</span></a><li span class=detail>' + events_items_detail);

       }
        loading('hide');

}

function displayEvents(){
$.mobile.changePage($('#thirdPage'), {
transition:"slide"
});
event_onReady();

}

/***Exam db functions***/
  function subjects(){
          localStorage.removeItem("english");
          localStorage.removeItem("accounts");
          localStorage.removeItem("biology");
          localStorage.removeItem("chemistry");
          localStorage.removeItem("crk");
          localStorage.removeItem("commerce");
          localStorage.removeItem("economics");
          localStorage.removeItem("geography");
          localStorage.removeItem("government");
          localStorage.removeItem("litenglish");
          localStorage.removeItem("math");
          localStorage.removeItem("physics");
     var english = $('#english').is(':checked');
     var accounts= $('#accounts').is(':checked');
     var biology= $('#biology').is(':checked');
     var chemistry= $('#chemistry').is(':checked');
     var crk= $('#crk').is(':checked');
     var commerce= $('#commerce').is(':checked');
     var economics= $('#economics').is(':checked');
     var geography= $('#geography').is(':checked');
     var government= $('#government').is(':checked');
     var litenglish= $('#litenglish').is(':checked');
     var math= $('#math').is(':checked');
     var physics= $('#physics').is(':checked');
     localStorage.setItem("english", english);
     localStorage.setItem("accounts", accounts);
     localStorage.setItem("biology", biology);
     localStorage.setItem("chemistry", chemistry);
     localStorage.setItem("crk", crk);
     localStorage.setItem("commerce", commerce);
     localStorage.setItem("economics", economics);
     localStorage.setItem("geography", geography);
     localStorage.setItem("government", government);
     localStorage.setItem("litenglish", litenglish);
     localStorage.setItem("math", math);
     localStorage.setItem("physics", physics);
    $.mobile.changePage($('#eightPage'), {
    transition:"slide"
    });
    PG3Content =  $('#ExamPG3Content ul').empty();
    eng = localStorage.getItem("english")
    acc = localStorage.getItem("accounts");
    bio = localStorage.getItem("biology");
    chem = localStorage.getItem("chemistry");
    crk = localStorage.getItem("crk");
    comm = localStorage.getItem("commerce");
    econ = localStorage.getItem("economics");
    geo = localStorage.getItem("geography");
    govt = localStorage.getItem("government");
    lit = localStorage.getItem("litenglish");
    math = localStorage.getItem("math");
    phy = localStorage.getItem("physics");
    PG3Content.append('<li>'+ eng);
    PG3Content.append('<li>'+ acc);
    PG3Content.append('<li>'+ bio);
    PG3Content.append('<li>'+ chem);
    PG3Content.append('<li>'+ crk);
    PG3Content.append('<li>'+ comm);
    PG3Content.append('<li>'+ econ);
    PG3Content.append('<li>'+ geo);
    PG3Content.append('<li>'+ govt);
    PG3Content.append('<li>'+ lit);
    PG3Content.append('<li>'+ math);
    PG3Content.append('<li>'+ phy);

    }


/*     		function updateNewsIndex() {

             		news = $('#indexContent ul').empty();
             		loading('show');
                        //toast("loadBugs Running", "short");
             		$.ajax({
             			//type: 'GET',
             			    url: 'http://myschool.com.ng/toolbox/mobile-app/news/index.php',
             			   	dataType: 'jsonp',
                         	jsonp: 'jsoncallback',
                         	timeout: 30000,
                         	success: function(data, status){
                         	$.each(data, function(i,item){
             				    //var news = '<li>' + item.headline;
                                 //localStorage.setItem('news_headline', JSON.stringify(item.headline));
                                //localStorage.setItem('news_detail', JSON.stringify(item.detail));
                                 var newsHeadline = JSON.parse(localStorage.getItem('news_headline'));
                                 var newsDetail = JSON.parse(localStorage.getItem('news_detail'));
                                  news.append('<li>' + newsHeadline);
                                  news.append('<li>' + newsDetail);
             				});
             				loading('hide');
             			},
             			error: function() {
             				news.append('<li>There was an error loading the news');
             				loading('hide');
             			}
             		});
             	}*/




function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 1);
}
function onMenuKeyDown() {

        // your code..
       window.deviceReady = true;
       togglePanel('#panelMenuIndex');
    }
// function to execute other code AFTER the deviceready event
function isDeviceReady(action) {
	if (window.deviceReady === true) {
		var connection = checkConnection();
		switch (action) {
		case "toastReady":
			//toast("Holo Light with Dark action bar example\nDevice is ready according to PhoneGap.\nConnection type: " + connection, "short");
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
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">Menu</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#indexPage"><img src="./images/icons/ic_action_home.png" class="ui-li-icon largerIcon">Home</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="displayAllNews();"><img src="./images/icons/ic_news.png" class="ui-li-icon largerIcon">News</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#sixthPage"><img src="./images/icons/ic_exam.png" class="ui-li-icon largerIcon">Take an Exam</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#"><img src="./images/icons/ic_ask.png" class="ui-li-icon largerIcon">Ask Us</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#"><img src="./images/icons/ic_friends.png" class="ui-li-icon largerIcon">Friends</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="displayEvents();"><img src="./images/icons/ic_events.png" class="ui-li-icon largerIcon">Events</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" href="#"><img src="./images/icons/ic_sms.png" class="ui-li-icon largerIcon">SMS</a></li>');
	$(panel).listview('refresh');
}

// default right panelmenu (define menu for all pages)
function panelMenuRight(divId) {
	var panel = '#panelMenuRight' + divId + 'UL';
	$(panel).children().remove('li');
	$(panel).append('<li data-icon="false" class="headerSpace"><p>&nbsp;</p></li>'); // empty space, needed for header
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">Account</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="appstore(\'org.teusink.droidpapers\', \'app\')"><img src="./images/icons/ic_manage.png" class="ui-li-icon largerIcon">Manage</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="appstore(\'Teusink.org\', \'pub\')"><img src="./images/icons/ic_login.png" class="ui-li-icon largerIcon">Login</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="appstore(\'Teusink.org\', \'pub\')"><img src="./images/icons/ic_register.png" class="ui-li-icon largerIcon">Register</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="appstore(\'Teusink.org\', \'pub\')"><img src="./images/icons/ic_settings.png" class="ui-li-icon largerIcon">Settings</a></li>');
	$(panel).append('<li data-role="list-divider"><p class="panelTextDivider">Order Activation</p></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="toast(\'Current version: ' + getPackageVersion() + '\', \'short\')"><img src="./images/icons/ic_place_order.png" class="ui-li-icon largerIcon">Order a Code</a></li>');
	$(panel).append('<li data-icon="false"><a class="panelText" onclick="toast(\'Current version: ' + getPackageVersion() + '\', \'short\')"><img src="./images/icons/ic_activate.png" class="ui-li-icon largerIcon">Enter Order Code</a></li>');
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
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_menu_selected.png");
		});
		$(document).on('vmouseup', "#headerTitle" + window.localStorage.getItem("divIdGlobal"), function (e) {
			if (e) { e.preventDefault(); }
			$("#headerTitle" + window.localStorage.getItem("divIdGlobal")).attr("src", "images/icons/ic_launcher_full_menu.png");
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
		//toast('This is not the Index page', 'short');
	}
	// specific page...
	if (id === "Index") {
		isDeviceReady("toastReady");
		loadNews();
	} else if (id === "Second") {
		//toast('Holo Dark example', 'short');
	} else if (id === "Third") {
		//events_onReady();
	} else if (id === "Fifth") {
	    displayAllNews();
	}
}

// initialize page variables on beforeshow
function initPageVarsOnShow(id) {
	// every page...
	window.localStorage.setItem("panelLeft", 'closed');
	window.localStorage.setItem("divIdGlobal", id);
	window.localStorage.setItem("shareTagSubject", 'MySchool');
	window.localStorage.setItem("shareTagText", "Nigeria's No.1 Educational Community App");
	panelMenu(id);
	panelMenuRight(id);
	panelHandling();
	// every page but...
	if (id !== "Third") {
		pressEffectHeader(true, true);
	}
	// specific page...
	if (id === "Index") {
		pressEffectFooter(true, true);
	} else if (id === "Second") {
		pressEffectFooter(true, true);
	} else if (id === "Third") {
		pressEffectHeader(true, true);
	} else if (id === "Fourth") {
		pressEffectHeader(true, true);
	} else if (id === "Fifth") {
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

// #fourthPage
$(document).on('pagebeforeshow', '#fourthPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Fourth');
});
$(document).on('pagecreate', '#fourthPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Fourth');
});

// #fifthPage
$(document).on('pagebeforeshow', '#fifthPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Fifth');
});
$(document).on('pagecreate', '#fifthPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Fifth');
});

// #sixthPage
$(document).on('pagebeforeshow', '#sixthPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Sixth');
});
$(document).on('pagecreate', '#sixthPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Sixth');
});

// #seventhPage
$(document).on('pagebeforeshow', '#seventhPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Seventh');
});
$(document).on('pagecreate', '#sevenhPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Seventh');
});

// #eightPage
$(document).on('pagebeforeshow', '#eightPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnShow('Eight');
});
$(document).on('pagecreate', '#eightPage', function (e) {
	if (e) { e.preventDefault(); }
	initPageVarsOnCreate('Eight');
});
