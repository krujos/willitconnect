"use strict";
import HeaderBar from './HeaderBar';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import React, { PropTypes } from 'react';

import { Grid, Row, Panel, Container } from 'react-bootstrap';


var EntryBox = React.createClass({
    handleEntrySubmit: function (entry) {
        var entries = this.state.data;
        var newEntries = entries.concat([entry]);
        this.setState({data: newEntries});
    },
    getInitialState: function () {

        return {data: []};
    },
    render: function () {

        mixpanel.track("page loaded");
        var bodyStyle = { 'padding' : 75};
        return (
            <Grid>
                <HeaderBar />
                <Row style={ bodyStyle }>
                    <Panel collapsible header="Instructions">
                        <ul>
                            <li>If <strong>Host</strong> lacks a scheme (example: <code>http://</code>) defaults to a socket connection</li>
                            <li>If <strong>Host</strong> has a <code>http</code> or <code>https</code> scheme,
                                it will use the proper default ports (<code>80</code> or <code>443</code>, respectively),
                                unless overridden</li>
                            <li>If the scheme is <code>http</code> or <code>https</code>, tries to make a GET request,
                                and reports data about the HTTP connection</li>
                            <li>If it's any other kind of scheme (example: <code>mysql://</code>) it will just make a socket connection</li>
                        </ul>
                    </Panel>
                    <EntryForm onEntrySubmit={this.handleEntrySubmit}/>
                    <EntryList data={this.state.data}/>
                </Row>
            </Grid>
        );
    }
});

module.exports = EntryBox;