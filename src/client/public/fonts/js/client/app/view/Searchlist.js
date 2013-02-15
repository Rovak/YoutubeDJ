/**
 * Search page
 */
Ext.define('DJRazko.view.Searchlist', {
    extend: 'Ext.Panel',
    xtype: 'searchList',
    config: {
        layout: 'fit',
        items: [
            {
                id: 'searchList',
                xtype: 'list',
                onItemDisclosure: true,
                itemTpl: [
                    '<img src="{thumbnail.hqDefault}" style="float: left; height: 25px; padding-right: 10px">',
                    '<span>{title}</span>'
                ].join(''),
                plugins: [
                    {
                        xclass: 'Ext.plugin.ListPaging',
                        autoPaging: true
                    }
                ],
                store: {
                    fields: ['id', 'title', 'thumbnail'],
                    proxy: {
                        type: "ajax",
                        url: "/search",
                        reader: {
                            type: "json",
                            rootProperty: "data"
                        }
                    }
                },
            },
            {
                docked: 'top',
                xtype: 'toolbar',
                items: [
                    { xtype: 'spacer' },
                    { xtype: 'searchfield', id: 'searchBar' },
                    { xtype: 'spacer' }
                ]
            }
        ]
    }
});