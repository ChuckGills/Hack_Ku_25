// test.cpp - A sample C++ file to test formatter and linter

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// Function to print the elements of a vector
void printVector(const vector<int>& vec){
    for (size_t i = 0; i < vec.size(); i++){
        cout << vec[i] << " ";
    }
    cout << endl;
}

class Sample {
public:
    Sample(int id, const string& name) {
        this->id = id;
        this->name = name;
    }
    void display(){
        cout << "ID: " << id << ", Name: " << name << endl;
    }
private:
    int id;
    string name;
};

int main(){
    int a = 5;
    int b = 10;
    if (a < b)
    {
        cout << "a is less than b" << endl;
    }
    else { cout << "a is not less than b" << endl; }

    vector<int> numbers = { 3, 1, 4, 1, 5, 9 };
    printVector(numbers);

    Sample s(1, "Test Sample");
    s.display();

    // A lambda function to compute the square of a number
    auto square = [](int x){ return x * x; };
    cout << "Square of 4 is " << square(4) << endl;

    // Sort the vector in descending order using a lambda expression
    sort(numbers.begin(), numbers.end(), [](int x, int y){
        return x > y;
    });
    printVector(numbers);

    return 0;
}