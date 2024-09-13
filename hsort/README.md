# Hierarchical Sort Implementation

This project was created as part of a technical interview to demonstrate proficiency in TypeScript 
as well as thinking through a basic data manipulation problem.

## Assignment Requirements

Please refer to the [Project Requirements](README_PROJECT_REQUIREMENTS.md) readme file

### Assignment Output File
The required output file for the assignment is in `data/data-big-output-net-sales-units.txt`

## Implementation Details

To complete the task I used a basic tree structure where the total and subtotal
rows are represented by non-leaf nodes and the data rows are leaf nodes.

__Simplified Tree__
```
$total|$total|200 : root node
  foo|$total|400  : level 1
    foo|sauce|300 : leaf
    foo|bacon|100 : leaf
  bar|$total|-200 : level 1
    bar|bro|200   : leaf
    bar|sup|-400  : leaf
```
This should scale to any number of properties and metrics.

## Setup

### Prerequisites
Recent Node.js install.  Code was written against v22.3.0.

### Install
Unzip the Node.js project into an empty folder.

Run the following to install the project:

```bash
npm install
```

## Usage

At the root of the project you can run the sort against the 
projects test data files, which are in the `data` folder:

```bash
npm start ./data/data-big-input.txt net_sales --silent
```
will print the sorted line to the console:

```csv
property0|property1|property2|net_sales|net_sales_units
$total|$total|$total|599051.63|2728
womens footwear|$total|$total|330267.42|1406
womens footwear|shoes|$total|166186.02|864
womens footwear|shoes|sandals|48355.0|209
...
```
__Note:__ the `--silent` flag turns off npm's output

## Test files
Here are some pre-baked commands for testing the output of this project 
against the test files

__small test file__
```bash
npm start ./data/data-small-input.txt net_sales --silent  | diff - ./data/data-small-output.txt
```

__big test file__
```bash
npm start ./data/data-big-input.txt net_sales --silent  | diff - ./data/data-big-output.txt
```

__output assignment output file__
```bash
npm start ./data/data-big-input.txt net_sales_units --silent
```

## Ideas for Improvement
If this wasn't a toy problem:

- add some unit tests (I like jest)
- consider yargs/chalk for a more advanced CLI which could allow for:
  - add more flexibility in choosing property/metric fields
  - changing sort order
- consider replacing the 'children' node array with a structure that
sorts on insert (binary tree, maybe) instead of calling Array.sort() in the 
traverse method for each tree level.  
- would be relatively trivial to extend the project to add a per-property sort metric.

### Notes and assumptions
#### big data output modification
The given original file `big-data-output.txt` had `.0` tacked on at the end of any integer
metric value, which didn't match the input and made comparison `diff`-icult (lol).

Anyway I backed it up as `big-data-output.orig` and edited the original to remove those `.0` characters. 

I also added a linefeed at the end of each `*-output.txt` file, which also made using `diff` 
to compare the output of this project easier.

Neither of these edits should violate the intent of the assignment. 

## Bonus Install as command line function 
The project can optionally be installed as a command line function named `hsort` by running:

```bash
npm run build
npm link
```
You now should be able to execute `hsort` from anywhere

```bash
hsort ./data/data-big-input.txt net_sales 
```
### Clean up

Remove the command line function using
```bash
npm unlink -g hsort
```