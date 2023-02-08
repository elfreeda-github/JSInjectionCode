/*******************************************************************************
 * @description Create new chatbot object
 * @param id html div identifier to contain the menu
 *        must be valid html4 id name [\-a-zA-Z0-9] and start with [a-zA-Z]
 * @param useId use id as preface instead of random value
 * @requires Atlassian AJS object (jQuery wrapper)
 * @constructor
 ******************************************************************************/
function rasaChatbotbot(/**String*/ id, /**Boolean*/ useId) {
    id = typeof id !== 'undefined' ? id : 'unknown'; // Default parameter
    useId = typeof useId !== 'undefined' ? useId : false; // Default parameter

    this.chatbotContainer = AJS.$('#chatbotLayout');
    this.setChatbotBody();
    if (useId) {
        // Use specified id preface
        this.preface = id + '_';
    } else {
        // Save unique id preface (ids must start with [a-zA-Z] in html4)
        this.preface = 'x' + Math.random().toString(36).substring(7) + '_';
    }
}
/*******************************************************************************
* @description Create the complete chatbot popup
******************************************************************************/
rasaChatbotbot.prototype.setChatbotBody = function () {
    this.chatbotContainer.append('<div id="chat-button" type=button class="collapsible"></div>');
    this.chatbotContainer.find('#chat-button').append('<img src="' + almServerBaseUrl + '/images/bot.png" alt="' + almServerBaseUrl + '/images/bot.png" width="50px" height="50px"></img>');
    this.chatbotContainer.append('<div id="icon-button__badge" class="icon-button__badge"></div>');
    this.chatbotContainer.find('#icon-button__badge').append('<div id="notifyBox" class="notifyBox">12</div>');
    this.chatbotContainer.append('<div id="popupMsg" class="popupMsg" type=button></div>');
    this.chatbotContainer.find('#popupMsg').append('<p>Welcome to ALM Application! <br/> We are happy to help you.</p>');
    this.chatbotContainer.append('<div id="popupBubbleBefore" class="popupBubbleBefore" type=button>&nbsp;</div>');
    this.chatbotContainer.append('<div id="popupBubbleAfter" class="popupBubbleAfter" type=button>&nbsp;</div>');
    this.setChatContent();
}

/*******************************************************************************
 * @description Create the chatbot content area
 ******************************************************************************/
 rasaChatbotbot.prototype.setChatContent = function () {
    this.chatbotContainer.append('<div id="chat-bar-collapsible" class="chat-bar-collapsible"></div>');
    this.chatbotContainer.find('#chat-bar-collapsible').append('<div id ="content-chatbot" class="content-chatbot"><div>');
    this.chatbotContainer.find('#content-chatbot').append('<div id="headerbox" class="headerbox"><div>');
    this.chatbotContainer.find('#headerbox').append('<div id="header-title" class="header-title">CHATBOT</div>');
    this.chatbotContainer.find('#headerbox').append('<div id="dropdown-trigger" class="dropdown-trigger" style="float:right;" data-target="dropdown1"></div>');
    this.chatbotContainer.find('#dropdown-trigger').append('<i class="fa fa-ellipsis-v" style="font-size:24px;color:white"></i>');
    this.chatbotContainer.find('#dropdown-trigger').append('<div id="dropdown-content" class="dropdown-content"></div>');
    this.chatbotContainer.find('#dropdown-content').append('<a id="clear" class="clear">Clear</a>');
    this.chatbotContainer.find('#dropdown-content').append('<a id="restart" class="restart">Restart</a>');
    this.chatbotContainer.find('#dropdown-content').append('<a id="close" class="close">Close</a>');

    this.chatbotContainer.find('#content-chatbot').append('<div id="full-chat-block" class="full-chat-block"><div>');
    //Message container
    this.chatbotContainer.find('#full-chat-block').append('<div id="outer-container" class="outer-container"></div>');
    this.chatbotContainer.find('#outer-container').append('<div id="chat-container" class="chat-container"></div>');
    //Messages
    this.chatbotContainer.find('#chat-container').append('<div id="chatbox" class="chatbox"></div>');
    this.chatbotContainer.find('#chatbox').append('<h5 id="chat-timestamp"></h5>');
    this.chatbotContainer.find('#chatbox').append('<p id="botStarterMessage" class="botText"></p>');
    //User input box
    this.chatbotContainer.find('#chat-container').append('<div id="chat-bar-input-block" class="chat-bar-input-block"></div>');
    this.chatbotContainer.find('#chat-bar-input-block').append('<div id="userInput" class="userInput"></div>');
    this.chatbotContainer.find('#userInput').append('<input id="input-box" class="input-box" type="text"  name="msg" placeholder="Tap Enter to send a message"/><p></p>');

    this.chatbotContainer.find('#chat-bar-input-block').append('<div id="chat-bar-icons" class="chat-bar-icons"></div>');
    this.chatbotContainer.find('#chat-bar-icons').append('<i id="chat-icon" style="color: crimson;" class="fa fa-fw fa-heart" onclick="heartButton()"></i>');
    this.chatbotContainer.find('#chat-bar-icons').append('<i id="chat-icon" style="color: #333;" class="fa fa-fw fa-send" onclick="sendButton()"></i>');

    this.chatbotContainer.find('#chat-container').append('<div id="chat-bar-bottom" class="chat-bar-bottom"><p></p></div>');
    
    AJS.$('body').append('<script type="text/javascript" src="' + almServerBaseUrl + '/chat.js"/></script>');
}