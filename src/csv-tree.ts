const $TOTAL: string = "$total"

/**
 * Tree holding a root node and helper fields/methods
 */
export type Tree = {
    root: Node;
    /** function to add a new row to the tree */
    add: (this: Tree, row: string[]) => void;
}

/**
 * Node in tree structure that holds one row of data.
 */
export type Node = {
    /** Array representing the row data */
    row: string[];

    /** Lookup key for this node. */
    key: string;

    /** Value of this node row's metric field */
    metricVal: number;

    /** Zero or more child nodes */
    children: Node[];
}


/**
 * Dummy Tree instance that can be used as an uninitialized variable to get around TypeScript checking.
 * Use `Object.is(NULL_TREE, treeVar)
 */
export const NULL_TREE: Tree = {
    root: {
        row: [],
        key: "",
        metricVal: -1,
        children: []
    },
    add(row: string[]) {
    }
}

/**
 * Create an instance of Tree initialized to add rows from a file with a given header and metric field.
 * @param headerRow
 * @param metricName
 */
export function createTree(headerRow: string[], metricName: string): Tree {
    const propertyCount = headerRow.findIndex(field => !field.startsWith('property'))
    const metricNdx = headerRow.indexOf(metricName)

    if (propertyCount < 1) {
        console.error("one or more property fields are required")
        process.exit(1)
    }
    if (metricNdx < 0) {
        console.error(`metric ${metricName} not found in header`)
        process.exit(1);
    }

    // return tree
    return {
        root: {
            key: $TOTAL,
            children: [],
            row: [],
            metricVal: 0
        },
        add: function (this: Tree, row: string[]) {
            putRow(row, row.slice(0, propertyCount), this.root);
        }
    };

    /**
     * Recursive function that inserts a given row as a node in a tree.
     * @param row the row to insert
     * @param rowProps the property value fields from the row
     * @param node current node under inspection
     */
    function putRow(row: string[], rowProps: string[], node: Node) {
        if (rowProps[0] === $TOTAL) {
            // row is a total/subtotal row on current node
            node.row = row
            node.metricVal = parseFloat(row[metricNdx])
        } else if (rowProps.length === 1) {
            // insert non-subtotal row as a child
            node.children.push({
                key: rowProps[0],
                row: row,
                children: [],
                metricVal: parseFloat(row[metricNdx])
            })
        } else {
            // recurse into a child node for the current property, creating it if it doesn't yet exist
            let child = node.children.find(n => n.key == rowProps[0])
            if (child === undefined) {
                child = {
                    key: rowProps[0],
                    row: [],
                    children: [],
                    metricVal: 0
                }
                node.children.push(child)
            }
            putRow(row, rowProps.slice(1), child)
        }
    }
}