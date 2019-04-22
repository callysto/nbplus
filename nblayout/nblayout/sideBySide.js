/*
*/

var cellIndex, cellElement;
if (typeof Jupyter !== "undefined") {
    var cellIndex = Jupyter.notebook.get_cell_elements().index(this.element.parents('.cell')),
        cellElement = Jupyter.notebook.get_cell(cellIndex).element[0];
}
else {
    var cellElement = element.closest(".cell")[0];
}

var cellInput = cellElement.getElementsByClassName('input')[0],
    innerCell = cellElement.getElementsByClassName('inner_cell')[0],
    outputWrapper = cellElement.getElementsByClassName('output_wrapper')[0];

cellElement.style.flexDirection = "row";
cellInput.style.width = "50%";
cellInput.style.height = "100%";
outputWrapper.style.width = "50%";
