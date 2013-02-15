/**
 * Settings page
 */
Ext.define('MobileDJ.view.Settings', {
    extend: 'Ext.form.FormPanel',
    xtype: 'settings',
    id: "settings",
    config: {
        items: [
             {
                xtype: 'toolbar',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'forward',
                        text: 'Next',
                        itemId: 'buttonNext'
                    },
                    { xtype: 'spacer' }
                ]
            },
            {
                xtype: 'togglefield',
                name: 'qrcode',
                label: 'QR Code',
                itemId: 'toggleQR'
            },
            {
                xtype: 'togglefield',
                name: 'fullscreen',
                label: 'Fullscreen',
                itemId: 'toggleFullscreen'
            },
            {
                xtype: 'sliderfield',
                name: 'volume',
                label: 'Volume',
                maxValue: 100,
                minValue: 0,
                value: 50,
                itemId: 'changeVolume'
            }
        ]
    }
});