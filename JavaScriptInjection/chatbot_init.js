/*******************************************************************************
 * @description Implement chatbot init logic using chatbot
 ******************************************************************************/


/*******************************************************************************
 * @description AJS initialization callback
 ******************************************************************************/
AJS.toInit(function () {
    /***************************************************************************
       * @decription Configuration options
       * @note We assume Issues and Wiki will always be available
    **************************************************************************/
    var cookieMgr = new CookieManager();
    var userIdCookieName = "userId";


    /***************************************************************************
       * @description Gets the value of a cookie based on the provided cookie
       *              name.
       * @param cookieName
       *            Name/key of the cookie.
       **************************************************************************/
    function getCookie(/** String */ cookieName) {
        // Get all cookies
        var cookies = document.cookie.split(";");
        // Get the specific cookie we care about
        for (var i = 0; i < cookies.length; i++) {
            var name = cookies[i].split('=')[0];
            if (name.trim() === cookieName) {
                var value = cookies[i].split('=')[1];
                return value.trim();
            }
        }
    }

    /***************************************************************************
       * @description Main routine
       **************************************************************************/
    // Create rasaChatbotbot
    var chatbot;

    try {
        AJS.$.ajax({
            url: linkConfigJsonURL,
            data: {},
            type: 'get',
            dataType: 'json',
            cache: true,
            async: true,
            success: function (data) {
                configFile = new ConfigFile(data);

                // Create rasaChatbotbot
                chatbot = new rasaChatbotbot(configFile.chatbotId, configFile.chatbotUseId);

                // Send data to chatbot_inject.js
                AJS.$(document).trigger('dataLoadedFromFile', [configFile]);
            },
            timeout: 3000  // 3 second timeout
        }).done(function () {
            
        });
    } catch (err) {
        console.error("Could not access " + linkConfigJSONFile + ". Error: " + err);
    }


    /***************************************************************************
       * @description Helper function to get the user's username in string
       * @return Returns the username in string
       **************************************************************************/
    function getUsernameByDOM() {
        // Get Username
        var user = '';

        // Attempt to retrieve username from DOM
        user = AJS.$('#header-details-user-fullname').data('username'); // Issues

        // !user returns true if user is null, undefined, or empty string
        if (!user) {
            user = AJS.$('#user-menu-link').data('username'); // Wiki
        }
        // NOTE: Code does not have a consistent DOM element to use
        if (!user) {
            user = AJS.$('#userInfo').data('username'); // Build
        }
        // Check if username is a number
        if (typeof user === 'number') {
            user = user.toString();
        }

        // Set userId in cookie if user is not null, undefined, or empty string
        if (user) {
            document.cookie = userIdCookieName + "=" + user + "; path=/";
        }
        return user;
    }

    // HACK: Trigger window resize to ensure vertical splitters sized correctly
    AJS.$(window).trigger('resize');
});