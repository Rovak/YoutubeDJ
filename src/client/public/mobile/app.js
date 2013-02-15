Ext.application({
    name: 'MobileDJ',
    appFolder: '/mobile/app/',
    requires: [
        // Nothing right now
    ],
    views: [
        'Main',
        'Searchlist',
        'Settings'
    ],
    controllers: [
        'Main',
        'Settings'
    ],
    launch: function() {
        Ext.Viewport.add({
            xtype: 'tabpanel',
            tabBarPosition: 'bottom',
            items: [
                {
                    title: 'Search',
                    iconCls: 'search',
                    xtype: 'searchList'
                },
                {
                    title: 'Settings',
                    iconCls: 'settings',
                    xtype: 'settings'
                }
            ]
        });
    }
});
