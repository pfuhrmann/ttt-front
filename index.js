"use strict";

let $ = require('jquery');
let board = require('./src/board');

// Display initial loading spinner
let spinner = $('<div class="loader"></div>');
window.onload = function() {
    $('#spinner').html(spinner);
};

$(function () {
    // Initiate new gaming board
    function initBoard() {
        board = new board.Board;
    }

    initBoard();
});
