# nblayout

TBA

## nbmore
An extension to add a "more" button to show/hide extra text. Useful when extra text could be used to add to a concept but is not essential.

To use this feature:
1.  Write the text within a regular markdown cell
2.  Add `<div class="hideMe">` at the top of the markdown cell
3.  Create a new code cell following the markdown cell and enter `%toggleMore`

When the code cell is run it will provide a button labeled "More" which will show / hide the markdown cell.

#### Markdown cell
```
<div class="hideMe">
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

```

#### Preceding code cell
`%toggleMore`
