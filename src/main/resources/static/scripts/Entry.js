import React from 'react';
import jQuery from 'jquery';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Panel from 'react-bootstrap/lib/Panel';

var StatefulEntry = React.createClass({
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

        const pending = this.state.status == null
        const success = !pending && this.state.status.canConnect

        return (
            <Result header={ resultString } pending={ pending } success={ success }>
                { !pending &&
                    <Entry
                        success={ success }
                        httpStatus={ this.state.status.httpStatus }
                        time={ this.getLastChecked() }
                    />
                }
            </Result>
        );
    }
});
export default StatefulEntry;

function getPanelStyle ( pending, success ) {
    if ( success ) {
        return "success";
    }
    if ( pending ) {
        return "info";
    }
    return "danger";
}
export const Result = ( { success, pending, children, ...props }) =>
    <Panel collapsible bsStyle={ getPanelStyle( pending, success ) } defaultExpanded { ...props }>
        { pending && <ProgressBar active now={100}/> }
        { children }
    </Panel>



export const Entry = ( {
    success,
    httpStatus,
    time,
} ) =>
    <ul>
        <li>I { success ? 'can' : 'cannot' } connect </li>
        { httpStatus !=0 && <li>Http Status: { httpStatus } </li> }
        <li>Time checked: { time }</li>
    </ul>

// canConnect:true
// entry:"http://google.com:80"
// httpProxy:null
// httpStatus:200
// lastChecked:1460687063373
// validHostname:false
// validUrl:true


// module.exports = StatefulEntry;
