#!/usr/bin/env node

import {createTree, Node, NULL_TREE, Tree} from "./csv-tree";
import {resolve} from 'path';
import {createInterface} from 'readline'
import {createReadStream} from "fs";

const CSV_DELIM = '|'
const filePath = getArg(2, "file path")
const metricName: string = getArg(3, "metric field name")

main()

/**
 * Entry point
 */
async function main() {
    let tree: Tree = NULL_TREE
    let header:string[] = []
    await parseCsv(filePath, (row) => {
        if (Object.is(tree, NULL_TREE)) {
            // output header
            header = row
            tree = createTree(row, metricName)
        } else {
            tree.add(row)
        }
    })

    // output sorted file
    console.log(header.join(CSV_DELIM))
    traverse(tree.root, (row) => {
        console.log(row.join(CSV_DELIM))
    });
}

/**
 * Recursively traverse a node, sorting its children and invoking a given callback.
 * @param node current node
 * @param callback callback that receives each row during traversal
 */
function traverse(node: Node, callback: (x: string[]) => void) {
    callback(node.row);
    node.children.sort((a, b) => a.metricVal < b.metricVal ? 1 : -1);
    for (const child of node.children) {
        traverse(child, callback)
    }
}

/**
 * Parse a CSV file invoking a callback with each line.
 */
async function parseCsv(file: string, callback: (row: string[]) => void) {
    try {
        const fileStream = createReadStream(resolve(file));

        const rlInterface = createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rlInterface) {
            callback(line.split(CSV_DELIM))
        }
    } catch (err) {
        console.error(`error parsing file ${file}: ${err}`);
        process.exit(1);
    }
}

/**
 * Basic CLI validation, would probably use something like yargs for a non-toy app.
 */
function getArg(argNum: number, fieldName: string): string {
    let arg = process.argv[argNum];
    if (!arg) {
        console.error(`missing ${fieldName}\n`);
        console.log("Usage:\n______\n")
        console.log(`npm start [file] [metric]\n`)
        console.log("  - file: path to input file (required)")
        console.log("  - metric: name of the field in file to use for sorting (required)")
        process.exit(1);
    }
    return arg;
}