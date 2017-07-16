"use strict";

let $ = require('jquery');
let api = require('./api');
api = new api.ApiClient('http://localhost:8888/api/');

const IMG_X = 'ttt-x.png';
const IMG_O = 'ttt-o.png';

exports.Board = class Board {
    constructor() {
        this.spinner = $('#spinner');
        this.board = $('#board');
        this.initBoard();
    }

    // Ex. [0,2] is top right corner
    static getCellLocation(cell) {
        let posA = cell.parent().index() + 1;
        let posB = cell.index() + 1;

        return [posA, posB]
    }

    // Insert new image into the cell
    static placeImage(cell, img) {
        if (!cell.html()) {
            let imgEl = $("<img />", {"src": 'images/' + img});
            cell.html(imgEl);
        }
    }

    // Initialize board
    initBoard(callback) {
        let that = this;
        api.init(function (response) {
            console.log(response);
            that.layout = response.data.layout;
            that.renderBoard(that.layout);
            that.spinner.hide();
        });
    }

    // Return position coordinates of the cell

    // Generate board based on the layout
    renderBoard(layout) {
        // Cloning to eventually replace for smoother UI
        let boardNew = this.board.clone().empty();

        for (let i = 0; i < layout.length; i++) {
            let rows = layout[i];
            let rowEl = $('<div class="row"></div>').appendTo(boardNew);

            for (let j = 0; j < rows.length; j++) {
                let column = rows[j];
                let cell = $('<div class="cell"></div>')
                    .appendTo(rowEl)
                    .on('click', this.onMove);

                if (j !== 0 && j !== rows.length - 1) {
                    cell.addClass('v');
                }

                if (i !== 0 && i !== layout.length - 1) {
                    cell.addClass('h');
                }

                this.appendImage(column.type, cell);
            }
        }

        this.board.replaceWith(boardNew);
    }

    // Get the position and place the players image
    onMove() {
        let cell = $(this);
        let position = Board.getCellLocation(cell);
        let that = this;

        // Speeding up perception of placement however replaced later
        Board.placeImage(cell, IMG_X);
        console.log(position[0] + ' x ' + position[1]);
        api.move(position, layout, function (response) {
            that.layout = response.data.layout;
            that.renderBoard(layout);
        });
    }

    // Append image to the cell based on the cell type
    // layout: 0 => empty cell
    //         1 => player X

    //         2 => player O
    appendImage(cellType, cell) {
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
};
