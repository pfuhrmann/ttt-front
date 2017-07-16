"use strict";

import axios from 'axios';

exports.ApiClient = class ApiClient {
    constructor(baseUri) {
        this.baseUri = baseUri;
    }

    // Initiate new board
    init(callback) {
        axios.get(this.url('init'))
            .then(callback)
            .catch(function (error) {
                console.log(error);
            });
    }

    // Make a move
    move(position, layout, botName, callback) {
        axios.post(this.url('move'), {
                position: position,
                layout: layout,
                botName: botName
            })
            .then(callback)
            .catch(function (error) {
                console.log(error);
            });
    }

    url(slug) {
        return this.baseUri + slug;
    }
};
