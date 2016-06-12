"use strict";
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

import React from 'react';
import ReactDOM from 'react-dom';
import EntryBox from './EntryBox';

ReactDOM.render(
    <EntryBox />,
    document.getElementById('content')
);
