const { readdirSync, statSync } = require("fs");
const { join } = require("path");

/**
 * Returns all files in the specified folder as an array.
 * @param {string} path
 * @returns {string[]}
 */
module.exports = (path) => {
    const paths = [];

    const read = (_path) => {
        const files = readdirSync(_path);

        for (let i = 0; i < files.length; i++) {
            const resolvedPath = join(_path, files[i]);

            if (statSync(resolvedPath).isDirectory())
                read(resolvedPath);
            else
                paths.push(resolvedPath);
        }
    };

    read(path);

    return paths;
};
