var fs = require("fs");
var lz = require("./LZString/LZString");
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

var args = process.argv.slice(2);
var input_file = args[0];
var output_file = args[1];

var data = fs.readFileSync(input_file, "utf8");
var ast = jsp.parse(data);
ast = pro.ast_mangle(ast);
ast = pro.ast_squeeze(ast);
ast = pro.gen_code(ast);
//fs.writeFileSync(output_file, ast, 'utf8');

var encry = lz.compress(ast);
fs.writeFileSync(output_file, new Buffer(encry, "binary"));