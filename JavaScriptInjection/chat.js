
var popClick = $("popupMsg").html();
var popClickBefore = $("popupBubbleBefore").html();
var popClickAfter = $("popupBubbleAfter").html();
var notificationNumber = 0;
var popupShowFlag = false;
var prevRasaCall = "";
var chatbottom = document.getElementById('chat-bar-bottom');

AJS.toInit(function () {
	firstBotMessage();
	// getLastConversation();
	// send("last conversation");
});

$(document).on('click', '#chat-button', function () {
	this.classList.toggle("active");
	var scrollHeight = $('.content-chatbot').prop('scrollHeight');
	var maxHeight = $('.content-chatbot').css('max-height');
	if (maxHeight !== "0px") {
		$('.content-chatbot').css('maxHeight', "0px");
	} else {
		$('.content-chatbot').css('maxHeight', scrollHeight + "px");
		$("#input-box").focus();
	}
	showPopupMessage();
	showNotification();
});

//Current Time
function getTime() {
	let today = new Date();
	hours = today.getHours();
	minutes = today.getMinutes();

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	let time = hours + ":" + minutes;
	return time;
}

function isChatboxVisible() {
	var maxHeight = $('.content-chatbot').css('max-height');
	if (maxHeight !== "0px") {
		return true;
	} else {
		return false;
	}
}

function firstBotMessage() {
	let firstMessage = "Hey! How may I assit you?"
	let time = getTime();
	var value = $("#chat-timestamp").text();
	if (value == "") {
		$("#chat-timestamp").append(time);
		let botHtml = `<img class="botAvatar" src="` + almServerBaseUrl + `/images/bot.png" width="50px" height="50px"/><p class="botText"><span> ${firstMessage}</span></p>`;
		$("#chatbox").append(botHtml);
	}

	if (!isChatboxVisible()) {
		notificationNumber++;
		showNotification();
	}
	else notificationNumber = 0;
	// $('div#chat-bar-bottom')[0].scrollIntoView(true);
	// document.getElementById("chat-bar-bottom")?.scrollIntoView(true);
	chatbottom.scrollIntoView(true);
	showPopupMessage();
	$("#input-box").focus();
}

function getLastConversation() {
	//http://localhost:5005/conversations/%7Bconversation_id%7D/tracker
	// $.ajax({
	// 	url: 'http://localhost:5005/conversations/%7Bconversation_id%7D/tracker',
	// 	type: 'GET',
	// 	success: function (data, textStatus) {
	// 		console.log("Tracker Response: ", data, "\n Status:", textStatus)
	// 		parseDataSent(data.events);
	// 	},
	// 	error: function (errorMessage) {
	// 		console.log('Error Tracker' + errorMessage);
	// 	}
	// });
	// send("last conversation");
}

function parseDataSent(conversation) {
	console.log("Conversation is: ", conversation);
	let chat_json = JSON.parse(conversation[0]['text']);
	let chat_data = "";
	console.log("The length of chat_json is: " + chat_json.length)
	for (var i = 0; i < chat_json.length; i++) {
		console.log("the data is : " + chat_json[i])
		data = chat_json[i];
		console.log("The event of data is : " + data['timestamp'])
		if (data['event'] == 'user') {
			chat_data += 'user: ' + data['text'] + '\n'
			if (data['text'] !== "last conversation") setUserResponse(data['text'])
			if ((data['parse_data']['entities']).length > 0) {
				var dataVar = data['parse_data']['entities']
				chat_data += 'extra data:' + dataVar[0]['entity'] + '=' + dataVar[0]['value'] + '\n'
				console.log('extra data:', i['parse_data']['entities'][0]['entity'], '=',
					data['parse_data']['entities'][0]['value'])
			}
		}
		else if (data['event'] == 'bot') {
			try {
				const regex = new RegExp('user_featurization');
				chat_data += 'Bot: ' + data['text'] + '\n'
				if (!(regex.test(data['text']))) {
					var botHtml = `<img class="botAvatar" src="` + almServerBaseUrl + `/images/bot.png" width="50px" height="50px"/><p class="botText"><span> ${data['text']}</span></p>`;
					$("#chatbox").append(botHtml);
				}
			} catch (except) {
				console.log("An error occurred")
			}
		}
	}
}

