"use strict";

var $ = require('jquery');
var axios = require('axios');

// Dispaly spinner on load
var spinner = $('<div class="loader"></div>');
window.onload = function() {
    $('#spinner').html(spinner);
};

$(function () {
    const IMG_X = 'ttt-x.png';
    const IMG_O = 'ttt-o.png';

    // Get the position and place the players image
    function onMove() {
        var cell = $(this);
        var position = getCellLocation(cell);

        console.log(position[0] + ' x ' + position[1]);

        placeImage(cell, IMG_X);
    }

    // Return position coordinates of the cell
    // Ex. [0,2] is top right corner
    function getCellLocation(cell) {
        var $posA = cell.parent().index() + 1;
        var $posB = cell.index() + 1;

        return [$posA, $posB]
    }

    // Insert new image into the cell
    function placeImage(cell, img) {
        if (!cell.html()) {
            var imgEl = $("<img />", {"src": 'images/' + img});
            cell.html(imgEl);
        }
    }

    // Append image to the cell based on the cell type
    // layout: 0 => empty cell
    //         1 => player X
    //         2 => player O
    function appendImage(cellType, cell) {
        switch (cellType) {
            case 0:
                break;
            case 1:
                placeImage(cell, IMG_X);
                break;
            case 2:
                placeImage(cell, IMG_O);
                break;
        }
    }

    // Generate board based on the layout
    function drawBoard(layout) {
        var board = $('#board');
        var boardNew = board.clone();

        for (var i = 0; i < layout.length; i++) {
            var rows = layout[i];
            var rowEl = $('<div class="row"></div>').appendTo(boardNew);

            for (var j = 0; j < rows.length; j++) {
                var column = rows[j];
                var cell = $('<div class="cell"></div>')
                    .appendTo(rowEl)
                    .on('click', onMove);

                if (j !== 0 && j !== rows.length - 1) {
                    cell.addClass('v');
                }

                if (i !== 0 && i !== layout.length - 1) {
                    cell.addClass('h');
                }

                appendImage(column.type, cell);
            }
        }

        board.replaceWith(boardNew);
    }

    // Initiate new board layout by calling API
    function initBoard() {
        axios.get('http://localhost:8888/api/init')
            .then(function (response) {
                drawBoard(response.data.layout);
                spinner.hide();

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    initBoard();
});
