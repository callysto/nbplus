"""Helpful functions for common notebook tasks.

This module provides helper functions to help reduce the amount of boilerplate
code required for common notebook tasks. Currently it handles creating multiple
choice questions and callbacks for text response questions.

"""

import random

import ipywidgets as widgets


def create_text_callback(answer, attempts, hints=None, ignore_case=False, ignore_whitespace=False,
                         success_callback=None, failure_callback=None):
    """Creates a callback for answering a question via a text widget.

    If provided, the hints list should contain a number of hints equal to at
    most one less than the number of attempts; any more will be ignored.

    Args:
        answer (str): The correct answer.
        attempts (int): The maximum number of attempts allowed.
        hints (List[str], optional): Messages to be displayed for incorrect answers.
        ignore_case (bool, optional): Ignore case when checking if an answer is correct.
        ignore_whitespace (bool, optional): Ignore whitespace when checking if an answer is correct.
        success_callback (Callable, optional): Called when the correct answer is submitted.
        failure_callback (Callable, optional): Called when all attempts have been used.

    Returns:
        Callable: Callback to provide to `on_submit` of a text widget.
    """
    def callback(widget):
        nonlocal answer
        answer_string = str(answer)
        value = str(widget.value)

        if ignore_case:
            answer_string = answer_string.lower()
            value = value.lower()
        if ignore_whitespace:
            answer_string = answer_string.replace(" ", "")
            value = value.replace(" ", "")

        if value == answer_string:
            print("Correct!\n")
            widget.disabled = True
            if success_callback is not None:
                success_callback()
        else:
            callback.attempt += 1
            if callback.attempt >= attempts:
                widget.disabled = True
                if failure_callback is not None:
                    print("Sorry, that's not right.\n")
                    failure_callback()
                else:
                    print("Sorry, the correct answer is {}.".format(answer))
            else:
                print("Try again.\n")
                hint = _get_hint(callback.attempt - 1, hints)
                if hint is not None:
                    print(hint + "\n")

    callback.attempt = 0
    return callback


def create_multiple_choice(choices, answer=0, success_callback=None):
    """Creates a widget for a multiple choice question.

    Args:
        choices (List[str]): The possible answers, up to a maximum of five.
        answer (int, optional): The index of the correct answer in the ``choices`` list.
        succes_callback (Callable, optional): Called when the correct answer is picked.

    Returns:
        HBox: Widget to be displayed.
    """
    letters = ["A", "B", "C", "D", "E"]
    answer_text = choices[answer]

    start_bold = "\033[1m"
    end_bold = "\033[0;0m"

    random.shuffle(choices)

    for i, choice in enumerate(choices):
        print(start_bold + letters[i] + ")" + end_bold + " " + choice)

        if choice == answer_text:
            answer = letters[i]

    buttons = []

    for i in range(len(choices)):
        buttons.append(widgets.Button(description=letters[i]))

    _reset_colours(buttons)

    container = widgets.HBox(children=buttons)

    def on_button_clicked(button):
        _reset_colours(buttons)

        if button.description == answer:
            for b in buttons:
                b.disabled = True
            button.style.button_color = "Moccasin"
            print("Correct!     \n")
            if success_callback is not None:
                success_callback()
        else:
            print("Try again.", end="\r")
            button.style.button_color = "Lightgray"

    for button in buttons:
        button.on_click(on_button_clicked)

    return container


def _get_hint(attempt, hints):
    if hints is None or not hints:
        return None

    if attempt >= len(hints):
        return hints[-1]

    return hints[attempt]


def _reset_colours(buttons):
    for button in buttons:
        button.style.button_color = "Whitesmoke"
