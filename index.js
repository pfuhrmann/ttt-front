"use strict";

import $ from 'jquery';
import board from './src/board';

// Display initial loading spinner
let spinner = $('<div class="loader"></div>');
window.onload = function () {
    $('#spinner').html(spinner);
};

$(function () {
    // Initiate new gaming board
    function initBoard() {
        new board.Board;
    }

    initBoard();
});
