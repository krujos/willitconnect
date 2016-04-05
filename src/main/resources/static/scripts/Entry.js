import React from 'react';
import jQuery from 'jquery';

var Entry = React.createClass({
    getInitialState: function () {
        return {status: []};
    },

    getData: function() {
        return JSON.stringify({"target": this.props.host+":"+this.props.port});
    },

    componentWillMount: function () {

        var path;

        if (this.props.proxyHost && this.props.proxyPort) {
            path = '/willitconnectproxy?host=' + this.props.host + '&port=' + this.props.port + '&proxyHost=' + this.props.proxyHost + '&proxyPort=' + this.props.proxyPort;
            $.get(path, function (status) {
                this.setState({status: status.indexOf("cannot") > -1 ? {'canConnect': false} : {'canConnect': true}});
            }.bind(this));
        }
        else {
            path = '/v2/willitconnect';
            jQuery.ajax ({
                url: path,
                type: "POST",
                data: this.getData(),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    mixpanel.track("connection attempted", {"canConnect":data.canConnect});
                    this.setState({status: data});
                }.bind(this)
            });
        }
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