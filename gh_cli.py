import subprocess, json, os, sys
from gemini_handler import summarize_pr, review_pr

# Global to track the active repository path.
active_repo = None

# Determine the directory where gh_cli.py is located.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def set_active_repo(repo_path):
    global active_repo
    if not os.path.isdir(repo_path):
        raise ValueError(f"{repo_path} is not a valid directory.")
    active_repo = repo_path
    print(f"Active repository set to: {active_repo}")

def run_script(script, *args):
    # Remove leading slash if present to treat as a relative path.
    if script.startswith("/"):
        script = script[1:]
    # Build an absolute path to the script based on the location of gh_cli.py.
    script_path = os.path.join(BASE_DIR, script)
    result = subprocess.run([script_path, *args], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Script {script_path} failed: {result.stderr}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return result.stdout.strip()

# PR Handling
def list_prs(state="open"):
    return run_script("/scripts/gh_pr_list.sh", state)

def create_pr(title, body, base, head):
    return run_script("/scripts/gh_pr_create.sh", title, body, base, head)

def view_pr(pr_number):
    return run_script("/scripts/gh_pr_view.sh", str(pr_number))

def pr_diff(pr_number):
    return run_script("/scripts/gh_pr_diff.sh", str(pr_number))

# Gemini Integration
def summarize_pull_request(pr_number):
    diff = pr_diff(pr_number)
    return summarize_pr(diff)

def review_pull_request(pr_number):
    diff = pr_diff(pr_number)
    return review_pr(diff)

def gh_api(*args):
    return run_script("./scripts/gh_api.sh", *args)

def list_repos():
    return run_script("./scripts/gh_repo_list.sh")

def print_help():
    help_text = """
Usage: gh_cli.py <command> [arguments]

Commands:
  pr list                       List open PRs.
  pr create <title> <body> <base> <head>   Create a new PR.
  pr view <pr_number>           View a PR.
  git user                    Show the configured git user.
  ... (add additional commands as needed)
"""
    print(help_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_help()
        sys.exit(1)

    command = sys.argv[1]

    if command == "pr":
        if len(sys.argv) < 3:
            print("Please specify a PR subcommand (list, create, view, etc.)")
            sys.exit(1)
        subcommand = sys.argv[2]
        if subcommand == "list":
            prs = list_prs("open")
            if prs:
                print("Open PRs:")
                for pr in prs:
                    print(f"#{pr['number']} {pr['title']} by {pr['author']['login']}")
            else:
                print("No open PRs found.")
        elif subcommand == "create":
            if len(sys.argv) < 7:
                print("Usage: gh_cli.py pr create <title> <body> <base> <head>")
                sys.exit(1)
            title, body, base, head = sys.argv[3:7]
            result = create_pr(title, body, base, head)
            print(result)
        elif subcommand == "view":
            if len(sys.argv) < 4:
                print("Usage: gh_cli.py pr view <pr_number>")
                sys.exit(1)
            pr_number = sys.argv[3]
            result = view_pr(pr_number)
            print(result)
        else:
            print(f"Unknown PR subcommand: {subcommand}")
    elif command == "git":
        if len(sys.argv) < 3:
            print("Please specify a git subcommand (e.g., user)")
            sys.exit(1)
        subcommand = sys.argv[2]
        if subcommand == "user":
            # Example: get the git user name from git config.
            result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"Git user: {result.stdout.strip()}")
            else:
                print("Error retrieving git user.")
        elif subcommand == "repos":
            result = list_repos()
            print("Repos", result)
        else:
            print(f"Unknown git subcommand: {subcommand}")
    else:
        print(f"Unknown command: {command}")
        print_help()
