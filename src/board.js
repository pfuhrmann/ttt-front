"use strict";

import $ from 'jquery';
import api from './api';

const IMG_X = 'ttt-x.png';
const IMG_O = 'ttt-o.png';
const CELL_EMPTY = 0;

exports.Board = class Board {
    constructor(backendApiUrl, callback) {
        this.board = $('#board');
        this.message = $('#message');
        this.api = new api.ApiClient(backendApiUrl);
        this.initBoard(callback);
        this.initResetBtn();
    }

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

    // Returns message about status for the UI
    static getUserMessage(status) {
        if (!status) {
            return 'Start by placing X on the board';
        }

        switch (status[0].state) {
            case 'win':
                return 'Plate ' + Board.getWinner(status[1].winner) + ' WON !!!';
            case 'draw':
                return 'It is DRAW !!!';
            case 'ongoing':
                return 'Your turn ...';
        }
    }

    // Returns name based on the winner number
    static getWinner(winner) {
        return (winner === 1) ? 'X' : 'O';
    }

    // Initialize board
    initBoard(callback) {
        let that = this;
        this.api.init(function (response) {
            callback();
            that.updateBoard(response);
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
        if (this.layout[position[0]][[position[1]]].type !== CELL_EMPTY) {
            // Prevent any action if cell is empty
            return;
        }

        let that = this;
        // Speeding up perception of placement however replaced later
        Board.placeImage(cell, IMG_X);

        this.api.move(position, this.layout, 'clueless', function (response) {
            that.updateBoard(response);
        });
    }

    // Initiate reset button
    initResetBtn() {
        let that = this;
        $('#reset').on('click', function () {
            that.initBoard();
        }).show();
    }

    // Create new cell element
    createCell() {
        let that = this;
        return $('<div class="cell"></div>')
            .on('click', function () {
                that.onMove($(this));
            });
    }

    updateBoard(response) {
        this.layout = response.data.layout;
        this.renderBoard(this.layout);
        this.setMessage(Board.getUserMessage(response.data.status));
    }

    // Send UI message to the user
    setMessage(text) {
        this.message.html(text);
    }
};
