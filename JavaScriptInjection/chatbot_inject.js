/*******************************************************************************
 * @description Inject Chatbot
 * @requires Atlassian AJS object
 ******************************************************************************/

var webServerBaseUrl = "/chatbotjs";
var configFile;
var chatbotJSFile = "chatbot_init.js";
var linkConfigJSONFile = "chatbot_config.json";
var linkConfigJsonURL = "/webdav/" + linkConfigJSONFile;

if (window.location.hostname == 'localhost' ||
  window.location.hostname == '127.0.0.1') {
  //override the global variables for localhost environment
  webServerBaseUrl = "http://" + window.location.hostname + ":8889";
  linkConfigJsonURL = webServerBaseUrl + "/configuration/"
			+ linkConfigJSONFile;
}

// Only process top level windows (not iFrames)
if (window.location === window.parent.location) {

  function doChatbotInjection() {

    // Hook element removal
    (function ($) {
      /**
       * @attribute destroyed
       * @parent specialevents
       * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/destroyed/destroyed.js
       * @test jquery/event/destroyed/qunit.html
       * Provides a destroyed event on an element.
       * <p>
       * The destroyed event is called when the element
       * is removed as a result of jQuery DOM manipulators like remove, html,
       * replaceWith, etc. Destroyed events do not bubble, so make sure you don't use live or delegate with destroyed
       * events.
       * </p>
       */
      var oldClean = AJS.$.cleanData;
      AJS.$.cleanData = function (elems) {
        for (var i = 0, elem;
          (elem = elems[i]) !== undefined; i++) {
          AJS.$(elem).triggerHandler("destroyed");
        }
        oldClean(elems);
      };
    })(jQuery)


    AJS.$.cachedScript = function (url, options) {
      // Allow user to set any option except for dataType, cache, and url
      // Set crossDomain to true so debugger allows you to see the script
      options = AJS.$.extend(options || {}, {
        dataType: "script",
        crossDomain: true,
        cache: true,
        url: url
      });

      // Use $.ajax() since it is more flexible than $.getScript
      // Return the jqXHR object so we can chain callbacks
      return AJS.$.ajax(options);
    };

    // Wait for header to be visible
    var headerEscapeCounter = 0;
    var headerListener = setInterval(function () {
      try {
        headerEscapeCounter++;
        //Only process if the image icon does not exist
        if (!(AJS.$('#chat-button').size() > 0)) {
          clearInterval(headerListener);
          // Increase default synchronous ajax timeout
          try {
            AJS.$.ajaxSetup({
              timeout: 600000
            });
          } catch (err) { }

          AJS.$('#page').append('<div id="chatbotLayout" class="chatbotLayout"></div>');

          // Load stylesheet
          // NOTE: Need to manually increase version parameter every time css is updated
          //       This prevents currently open browsers from incorrectly caching the file
          var version = 17;
          let cssFile = webServerBaseUrl + '/css/chat.css';
          if (document.createStyleSheet) {
            var screenCss = document.createStyleSheet(cssFile + '?version=' + version);
            screenCss.media = "screen";
            AJS.$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
            AJS.$('head').append('<link rel="stylesheet" type="text/css" href="'+webServerBaseUrl+'/css/chat.css"/>');
            AJS.$('head').append('<script type="text/javascript" src="' + webServerBaseUrl + '/jquery-3.6.0.min.js"></script>');
          } else {
            // NOTE: Old IE browsers do not support appending css directly
    				AJS.$('head').append('<link rel="stylesheet" type="text/css" href="'+webServerBaseUrl+'/css/chat.css"/>');
            AJS.$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
            AJS.$('head').append('<script type="text/javascript" src="' + webServerBaseUrl + '/jquery-3.6.0.min.js"></script>');
          }
          console.log("Came to the ")
          var chatbotListener = setInterval(function () {
            if (AJS.$('#chatbotLayout').length > 0) {
              clearInterval(chatbotListener);
              AJS.$.cachedScript(webServerBaseUrl + '/cookie_manager.js').done(function () {
                AJS.$.cachedScript(webServerBaseUrl + '/chatbot.js').done(function () {
                  // Successful, so load javascript configfile
                  AJS.$.cachedScript(webServerBaseUrl + '/configfile.js').done(function () {
                    // Successful, so load javascript chatbot
                    AJS.$.cachedScript(webServerBaseUrl + '/' + chatbotJSFile).done(function () {
                      // Wait for stylesheet to finish loading before showing chatbot and footer
                      var almCssListener = setInterval(function () {
                        if (AJS.$('div.chatbotLayout').css('bottom') === '10px') {
                          clearInterval(almCssListener)
                          // Show chatbot
                          AJS.$('#chatbotLayout').show();
                        }
                      }, 100);
                    });
                  });
                });
              });
            }
          }, 100);

          // HACK: If something deletes the chatbot element, wait awhile and put it back!
          AJS.$('#chatbotLayout').bind('destroyed', function () {
            setTimeout(function () {
              doChatbotInjection();
            }, 1000);
          });
        }
      } catch (err) { }
    }, 100);
  }

  try {
    if (typeof AJS === 'undefined') {
      // AJS not defined so try and fake needed routines
      if (typeof GLIFFY === 'undefined') {
        // This is not gliffy so go ahead and add fake AJS support
        if (typeof jQuery === 'undefined' && !document.getElementById("local_jquery")) {
          // Load a local jquery and fake AJS functionality
          var tag = document.createElement('script');
          tag.type = 'text/javascript';
          tag.src = webServerBaseUrl + '/jquery-3.6.0.min.js';
          tag.id = 'local_jquery';
          document.getElementsByTagName('head')[0].appendChild(tag);
          // Wait for script to finish loading before continuing
          var almScriptListener = setInterval(function () {
            if (typeof jQuery !== 'undefined') {
              clearInterval(almScriptListener)
              if (typeof $ !== 'undefined') {
                $(function () {
                  AJS = {};
                  AJS.$ = $;
                  AJS.toInit = function (f) {
                    f();
                  }
                  // Inject chatbot
                  doChatbotInjection();
                });
              }
            }
          }, 100);
        } else {
          // fake AJS functionality with existing jQuery
          $(function () {
            AJS = {};
            AJS.$ = $;
            AJS.toInit = function (f) {
              f();
            }
            // Inject chatbot
            doChatbotInjection();
          });
        }
      }
    } else {
      // Inject chatbot in AJS toInit function
      AJS.toInit(doChatbotInjection);
    }
  } catch (err) { }
}