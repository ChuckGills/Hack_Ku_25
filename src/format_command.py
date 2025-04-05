#!/usr/bin/env python3

import argparse
import os
import subprocess
import sys
import autopep8


def lint_python(filepath):
    """Run flake8 on a Python file."""
    result = subprocess.run(["flake8", filepath],
                            capture_output=True, text=True)
    with open(f'../logs/{filepath}.log','w') as f:
            f.write(result.stdout)
            f.close()
    if result.stderr:
        print(result.stderr, file=sys.stderr)


def format_python(filepath):
    """Format a Python file using autopep8 ."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}", file=sys.stderr)
        sys.exit(1)
    formatted_code = autopep8.fix_code(code)
    try:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(formatted_code)
            print(f"Formatted {filepath} in place.")
    except Exception as e:
            print(f"Error writing file {filepath}: {e}", file=sys.stderr)
            sys.exit(1)
   


def lint_javascript(filepath):
    try:
        cmd = f"eslint \"{filepath}\""

        print(f"Running: {cmd}")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        with open(f'../logs/{filepath}.log','w') as f:
            f.write(result.stdout)
            f.close()
        if result.stderr:
            print(result.stderr, file=sys.stderr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)


def format_javascript(filepath):
    try:
        cmd = f"prettier --write \"{filepath}\""
      

        print(f"Running: {cmd}")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)


def lint_cpp(filepath):
    result = subprocess.run(["clang-tidy", filepath, "--"],
                            capture_output=True, text=True)
    with open(f'../logs/{filepath}.log','w') as f:
            f.write(result.stdout)
            f.close()
    if result.stderr:
        print(result.stderr, file=sys.stderr)


def format_cpp(filepath):
        result = subprocess.run(
            ["clang-format", "-i", filepath], capture_output=True, text=True)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        print(f"Formatted {filepath} in place.")


def main():
    parser = argparse.ArgumentParser(
        description="Linter and Formatter: Reads the file extension and uses preexisting libraries to lint or format the file."
    )
    parser.add_argument("filepath", help="Path to the source file to process.")
    args = parser.parse_args()

    if not os.path.exists(args.filepath):
        print(
            f"Error: File '{args.filepath}' does not exist.", file=sys.stderr)
        sys.exit(1)

    
    _, ext = os.path.splitext(args.filepath)
    ext = ext.lower()

    if ext == ".py":
            format_python(args.filepath)
            lint_python(args.filepath)
       
            
    elif ext in [".js", ".jsx", ".ts", ".tsx"]:
            format_javascript(args.filepath)
            lint_javascript(args.filepath)
        
    elif ext in [".c", ".cpp", ".h", ".hpp"]:
            lint_cpp(args.filepath)
            format_cpp(args.filepath)
    else:
        print(f"Unsupported file extension: {ext}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