function showNotification() {
	var maxHeight = $('.content-chatbot').height();
	if (maxHeight === 0) {
		$('.icon-button__badge').css('maxHeight', "0px");
	} else {
		if (notificationNumber > 0) {
			$('.icon-button__badge').css('maxHeight', "30px");
			$("#notifyBox").html("");
			let notifyMessage = `<p id="notifyMessage" class="notifyMessage">${notificationNumber}</p>`;
			$("#notifyBox").append(notifyMessage);
		}
		else $('.icon-button__badge').css('maxHeight', "0px");
	}
}

function showPopupMessage() {
	if (!isChatboxVisible() && !popupShowFlag) {
		$('#popupMsg').css('maxHeight', "200px");
		$('#popupBubbleBefore').css('maxHeight', "25px");
		$('#popupBubbleAfter').css('maxHeight', "20px");
		popupShowFlag = true;
	} else {
		$('#popupMsg').css('maxHeight', "0px");
		$('#popupBubbleBefore').css('maxHeight', "0px");
		$('#popupBubbleAfter').css('maxHeight', "0px");
	}
}

//-------------------Key Events-------------------------

$(document).on('keypress', '#input-box', function (e) {
	var keyCode = e.keyCode || e.which;
	var text = $("#input-box").val();
	if (keyCode === 13) {
		if (text == "" || $.trim(text) == '') {
			e.preventDefault();
			return false;
		} else {
			$("#input-box").blur();
			setUserResponse(text);
			send(text);
			e.preventDefault();
			return false;
		}
	}
});

// clear function to clear the chat contents of the widget.
$(document).on('click', '#clear', function (e) {
	$(".chatbox").fadeOut("normal", () => {
		$(".chatbox").html("");
		$(".chatbox").fadeIn();
		setTimeout(function () {
			firstBotMessage();
		}, 500);
	});
});

// restart function to restart the chat contents of the widget.
$(document).on('click', '#restart', function (e) {
	$(".chatbox").fadeOut("normal", () => {
		$(".chatbox").html("");
		$(".chatbox").fadeIn();
		setTimeout(function () {
			firstBotMessage();
		}, 500);
	});
});

// close function to close the widget.
$(document).on('click', '#close', function (e) {
	var scrollHeight = $('.content-chatbot').prop('scrollHeight');
	var maxHeight = $('.content-chatbot').css('max-height');
	if (maxHeight !== "0px") {
		$('.content-chatbot').css('maxHeight', "0px");
	} else {
		$('.content-chatbot').css('maxHeight', scrollHeight + "px");
	}
});

//-------------Code to work with RASA----------------

//------------------------------------- Set user response------------------------------------
function setUserResponse(val) {
	var UserResponse = `<img class="userAvatar" src="` + almServerBaseUrl + `/images/user.png" width="50px" height="50px"/><p class="userText"><span> ${val} </span></p>`;
	$("#input-box").val("");
	$("#chatbox").append(UserResponse);
	chatbottom.scrollIntoView(true);
	// $('div#chat-bar-bottom')[0].scrollIntoView(true);
	$("#input-box").focus();
}

//-------------------------------------- Send message to Bot --------------------------------
function send(message) {
	console.log("User Message:", message)
	prevRasaCall = message;
	$.ajax({
		url: 'http://localhost:5005/webhooks/rest/webhook',
		type: 'POST',
		data: JSON.stringify({
			"message": message,
			"sender": "username"
		}),
		success: function (data, textStatus) {
			if (prevRasaCall === "last conversation") {
				parseDataSent(data);
			} else setBotResponse(data);
			console.log("Rasa Response: ", data, "\n Status:", textStatus)
		},
		error: function (errorMessage) {
			setBotResponse("");
			console.log('Error' + errorMessage);

		}
	});
}

