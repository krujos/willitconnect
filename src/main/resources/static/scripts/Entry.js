import React from 'react';
import jQuery from 'jquery';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Panel from 'react-bootstrap/lib/Panel';

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
        mixpanel.track("connection attempted", { "canConnect": data.canConnect,
            "httpStatus": data.httpStatus, "validHostName":data.validHostName,
            "validUrl":data.validUrl});
        console.log(data);
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
        var panelStyle = "info";

        var gotResults = Object.keys(this.state.status).length;

        var resultString = this.props.host;
        if(this.props.port) {
            resultString += ":" + this.props.port;
        }
        if(this.props.proxyHost){
            resultString += " proxied through " + this.props.proxyHost;
        }
        if(this.props.proxyPort) {
            resultString += ":" + this.props.proxyPort;
        }

        var workingResult = "";
        if (!gotResults) {
            workingResult = (
            <ProgressBar active now={100}/>
            )
        }

        var statusReport = "";

        if(Object.keys(this.state.status).length) {
            if(this.state.status.canConnect){
                panelStyle = "success";
            } else {
                panelStyle = "danger";
            }

            if(this.state.status.httpStatus && this.state.status.httpStatus != 0) {
                statusReport = (
                    <ul>
                        <li>HttpStatus: {this.state.status.httpStatus}</li>
                    </ul>
                );
            }
        }

        return (
            <Panel collapsible defaultExpanded bsStyle={panelStyle} header={resultString}>
                {workingResult}
                {statusReport}
            </Panel>
        );
    }
});

module.exports = Entry;