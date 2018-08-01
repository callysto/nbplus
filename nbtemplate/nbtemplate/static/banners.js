function banner_injection(){
    // This function inserts banners into the notebooks by default, unless of course they already exist, then it does not.
    // However, this does assume that existing banners have a name containing "Callysto_Notebook-Banner" or
    // . If the banners have a different name, you'll find yourself in a notebook with double banners.
    // Truthfully this is probably not the _best_ way to do this, but I'm fairly certain we won't see those strings
    // in anyone's notebook outside of the context of showing off the banners. So this lazy solution can probably
    // be labelled as "not just good; it's good enough."


    // This links directly to the github images. It might be better to load from file, however, typing that path was more work than copying
    // a git image source. However, I will note that this way the banners will come along for the ride if someone were to save this and load
    // it using a local/alternate service. Certainly they could delete these cells, but at the very least loading these directly 
    // from the git site will enable the banners to work other places too. 

    var top_image_path = 'https://github.com/callysto/callysto-sample-notebooks/blob/master/notebooks/images/Callysto_Notebook-Banner_Top_06.06.18.jpg?raw=true';
    var bottom_image_path = 'https://github.com/callysto/callysto-sample-notebooks/blob/master/notebooks/images/Callysto_Notebook-Banners_Bottom_06.06.18.jpg?raw=true';
    var top_im = 'Callysto_Notebook-Banner_Top';
    var bottom_im = 'Callysto_Notebook-Banners_Bottom';
    var cells = Jupyter.notebook.get_cells();

    if (cells[0].notebook.container[0].textContent.indexOf(top_im) >= 0 ){
        // Banners exist, do nothing

    } else{
        // No banners yet (new, or legacy notebook), insert the banners. 
        Jupyter.notebook.insert_cell_above('markdown', 0).set_text("![alt text](" + top_image_path + ")")
    }

    if (cells[cells.length-1].notebook.container[0].textContent.indexOf(bottom_im) >= 0 ){
        // Banners exist, do nothing. 
    } else{
        Jupyter.notebook.insert_cell_below('markdown', cells.length ).set_text("![alt text](" + bottom_image_path + ")")
    }
  };


function insert_banners(){
if (Jupyter.notebook.get_cells().length > 0){
      // If the cells have length already, try and put banners in. 
      banner_injection()
} else{
    // If a notebook has a show/hide code button that affects all cells, this needs to wait until everything finishes
    // loading before the notebook cells get initialized. This also could be just an artifact of cell magics, I'm honestly
    // not sure. But with this we just wait for the window to finish loading before we stuff the banners in. I don't claim 
    // that this is an elegant solution, but it is _a_ solution. 
    window.onload = function () { 
        banner_injection()
    }
}
};
