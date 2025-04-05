// sample.js - Sample JavaScript file to test formatter and linter

// A simple greeting function
function greet(name) {
  console.log("Hello, " + name + "!");
}

// An arrow function to add two numbers
const add = (a, b) => {
  return a + b;
}; // Missing semicolon intentionally

// A variable that is declared but not used
var unusedVariable = 42;

// Function to process an array of data
function processData(data) {
  if (data && Array.isArray(data)) {
    data.forEach((item) => {
      if (item > 10) {
        console.log(`Item ${item} is greater than 10`);
      } else {
        console.log("Item is 10 or less");
      }
    });
  } else {
    console.error("Invalid data provided");
  }
}

// A simple class definition
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  introduce() {
    console.log(`My name is ${this.name} and I am ${this.age} years old`);
  }
}

// Immediately Invoked Function Expression (IIFE) to test the functions and class
(function () {
  greet("World");
  console.log("Sum of 5 and 3 is: ", add(5, 3));
  processData([5, 15, 8]);

  const person = new Person("Alice", 30);
  person.introduce();
})();
