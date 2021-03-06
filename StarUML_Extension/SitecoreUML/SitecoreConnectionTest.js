define(function(require, exports, module) {
    "use strict";

    // eager-load StarUML module dependencies
    var Dialogs = app.getModule("dialogs/Dialogs");

    // eager-load SitecoreUML module dependencies
    var SitecorePreferencesLoader = require("SitecorePreferencesLoader");

    function executeConnectivityTest() {      
        var sitecoreUrl = SitecorePreferencesLoader.getSitecoreUrl();
        var route = SitecorePreferencesLoader.getSitecoreTestConnectionRoute();
        
        sitecoreUrl = sitecoreUrl.lastIndexOf("/") == sitecoreUrl.length - 1 
            ? sitecoreUrl.substr(0, sitecoreUrl.length - 1) 
            : sitecoreUrl;
        route = route.indexOf("/") == 0 
            ? route 
            : "/" + route;

        var getUrl = sitecoreUrl + route;
        $.getJSON(getUrl, function(data) {
            if (!data.Success) {
                console.error("Connection Error Response: ", data);
                Dialogs.showErrorDialog("Uh oh! An error occurred while attempting to connect to the Sitecore instance. Confirm that you have configured the correct settings in Preferences and try again.");
                return;
            }
            
            Dialogs.showAlertDialog("Connection successful!");
        })
        .fail(function(jqxhr, statusText, error) {
            var errorObject = { statusText: statusText, error: error, jqxhr: jqxhr };
            console.error("Connection Test Failed:", errorObject);
            Dialogs.showErrorDialog("<h3>Connection Test Failed!</h3><p>Check that the <b>Sitecore URL</b> setting in <i>File</i> &rarr; <i>Preferences</i> &rarr; <i>Sitecore</i> is pointing at your instance.</p><p>See the DevTools console for more details.</p>");
        });
    }
    
    // command ID constant
    var CMD_TESTSITECORECONNECTION = "sitecore.testsitecoreconnection";
    
    exports.initialize = function() {
        // eager-load the requisite StarUML modules
        var CommandManager = app.getModule("command/CommandManager");

        // register the command
        CommandManager.register("Test Connection", CMD_TESTSITECORECONNECTION, executeConnectivityTest);
        // add the menu item for the command
        var SitecoreMenuLoader = require("SitecoreMenuLoader");
        SitecoreMenuLoader.sitecoreMenu.addMenuItem(CMD_TESTSITECORECONNECTION);
    };
    exports.executeConnectivityTest = executeConnectivityTest;
    exports.CMD_TESTSITECORECONNECTION = CMD_TESTSITECORECONNECTION;
});