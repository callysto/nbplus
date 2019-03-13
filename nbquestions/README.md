# nbquestions

## Usage

### Multiple Choice

``` python
from nbquestions import create_multiple_choice

def success():
	print("Explanation for why the answer is correct...")

widget = create_multiple_choice(["Correct", "Wrong", "Also Wrong", "Very Wrong"], success_callback=success)
display(widget)
```

Creating a multiple choice question is easy. The only required argument is a
list of two to five possible answers where the first element is assumed to be 
the correct answer. The order of the answers is randomized before being
displayed.

You can also pass an optional callback that will be called when the correct
answer is chosen. Usually you'll want to use this to provide an explanation of
why the answer is correct. The example just prints text but you can do whatever
you want, whether displaying math formulas with LaTeX or showing an image.

### Text

``` python
import ipywidgets as widgets
from nbquestions import create_text_callback

def success():
	print("Yes, George Orwell did write 1984!")
	
def failure():
	print("Actually it was George Orwell who wrote 1984.")

widget = widgets.Text(description="Who wrote the book 1984?", placeholder="Author's name")
callback = create_text_callback("George Orwell", 3,
	hints=["First name starts with G", "Last name starts with O"],
	ignore_case=True, ignore_whitespace=True,
	success_callback=success, failure_callback=failure)
widget.on_submit(callback)
display(widget)
```

For text responses, the helper function actually creates a callback intended to
be passed to the `on_submit()` method of a text widget. The first argument is
the answer and the second argument is the number of attempts allowed. These are
the only required arguments, everything else is optional.

Hints is a list of messages that will be displayed when the answer is incorrect.
Ideally there should a number of hints equal to one less than the number of
attempts. If there are less, the last hint will be repeated. If there are more,
they will be ignored.

You can also ignore case and whitespace (e.g. `GeOrgeorWELL` would be correct in
this example). By default these are both set to `False`.

Finally you can pass callbacks for when the user answers correctly or when
they've used up all of their attempts. Generic success and failure messages are
printed regardless so can pass the same function for both callbacks or none at
all depending on your needs.
