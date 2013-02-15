/**
 * Main Controller
 */
Ext.define('MobileDJ.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            searchList: '#searchList',
            searchBar: '#searchBar'
        },
        control: {
            searchList: {
                disclose: 'doPlaySong'
            },
            searchBar: {
                action: 'doSearch'
            }
        }
    },
    /**
     * Enqueue a song for the dj server
     *
     * @param {Ext.data.Model} record The selected record
     * @param {Ext.Button} btn Button
     * @param {Integer} index
     */
    doPlaySong: function(list, record, btn, index) {
        var data = record.getData();
        socket.emit('video', {
            title: data.title,
            image: data.thumbnail.hqDefault,
            id: data.id
        });
    },
    /**
     * Execute a search
     *
     * @param {Ext.field.Search} field Searchfield
     */
    doSearch: function(field) {
        var store = this.getSearchList().getStore();
        store.removeAll();
        store.load({
            limit: 25,
            start: 1,
            page: 1,
            params: {
                q: field.getValue()
            }
        });
    }
});