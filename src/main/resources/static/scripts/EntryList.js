import React from 'react';
import StatefulEntry from './Entry';

var EntryList = React.createClass({
    getInitialState: function () {
        return {data: []};
    },
    render: function () {
        var entryNodes = this.props.data.map(function (entry, index) {
            return (
                <StatefulEntry host={entry.host} port={entry.port} status={entry.status} proxyHost={entry.proxyHost}
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