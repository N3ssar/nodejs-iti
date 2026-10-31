//=================================================
//When to use module.exports vs exports in Node.js:
//=================================================
/*

Node js has a built-in module called 'module' that provides information about the current module. The 'module.exports' object is used to define what a module exports and makes available for other modules to import.
and also has a property called 'exports' which is a reference to the 'module.exports' object. This means that you can use either 'exports' or 'module.exports' to export values from a module,
but they are not the same thing. If you assign a new value to 'exports', it will no longer be a reference to 'module.exports', and any changes made to 'exports' will not affect the exported values of the module{}.

So when u create a new file Nodejs under the hood act like that:
let module={
exports:{}
}

let exports = module.exports

the origin and the exactly exported values are module.exports,
so if u use exports to export values, it will work as long as you don't reassign exports to a new value.
If you do reassign exports like:
exports = { newFunction: () => {} };
it will no longer be a reference to module.exports, and any changes made to exports will not affect the exported values of the module.
overall , U have to be careful when using exports and module.exports in Node.js, and it's generally recommended to use module.exports to avoid confusion and ensure that the exported values are consistent across different modules.

the ways to export values from a module in Node.js are:
1-using module.exports :
   let myFunction = () => {
     console.log('Hello from myFunction');
   }
     let myVariable = 'Hello from myVariable';
   module.exports = { myFunction, myVariable };

2-using exports :
    exports.myFunction = () => {
     console.log('Hello from myFunction');
   }
     exports.myVariable = 'Hello from myVariable';


3-using both module.exports and exports :

exports.myFunction = () => {
  console.log('Hello from myFunction');
}//this function added to module.exports object

exports.myVariable = 'Hello from myVariable';//this variable added to module.exports object'

let myFunction2 = () => {
  console.log('Hello from myFunction2');
}

module.exports = { ...module.exports, myFunction2 };
 by the above statements, module.exports has a new reference to a new object
that contains all the properties of the original module.exports object,
 as well as the new myFunction2 property. This means that any changes made to exports will still be reflected in module.exports, and vice versa.

*/

let x = 10,
  y = 20,
  z = 50;

exports.add = (a, b) => {
  return a + b;
};
exports.subtract = (a, b) => {
  return a - b;
};
exports.multiply = (a, b) => {
  return a * b;
};
exports.divide = (a, b) => {
  return a / b;
};

module.exports = { ...module.exports, x, y, z };
