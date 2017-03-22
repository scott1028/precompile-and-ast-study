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
            
            // case-1
            // path.replaceWithSourceString('console.log(\'' + filePath + '\')');

            // case-2
            var $$code = `
                console.log(1);
                let a = 1;
                console.debug(2);
                for(var i = 0; i < 10; i++){
                    console.log(i + 10);
                }
                for(let j = 0; j < 20; j++)
                    console.log(j);
            `;
            var $$act = babylon.parse($$code, {
                sourceType: 'module'
            });
            path.node.type = 'File';
            path.node.program = $$act.program;
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
