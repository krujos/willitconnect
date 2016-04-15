import React from 'react';
import jQuery from 'jquery';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Panel from 'react-bootstrap/lib/Panel';

var Entry = React.createClass({
    getInitialState: function () {
        return {status: []};
    },
    getLastChecked: function() {
            var utcSeconds = parseInt(this.state.status.lastChecked);
            var date = new Date(utcSeconds);
            var month = date.getMonth();
            var day = date.getDay();
            var year = date.getFullYear();

            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = month + "-" + day + "-" + year + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return formattedTime;
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

            statusReport = (
                <ul>
                    {this.state.status.canConnect ? <li> I can connect </li> : <li> I cannot connect </li> }
                    {this.state.status.httpStatus && this.state.status.httpStatus != 0 ? <li>Http Status: {this.state.status.httpStatus}</li> : null }
                    {this.state.status.lastChecked ? <li>Time checked: {this.getLastChecked()}</li> : null }
                </ul>
            );
        }

        return (
            <Panel collapsible defaultExpanded bsStyle={panelStyle} header={resultString}>
                {workingResult}
                {statusReport}
            </Panel>
        );
    }
});

// canConnect:true
// entry:"http://google.com:80"
// httpProxy:null
// httpStatus:200
// lastChecked:1460687063373
// validHostname:false
// validUrl:true


module.exports = Entry;