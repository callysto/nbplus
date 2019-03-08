// If you have other notebook templates, you can simply add them here. You (should) have access to the functions
// simply as var variable = injectMyTemplate() in selector.js.


function injectLabTemplate(){
    // This function inject the lab templates. I have moved this to a separate file to avoid making selector.js
    // an annoying mess with all these cell injections. 
    var cells = Jupyter.notebook.get_cells();
    if (cells.length > 1){
        // Make sure we don't inject this in someone's work making it annoying to clean up.
        // NOTE: If we inject banners into the notebook with a separate function, we will have to change
        // the length check/check if only banners exist. Because this is a pretty lazy check. 
        Jupyter.notebook.insert_cell_above('markdown', 0).set_text("In order to use the templates, please open a new notebook.")
        return
    }
    
    Jupyter.notebook.insert_cell_above('markdown', 0).set_text("![alt text](https://github.com/callysto/callysto-sample-notebooks/blob/master/notebooks/images/Callysto_Notebook-Banner_Top_06.06.18.jpg?raw=true)")
    Jupyter.notebook.insert_cell_below('markdown', 0).set_text("# Lab Report Template \n \n This is the generic lab report template that can be customized for use with student lab reports. For a tutorial on the use of some of the functions used here please [click this link](path to tutorial). If it is your first time using the template, we recommend you read the tutorial before going further.")
    Jupyter.notebook.insert_cell_below('code' , 1).set_text("# Importing our helper functions \nfrom lab_template_helpers import easy_table, graph_table")
    Jupyter.notebook.insert_cell_below('markdown', 2).set_text(" # Background \n \n Describe the background and motivation of the laboratory here. \n \n # Experimental Procedure \n \n Explain the experimental procedure here \n \n # Student Hypothesis \n \n Have students explain their hypothesis here after reading the background and experimental procedure. \n \n # Pre-lab Questions \n \n If you have pre lab questions, enter them here. \n \n 1. Question 1 \n 1. Question 2 \n 1. Question 3. \n 1. ... \n\n## Create A Blank Table\n\nYou can create and save a blank table here.\n\nNOTE: You can remove this cell once you've created the file, or get the students to create their own tables themselves.")
    Jupyter.notebook.insert_cell_below('code', 4).set_text("easy_table.create_table('data_table_file.csv')")
    Jupyter.notebook.insert_cell_below('markdown', 5).set_text("# Load Your Created Table") 
    Jupyter.notebook.insert_cell_below('code', 6).set_text('my_table = easy_table.load_table("data_table_file.csv")\nmy_table')
    Jupyter.notebook.insert_cell_below('markdown',7).set_text("# Load Online Or Local CSV\n\n Note: If it is a local file to your/your student's hub account, simply type the file path in below instead of a url.")
    Jupyter.notebook.insert_cell_below('code', 8).set_text('online_table = easy_table.load_table("https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv", \n                      external=True)\nonline_table')
    Jupyter.notebook.insert_cell_below('markdown',9).set_text("# Graph Results Of Table")
    Jupyter.notebook.insert_cell_below('code', 10).set_text('graph_table.graph_from_table(online_table)')
    Jupyter.notebook.insert_cell_below('markdown',11).set_text("# Student Findings And Results \n\n## Discussion \n\nYour discussion of your findings and results go here. \n\n## Conclusion \n\nYour conclusions go here.")
    Jupyter.notebook.insert_cell_below('markdown', 12).set_text("![alt text](https://github.com/callysto/callysto-sample-notebooks/blob/master/notebooks/images/Callysto_Notebook-Banners_Bottom_06.06.18.jpg?raw=true)")
                                                         
};

