'use strict';

const babylon = require('babylon');
const bg = require('babel-generator');
const bt = require('babel-traverse');
const fs = require("fs");

const code = `
    function add(a, b){
        return a + b;
    }

    include('./lib01.js');
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

            // case-1
            // path.replaceWithSourceString('console.log(\'' + filePath + '\')');

            // case-2
            // var $$code = `
            //     console.log(1);
            //     let a = 1;
            //     console.debug(2);
            //     for(var i = 0; i < 10; i++){
            //         console.log(i + 10);
            //     }
            //     for(let j = 0; j < 20; j++)
            //         console.log(j);
            // `;
            var filePath = path.node.arguments[0].value;
            var $$code = fs.readFileSync(filePath, "utf-8");
            console.log($$code);
            var $$act = babylon.parse($$code, {
                sourceType: 'module'
            });
            path.node.type = 'File';
            path.node.program = $$act.program;

            // debug current code to generate output
            console.log(bg.default($$act).code);
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


// function handler($$code){
//     var $$act = babylon.parse($$code, {
//         sourceType: 'module'
//     });

//     bt.default($$ast, {
//         enter(path) {
//             if(path.node.type === 'CallExpression' && path.node.callee.name === 'include'){
//                 // next = true;

//                 var filePath = path.node.arguments[0].value;
//                 var $$code = fs.readFileSync(filePath, "utf-8");
//             }
//         }
//     });
// };
