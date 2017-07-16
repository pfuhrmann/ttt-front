"use strict";

import $ from 'jquery';
import api from './api';

const IMG_X = 'ttt-x.png';
const IMG_O = 'ttt-o.png';

exports.Board = class Board {
    // Return position coordinates of the cell
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

    constructor() {
        this.spinner = $('#spinner');
        this.board = $('#board');
        this.api = new api.ApiClient('http://localhost:8888/api/');
        this.initBoard();
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

    // Generate board based on the layout
    renderBoard(layout) {
        // Cloning to eventually replace for smoother UI
        let boardNew = this.board.clone().empty();

        for (let i = 0; i < layout.length; i++) {
            let rows = layout[i];
            let rowEl = $('<div class="row"></div>').appendTo(boardNew);

            for (let j = 0; j < rows.length; j++) {
                let column = rows[j];
                let cell = this.createCell().appendTo(rowEl);

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

    // On the move
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

    // Create new cell element
    createCell() {
        let that = this;
        return $('<div class="cell"></div>')
            .on('click', function () {
                that.onMove($(this));
            });
    }
};
