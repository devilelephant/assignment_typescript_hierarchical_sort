# Hierarchical Sort

For this challenge, you must create a sort function that will sort a dataset in a hierarchical manner.
A bit like how you can sort things in a spreadsheet pivot table.

Use your function to sort the `data-big-input.txt` file by `net_sales_units`, from highest to lowest,
except for totals / subtotals which always need to stay at the top of the group.


## Dataset Format

The raw datasets are pipe-delimited CSV files / strings. We've attached some examples at the bottom of this gist.

The dataset's columns are:
- Properties: `property0`, `property1`, ..., `propertyN`
- Metrics: _any non-property column_


## Example

Here's an example dataset input with 2 properties, and one metric (`net_sales`).

|property0|property1|net_sales|
|---------|---------|-----|
| bar     | $total  | -200|
| foo     | sauce   |  300|
| $total  | $total  |  200|
| bar     | sup     | -400|
| foo     | $total  |  400|
| bar     | bro     |  200|
| foo     | lettuce |  100|

The sort function should produce an output that's sorted like this:

|property0|property1|net_sales|
|---------|---------|-----|
| $total  | $total  |  200|
| foo     | $total  |  400|
| foo     | sauce   |  300|
| foo     | lettuce |  100|
| bar     | $total  | -200|
| bar     | bro     |  200|
| bar     | sup     | -400|

### Explanation

Let's reformat the data, to visualize its hierarchy:

```
/$total/$total

/foo/$total
/foo/sauce
/foo/lettuce

/bar/$total
/bar/bro
/bar/sup
```

The general idea is:

```
/.../$total/$total
/.../propertyN-1/$total
/.../propertyN-1/propertyN
```

If a property's value is `$total`, it means that the row represents the total for its level.

The total rows rank higher than all other rows in the level, regardless of the sorting criteria. In our example, the `/bar/$total` is not the highest value in the `/bar` group, but it's still at the top.

The non-$total values are sorted against all other values within a parent's grouping.


## Instructions

### What to submit

- A secret gist or zip/tarball containing:
  - A program that can read an input dataset and produce a hierarchically sorted output
  - An output file created by your program:
    - Using `data-big-input.txt` as the input dataset
    - Sorted on the `net_sales_units` metric, from highest to lowest.

## Protips

- Don't hardcode stuff like filenames & metrics
- The level's `$total` row should always be at the top of the level, even if it's not the highest value. See examples below.
- The output dataset should be formatted like the input (i.e. pipe-delimited CSV with header).
- We use TypeScript and Python, but you can use any language (and include instructions on how to run your code).
- If using Python, avoid using `pandas` or notebooks. Use minimal external libraries.
- You are allowed to use a built-in sort function as long as it is only used to sort a list.
- Verify your solution by comparing your output against the example files (attached below)

### Don't hardcode the number of property / metric columns

Ideally, your code should not assume anything about the number of property or metric columns in the input. In our application, the input could have 10 property and 100 metrics.

The input always follows the same pattern:

- For properties, the keys are: `propertyN`
- The other keys are metrics.


### Think about the UX of your API

The program should allow the user to specify the input file (and/or accepts it via stdin), and which metric to sort on.
Ideally, the output goes on stdout (and make sure you don't print debug logs to stdout).


The API could be a bit like this:

```bash
./hsort.sh <file> [metric]
```

and/or

```typescript
hsort(arr, ['net_sales'])
```

Note: In our application, we go a step further an allow users to specify a sort metric for each property.