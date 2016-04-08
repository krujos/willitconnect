import Entry from './Entry';
import React from 'react';

var EntryList = React.createClass({
    getInitialState: function () {
        return {data: []};
    },
    render: function () {
        var entryNodes = this.props.data.map(function (entry, index) {
            return (
                <Entry host={entry.host} port={entry.port} status={entry.status} proxyHost={entry.proxyHost}
                       proxyPort={entry.proxyPort} key={index}/>
            );
        });
        return (
            <div className="entryList">
                {entryNodes}
            </div>
        );
    }
});

module.exports = EntryList;