
/**
 * @description Manages cookies for ALM toolbar and AMC badge
 * @constructor
 */
function CookieManager(){

    /*****************************************************************************
    *@description Gets the value of a cookie based on the provided cookie name.
    *@param cookieName Name/key of the cookie being searched
    *@return value of cookie if found in document
    *****************************************************************************/
       this.getCookie = function(/**String*/ cookieName) {
          var cookieValue; 
           // Get all cookies
           var cookies = document.cookie.split(";");
           // Get the specific cookie we care about
           for (var i=0; i<cookies.length; i++) {
               var name = cookies[i].split('=')[0];
               if (name.trim() === cookieName) {
                   var value = cookies[i].split('=')[1];
                   cookieValue = value.trim();
                   break;
               }
           }
           return cookieValue;
       }
       
    /*****************************************************************************
    *@description Adds cookie to page
    *@param cookieName Name/key of the cookie.
    *@param cookieValue Value of cookie
    *@param expiration Expiration time of cookie
    *****************************************************************************/
       this.addCookie = function(/**String*/ cookieName, /**String*/ cookieValue, /**Date*/ expiration){
           document.cookie = cookieName + "=" + cookieValue + "; expires=" + expiration.toUTCString() + "; path=/";
       }
}