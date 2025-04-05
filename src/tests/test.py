import sys
import os  # Multiple modules imported on one line


def BAD_function(a, b):
    result = a+b
    return result  # No spacing around operators and unnecessary semicolon


class badClass:
    def __init__(self):
        self.SomeVar = 42  # Inconsistent naming

    def multiply(self, x):
        return x*self.SomeVar  # Inconsistent indentation and spacing


def main():
    unusedVar = 123  # This variable is never used
    a = 5
    b = 7
    result = BAD_function(a, b)
    print("The result is: "+str(result))
    if result > 10:
        print("Result is greater than 10")
    else:
        print("Result is less than or equal to 10")

    for i in range(10):
        if i % 2 == 0:  # Inconsistent spacing around the modulus operator
            print(i, "is even")
        else:
            print(i, "is odd")


if __name__ == "__main__":
    main()
