const dirTree = require("directory-tree");

function formatTree(tree, prefix = "") {
    let result = "";

    tree.children.forEach((child, index) => {
        const isLast = index === tree.children.length - 1;
        const newPrefix = prefix + (isLast ? "    " : "│   ");

        result += `${prefix}${isLast ? "└── " : "├── "}${child.name}\n`;

        if (child.children) {
            result += formatTree(child, newPrefix);
        }
    });

    return result;
}

const directoryPath = "./";

const tree = dirTree(directoryPath, { exclude: [/node_modules/, /logs/, /coverage/] });

if (tree) {
    console.log(tree.name);
    console.log(formatTree(tree));
} else {
    console.log("Directory not found or is empty.");
}