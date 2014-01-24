/**
 * Wrapper around phonegap Cordova library that provides a handy way to
 * use phonegap with handykit. It will provide an API wrappers around
 * every call available for native device. Periodical events will be sent to
 * the eventbus for presenters to listen, API calls will be put as a plugin.
 *
 * Author: bearz
 */
(function(root, factory) {
    // pattern from here: https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof define === 'function' && define.amd) {
        // require.js and other AMD frameworks
        define(['handykit'], factory);
    } else if (typeof exports === 'object') {
        // node.js
        module.exports = factory(require('handykit'));
    } else {
        // browser globals
        factory(root.Handykit);
    }
}(this, function(Handykit) {

    var PLUGIN_NAME = "phonegap";
    var PhonegapWrapper = Handykit.Presenter.extend({
        // list of events supported by devices
        // TODO understand how 'deviceready' event is working
        setupDeviceEvents: function() {
            var device_events = ["deviceready", "pause", "resume", "online", "offline", "backbutton",
                            "batterycritical", "batterylow", "batterystatus", "menubutton", "searchbutton",
                            "endcallbutton", "volumedownbutton", "volumeupbutton"];

            var that = this;
            for (var i=0; i < device_events.length; i++) {
                var event_name = device_events[i];
                var cb_func = (function(name) {
                    return function() {
                        that.trigger(PLUGIN_NAME + ":" + name, arguments);
                    }
                }(event_name));
                document.addEventListener(event_name, cb_func, false);
            }
        },
        initialize: function() {
            this.setupDeviceEvents();
        },
        getCurrentPosition: function(success, error, options) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    });

    var instance = new PhonegapWrapper();
    var plugins = Handykit.plugins || {};
    plugins[PLUGIN_NAME] = {
        getCurrentPosition: function(success, error, options) {
            instance.getCurrentPosition(success, error, options);
        }
    };

    Handykit.plugins = plugins;

    return plugins;

}));

