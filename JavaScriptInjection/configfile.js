/*******************************************************************************
 * @description Create new configFile object
 * @param data Data contained in linkConfigJSONFile
 * @constructor
 ******************************************************************************/
function ConfigFile(/**JSON*/ data) {
    // Read through file

    // Get chatbot info
    this.chatbotId = data.chatbot.id;
    this.chatbotUseId = data.chatbot.useId;
    this.chatbotVersion = data.chatbot.version;
    this.iconImage = data.chatbot.iconImage;
    this.projectConnections = data.chatbot.projectConnections;

    // Get the host info
    this.environment = data.environment;
}

/*******************************************************************************
* @description Determines if the current environment is production
* @extends ConfigFile
******************************************************************************/
ConfigFile.prototype.isProdHost = function () {
    let result = false;

    if (this.environment.envType == "prod") {
        result = true;
    }

    return result;
}

/*******************************************************************************
* @description Determines if the current environment is development
* @extends ConfigFile
******************************************************************************/
ConfigFile.prototype.isDevHost = function () {
    let result = false;

    if (this.environment.envType == "dev") {
        result = true;
    }

    return result;
}

/*******************************************************************************
* @description Determines if the current environment is qa
* @extends ConfigFile
******************************************************************************/
ConfigFile.prototype.isQaHost = function (/** String */ hostName) {
    let result = false;

    if (this.environment.envType == "qa") {
        result = true;
    }

    return result;
}


