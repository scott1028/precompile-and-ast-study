'use strict';

const babylon = require('babylon');
const bg = require('babel-generator');
const bt = require('babel-traverse');

const code = `
    function add(a, b){
        return a + b;
    }

    include('./aa.js');
`;


// ref: http://astexplorer.net/
const ast = babylon.parse(code);

bt.default(ast, {
    enter(path) {
        // console.log(path);
        if(path.node.type === 'Identifier' && path.node.name === 'a'){
            path.node.name = 'x';
        }

        if(path.node.type === 'CallExpression' && path.node.callee.name === 'include'){
            // console.log(path.node.start, path.node.end);
            // console.log(path.replaceWith);
            console.log(path);
            if(path.node.arguments[0].type !== 'StringLiteral'){
                throw new Error('Syntax has some error.');
            }

            var filePath = path.node.arguments[0].value;
            path.replaceWithSourceString('console.log(\'' + filePath + '\')');
        }
    }
});
 
var output = bg.default(ast, { /* options */ }, code);

//
console.log('==========================================');
console.log(code);
console.log('==========================================');
console.log(output.code);
console.log('==========================================');
console.log(output);
