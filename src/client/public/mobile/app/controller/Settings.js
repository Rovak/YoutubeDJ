/**
 * Settings Controller
 */
Ext.define('MobileDJ.controller.Settings', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            settings: '#settings'
        },
        control: {
            '#settings #buttonNext': {
                tap: 'doPlayNext'
            },
            '#settings #toggleQR': {
                change: 'doToggleQr'
            },
            '#settings #toggleFullscreen': {
                change: 'doToggleFullscreen'
            },
            '#settings #changeVolume' : {
                change: 'doChangeVolume'
            }
        }
    },
    /**
     * Send a new player state to the server screen
     *
     * @param {SimpleObject} state Keyvalue pair of new screen configuration
     * @protected
     */
    sendState: function(state) {
        socket.emit('screen_state', state);
    },
    /**
     * Play the next song in the list
     *
     * @param {Ext.Button} button
     */
    doPlayNext: function(button) {
        this.sendState({
            next: true
        });
    },
    /**
     * Sends a message to toggle the QR code
     *
     * @param {Ext.field.Checkbox} checkButton
     * @param {Boolean} newValue
     */
    doToggleQr: function(checkButton) {
        this.sendState({
            qrcode: !!checkButton.getValue()
        });
    },
    /**
     * Sends a message to toggle the video fullscreen
     *
     * @param {Ext.field.Checkbox} checkButton
     */
    doToggleFullscreen: function(checkButton) {
        this.sendState({
            fullscreen: !!checkButton.getValue()
        });
    },
    /**
     * Sends a message to change the volume
     *
     * @param {Ext.field.Slider} sliderButton
     */
    doChangeVolume: function(sliderButton) {
        this.sendState({
            volume: sliderButton.getValue()
        });
    }
});