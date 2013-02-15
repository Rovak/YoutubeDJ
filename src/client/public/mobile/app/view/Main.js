/**
 * Main view
 */
Ext.define('MobileDJ.view.Main', {
    extend: 'Ext.TabPanel',
    config: {
        tabBarPosition: 'bottom',
        ui: 'light',
        defaults: {
            scrollable: true
        },
        items: [
            {
                title: 'test',
                xtype: 'panel'
            },
            {
                title: 'Search',
                xtype: 'searchList'
            }
        ]

    }
});