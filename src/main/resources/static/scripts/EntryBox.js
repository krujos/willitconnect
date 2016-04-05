require('expose?$!expose?jQuery!jquery');
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

import HeaderBar from './HeaderBar';
import EntryForm from './EntryForm';
import EntryList from './EntryList';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { Col } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

import { Container } from 'react-bootstrap';
import { Input } from 'react-bootstrap';
import { ButtonInput } from 'react-bootstrap';

"use strict";

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
                        <EntryForm onEntrySubmit={this.handleEntrySubmit}/>
                        <EntryList data={this.state.data}/>
                </Row>
            </Grid>
        );
    }
});

ReactDOM.render(
    <EntryBox />,
    document.getElementById('content')
);
