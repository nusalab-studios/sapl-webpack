const path = require("path");
const glob = require("glob");

// multiple entry javascript
const entryObject = glob.sync("./src/assets/js/*.js").reduce(
    function (entries, entry) {
        var matchForRename = /^\.\/src\/assets\/js\/([\w\d_]+\/*)\.js$/g.exec(entry);

        if (matchForRename !== null && typeof matchForRename[1] !== "undefined") {
            entries[matchForRename[1]] = entry;
        }

        return entries;
    }, {}
);

module.exports = {
    entry: entryObject,
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].bundle.js",
    },
    module: {
        rules: [
            // babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },

            // eslint
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
        ]
    },
}
