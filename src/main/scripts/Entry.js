import React from 'react';
import jQuery from 'jquery';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Panel from 'react-bootstrap/lib/Panel';

export default class StatefulEntry extends React.Component {
    constructor(props) {
        super(props);
        this.getLastChecked = this.getLastChecked.bind(this);
        this.getResultString = this.getResultString.bind(this);
        this.getData = this.getData.bind(this);
        this.successFunc = this.successFunc.bind(this);
    }

    componentDidMount() {
        var path = '/v2/willitconnect';
        console.log(this.props.host);
        jQuery.ajax({
            url: path,
            type: "POST",
            cache: false,
            data: this.getData(),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: this.successFunc
        });
    }
    getLastChecked() {
        var utcSeconds = parseInt(this.state.status.lastChecked);
        var date = new Date(utcSeconds);
        var month = date.getMonth();
        var day = date.getDay();
        var year = date.getFullYear();

        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        return (month + "-" + day + "-" + year + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
    }
    getResultString() {
        var resultString = this.props.host;
        if (this.props.port) {
            resultString += ":" + this.props.port;
        }
        if (this.props.proxyHost) {
            resultString += " proxied through " + this.props.proxyHost;
        }
        if (this.props.proxyPort) {
            resultString += ":" + this.props.proxyPort;
        }
        return resultString;
    }
    successFunc(data) {
        mixpanel.track("connection attempted", {
            "canConnect": data.canConnect,
            "httpStatus": data.httpStatus, "validHostName": data.validHostName,
            "validUrl": data.validUrl
        });
        this.setState({status: data});
    }
    getData() {
        //console.log({"target": this.props.host + ":" + this.props.port});
        if (this.props.proxyHost && this.props.proxyPort) {
            return JSON.stringify({
                "target": this.props.host + ":" +
                this.props.port, "http_proxy": this.props.proxyHost +
                ":" + this.props.proxyPort
            });
        }
        return JSON.stringify({"target": this.props.host + ":" + this.props.port});
    }
    render() {

        const pending = (this.state == null || this.state.status == null);
        const success = !pending && this.state.status.canConnect;
        if(!pending) {
            //console.table(this.state.status)
        }

        return (<Result header={ this.getResultString() } pending={ pending } success={ success }>
                { !pending &&
                <Entry
                    success={ success }
                    httpStatus={ this.state.status.httpStatus }
                    time={ this.getLastChecked() }
                />
                }
            </Result>);
    }
}



function getPanelStyle(pending, success) {
    if (success) {
        return "success";
    }
    if (pending) {
        return "info";
    }
    return "danger";
}

export const Result = ({success, pending, children, ...props}) =>
    <Panel collapsible bsStyle={ getPanelStyle( pending, success ) } defaultExpanded { ...props }>
        { pending && <ProgressBar active now={100}/> }
        { children }
    </Panel>;

export const Entry = ({
    success,
    httpStatus,
    time,
}) =>
    <ul>
        <li>I { success ? 'can' : 'cannot' } connect</li>
        { httpStatus != 0 && <li>Http Status: { httpStatus } </li> }
        <li>Time checked: { time }</li>
    </ul>;

