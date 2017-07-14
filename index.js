var $ = require("jquery");

$('div.cell').on('click', onCellClick);

function onCellClick() {
    var cell = $(this);
    var position = getCellLocation(cell);

    console.log(position[0] + ' x ' + position[1]);

    placeX(cell);
}

function getCellLocation(cell) {
    var $posA =  cell.parent().index() + 1;
    var $posB = cell.index() + 1;

    return [$posA, $posB]
}

function placeX(cell) {
    if (!cell.html()) {
        var img = $("<img />",{"src":'images/ttt-x.png'});
        cell.html(img);
    }
}
