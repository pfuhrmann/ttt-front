"use strict";

import $ from 'jquery';
import api from './api';

const IMG_X = 'ttt-x.png';
const IMG_O = 'ttt-o.png';
const CELL_EMPTY = 0;
const STATE_WIN = 'win';
const STATE_DRAW = 'draw';
const STATE_ONGOING = 'ongoing';

exports.Board = class Board {
    constructor(backendApiUrl, callback) {
        this.board = $('#board');
        this.message = $('#message');
        this.api = new api.ApiClient(backendApiUrl);
        this.gameState = STATE_ONGOING;
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
    getUserMessage(status) {
        this.gameState = (status) ? status.state : STATE_ONGOING;

        if (!status) {
            return 'Start by placing X on the board';
        }

        switch (this.gameState) {
            case STATE_WIN:
                let winner = status.winner;
                if (winner === 1) {
                    return 'You WON :) !!!';
                }
                return 'You LOST :( !!!';
            case STATE_DRAW:
                return 'It is DRAW !!!';
            case STATE_ONGOING:
                return 'Your turn ...';
        }
    }

    // Initialize board
    initBoard(callback) {
        let that = this;
        this.api.init(function (response) {
            that.updateBoard(response);
            if (callback) {
                callback();
            }
        });
    }

    // Generate board based on the layout
    renderBoard() {
        let layout = this.layout;
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
        // Prevent any action if cell is empty or game ended
        if (this.layout[position[0]][[position[1]]].type !== CELL_EMPTY) return;
        if (this.gameEnded()) return;

        // Speeding up perception of placement however replaced later
        Board.placeImage(cell, IMG_X);

        let that = this;
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
        this.renderBoard();
        this.setMessage(this.getUserMessage(response.data.status));
    }

    // Send UI message to the user
    setMessage(text) {
        this.message.html(text);
    }

    gameEnded() {
        return this.gameState === STATE_WIN || this.gameState === STATE_DRAW
    }
};
