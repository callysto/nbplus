// file nbvis/js/mb.js
/* MathBox configuration for the nbvis module
   Assembled by Eric Easthope for Callysto
   MIT License
*/

// append a div to the cell output
var div = document.createElement("div");
element[0].appendChild(div);

// append a MathBox canvas to the div and set its dimensions
var mathbox = mathBox({element: element[0].firstChild});
mathbox.three.element.style.width = #width;
mathbox.three.element.style.height = #height;

// prompt the canvas to resize
window.dispatchEvent(new Event("resize"));