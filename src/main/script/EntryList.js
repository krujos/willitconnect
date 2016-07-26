import React from 'react';
import StatefulEntry from './Entry';

export default class EntryList extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {data: []};
    }
    render() {
        console.table(this.props.data);
        var entryNodes = this.props.data.map(function (entry, index) {
            return (
                <StatefulEntry host={entry.host} port={entry.port} status={entry.status} proxyHost={entry.proxyHost}
                       proxyPort={entry.proxyPort} key={index}/>
            );
        }).reverse();
        return (
            <div className="entryList">
                {entryNodes}
            </div>
        );
    }
};