//------------------------------Set bot response ----------------------------
function setBotResponse(val) {
	setTimeout(function () {
		if (val.length < 1) {
			//if there is no response from Rasa
			msg = 'I couldn\'t get that. Let\' try something else!';

			let botHtml = `<img class="botAvatar" src="` + almServerBaseUrl + `/images/bot.png" width="50px" height="50px"/><p class="botText"><span> ${msg} </span></p>`;
			$("#chatbox").append(botHtml);
			if (!isChatboxVisible()) {
				notificationNumber++;
				showNotification();
			}
			else notificationNumber = 0;
			$("#input-box").focus();

		} else {
			//if we get response from Rasa
			for (i = 0; i < val.length; i++) {
				//check if there is text message
				if (val[i].hasOwnProperty("text")) {
					let txt = urlify(val[i].text);
					txt = txt.replace(/(?:\r\n|\r|\n)/g, '<br>')
					console.log("The txt is : " + txt)
					let botHtml = `<img class="botAvatar" src="` + almServerBaseUrl + `/images/bot.png" width="50px" height="50px"/><p class="botText"><span> ${txt}</span></p>`;
					$("#chatbox").append(botHtml);
					if (!isChatboxVisible()) {
						notificationNumber++;
						showNotification();
					}
					else notificationNumber = 0;
					$("#input-box").focus();
				}

				//check if there is image
				if (val[i].hasOwnProperty("image")) {
					var BotResponse = '<div class="singleCard">' +
						'<img class="imgcard" src="' + val[i].image + '">' +
						'</div><div class="clearfix"></div><br/>'
					$("#chatbox").append(BotResponse);
					if (!isChatboxVisible()) {
						notificationNumber++;
						showNotification();
					}
					else notificationNumber = 0;
					$("#input-box").focus();
				}
				// check if the response contains "buttons"
				if (Object.hasOwnProperty.call(val[i], "buttons")) {
					if (val[i].buttons.length > 0) {
						addSuggestion(val[i].buttons);
					}
				}
				//link
				if (Object.hasOwnProperty.call(val[i], "link")) {
					if (val[i].buttons.length > 0) {
						checkInlineURL(val[i].link);
					}
				}


			}
			chatbottom.scrollIntoView(true);
			// $('div#chat-bar-bottom')[0].scrollIntoView(true);
			$("#input-box").focus();
		}

	}, 500);
}

//Local functions to change few texts
// [(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)

function urlify(text) {
	var urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
	var inlineRegex = /]\(/g;
	subStr = text.substring(text.indexOf("[") + 1, text.indexOf("]\("));
	if (subStr !== "") {
		text = text.replace(subStr, "");
		text = text.replace("[", " ");
		text = text.replace("]", " ");
		text = text.replace(")", " ");
		text = text.replace("(", " ");
	}
	return text.replace(urlRegex, function (url) {
		if (subStr !== "")
			return '<a href="' + url + '">' + subStr + '</a>';
		else
			return '<a href="' + url + '">' + url + '</a>';
	})
}

// Function to check if there is any inline words to be added
// text: "Please click link to continue: [ALM Home](put your link in here)"
function checkInlineURL(inlineLinks) {
	let urlVal = '<a href="' + inlineLinks[0].url + '">' + inlineLinks[0].inline + '</a>'
	let botHtml = `<img class="botAvatar" src="` + almServerBaseUrl + `/images/bot.png" width="50px" height="50px"/><p class="botText"><span> ${urlVal}</span></p>`;
	$("#chatbox").append(botHtml);
	if (!isChatboxVisible()) {
		notificationNumber++;
		showNotification();
	}
	else notificationNumber = 0;
	$("#input-box").focus();
}

// For adding suggestion buttons
/**
 *  adds vertically stacked buttons as a bot response
 * @param {Array} suggestions buttons json array
 */
function addSuggestion(suggestions) {
	setTimeout(() => {
		const suggLength = suggestions.length;
		$(
			' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>',
		)
			.appendTo("#chatbox")
			.hide()
			.fadeIn(1000);
		// Loop through suggestions
		for (let i = 0; i < suggLength; i += 1) {
			$(
				`<div class="menuChips" data-payload='${suggestions[i].payload}'>${suggestions[i].title}</div>`,
			).appendTo(".menu");
		}
		document.getElementById("chat-bar-bottom").scrollIntoView(true);
		$("#input-box").focus();
	}, 1000);
}


// on click of suggestion's button, get the title value and send it to rasa
$(document).on("click", ".menu .menuChips", function () {
	const text = this.innerText;
	const payload = this.getAttribute("data-payload");
	console.log("payload: ", this.getAttribute("data-payload"));
	setUserResponse(text);
	send(payload);

	// delete the suggestions once user click on it.
	$(".suggestions").remove();
});
