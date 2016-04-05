import React from 'react';
import jQuery from 'jquery';

var Entry = React.createClass({
    getInitialState: function () {
        return {status: []};
    },
    getData: function() {
        if (this.props.proxyHost && this.props.proxyPort) {
            return JSON.stringify({"target": this.props.host+":"+
            this.props.port, "http_proxy" : this.props.proxyHost +
            ":" + this.props.proxyPort});
        }
        return JSON.stringify({"target": this.props.host+":"+this.props.port});
    },
    successFunc: function(data){
        mixpanel.track("connection attempted", {"canConnect":data.canConnect});
        this.setState({status: data});
    },
    componentWillMount: function () {
        var path = '/v2/willitconnect';
        jQuery.ajax ({
            url: path,
            type: "POST",
            data: this.getData(),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: this.successFunc
        });
    },
    render: function () {
        var connectionStyle = {color: 'blue'};
        var resultString = this.props.host;
        if(this.props.port) {
            resultString += ":" + this.props.port;
        }

        if(Object.keys(this.state.status).length) {
            connectionStyle = this.state.status.canConnect ? {color: 'green'} : {color: 'red'};
        }

        return (
            <div style={ connectionStyle }>
                <h3 className="entry">
                    {resultString}
                </h3>
            </div>
        );
    }
});

module.exports = Entry;