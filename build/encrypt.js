var fs = require("fs");
var lz = require("./LZString/LZString");

var args = process.argv.slice(2);
var input_file = args[0];
var output_file = args[1];

var data = fs.readFileSync(input_file," utf8");
var encry = lz.encrypt(data);
fs.writeFileSync(output_file, new Buffer(encry, "binary"));