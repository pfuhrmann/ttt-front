"use strict";

let $ = require('jquery');
let api = require('./api');

const IMG_X = 'ttt-x.png';
const IMG_O = 'ttt-o.png';

exports.Board = class Board {
    constructor() {
        this.spinner = $('#spinner');
        this.board = $('#board');
        this.api = new api.ApiClient('http://localhost:8888/api/');
        this.initBoard();
    }

    // Ex. [0,2] is top right corner
    static getCellLocation(cell) {
        let posA = cell.parent().index();
        let posB = cell.index();

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
    initBoard() {
        let that = this;
        this.api.init(function (response) {
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
                let that = this;
                let cell = $('<div class="cell"></div>')
                    .appendTo(rowEl)
                    .on('click', function() {
                        that.onMove($(this));
                    });

                if (j !== 0 && j !== rows.length - 1) {
                    cell.addClass('v');
                }

                if (i !== 0 && i !== layout.length - 1) {
                    cell.addClass('h');
                }

                Board.appendImage(column.type, cell);
            }
        }

        this.board.html(boardNew);
    }

    onMove(cell) {
        let position = Board.getCellLocation(cell);
        let that = this;

        // Speeding up perception of placement however replaced later
        Board.placeImage(cell, IMG_X);

        this.api.move(position, this.layout, function (response) {
            that.layout = response.data.layout;
            that.renderBoard(that.layout);
        });
    }

    // Append image to the cell based on the cell type
    // layout: 0 => empty cell
    //         1 => player X

    //         2 => player O
    static appendImage(cellType, cell) {
        switch (cellType) {
            case 0:
                break;
            case 1:
                Board.placeImage(cell, IMG_X);
                break;
            case 2:
                Board.placeImage(cell, IMG_O);
                break;
        }
    }
};
