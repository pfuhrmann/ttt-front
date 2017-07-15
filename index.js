"use strict";

let $ = require('jquery');
let axios = require('axios');

$(document).ready(function() {
    function onCellClick() {
        let cell = $(this);
        let position = getCellLocation(cell);

        console.log(position[0] + ' x ' + position[1]);

        placeX(cell);
    }

    function getCellLocation(cell) {
        let $posA =  cell.parent().index() + 1;
        let $posB = cell.index() + 1;

        return [$posA, $posB]
    }

    function placeX(cell) {
        if (!cell.html()) {
            let img = $("<img />",{"src":'images/ttt-x.png'});
            cell.html(img);
        }
    }

    function initBoard() {
        axios.get('http://localhost:8888/api/init')
            .then(function (response) {
                drawBoard(response.data.layout);

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function drawBoard(layout) {
        let board = $('#board');

        for (var i=0; i<layout.length; i++) {
            let row = layout[i];
            let rowEl = $('<div class="row"></div>').appendTo(board);

            for (var j=0; j<row.length; j++) {
                let column = row[j];
                let columnEl = $('<div class="cell"></div>')
                    .appendTo(rowEl)
                    .on('click', onCellClick);

                if (j !== 0 && j !== row.length - 1) {
                    columnEl.addClass('v');
                }

                if (i !== 0 && i !== layout.length - 1) {
                    columnEl.addClass('h');
                }
            }
        }
    }

    initBoard();
});
