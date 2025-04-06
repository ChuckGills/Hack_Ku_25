import subprocess, json, os, sys
from gemini_handler import summarize_pr, review_pr, generate_commit_title, generate_commit_message

# Global to track the selected repository.
selected_repo = None

# Determine the directory where gh_cli.py is located.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SELECTED_REPO_FILE = os.path.join(BASE_DIR, 'selected_repo.json')

def load_selected_repo():
    global selected_repo
    if os.path.exists(SELECTED_REPO_FILE):
        with open(SELECTED_REPO_FILE, 'r') as f:
            try:
                selected_repo = json.load(f)
            except json.JSONDecodeError:
                selected_repo = None

def save_selected_repo():
    with open(SELECTED_REPO_FILE, 'w') as f:
        json.dump(selected_repo, f)

def select_repo(repo):
    global selected_repo
    selected_repo = repo
    save_selected_repo()

def get_repo_slug(repo):
    # If the repository data already includes a field with the full slug, return it.
    if "ownerRepo" in repo:
        return repo["ownerRepo"]
    # Otherwise, try to parse it from the URL.
    url = repo.get("url", "")
    parts = url.split('/')
    if len(parts) >= 5:
        return parts[3] + '/' + parts[4]
    else:
        raise Exception("Invalid repository URL format")

def run_script(script, *args):
    if script.startswith("/"):
        script = script[1:]
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
    if selected_repo is None:
        raise Exception("No repository selected. Use 'gh_cli.py repo select <repository_name>' first.")
    repo_slug = selected_repo.get("ownerRepo") or get_repo_slug(selected_repo)
    return run_script("/scripts/gh_pr_list.sh", repo_slug, state)

def create_pr(title, body, base, head):
    if selected_repo is None:
        raise Exception("No repository selected. Use 'gh_cli.py repo select <repository_name>' first.")
    repo_slug = selected_repo.get("ownerRepo") or get_repo_slug(selected_repo)
    return run_script("/scripts/gh_pr_create.sh", repo_slug, title, body, base, head)

def view_pr(pr_number):
    if selected_repo is None:
        raise Exception("No repository selected. Use 'gh_cli.py repo select <repository_name>' first.")
    repo_slug = selected_repo.get("ownerRepo") or get_repo_slug(selected_repo)
    return run_script("/scripts/gh_pr_view.sh", repo_slug, str(pr_number))

def pr_diff(pr_number):
    if selected_repo is None:
        raise Exception("No repository selected. Use 'gh_cli.py repo select <repository_name>' first.")
    repo_slug = selected_repo.get("ownerRepo") or get_repo_slug(selected_repo)
    return run_script("/scripts/gh_pr_diff.sh", repo_slug, str(pr_number))


# Gemini Integration
def summarize_pull_request(pr_number):
    diff = pr_diff(pr_number)
    return summarize_pr(diff)

def review_pull_request(pr_number):
    diff = pr_diff(pr_number)
    return review_pr(diff)

def generate_commit_title_from_pr(pr_number):
    diff = pr_diff(pr_number)
    return generate_commit_title(diff)

def generate_commit_message_from_pr(pr_number):
    diff = pr_diff(pr_number)
    return generate_commit_message(diff)

def gh_api(*args):
    return run_script("./scripts/gh_api.sh", *args)

def list_repos():
    return run_script("./scripts/gh_repo_list.sh")

def print_help():
    help_text = """
Usage: gh_cli.py <command> [arguments]

Commands:
  pr list                             List open PRs for the selected repository.
  pr create <title> <body> <base> <head>    Create a new PR for the selected repository.
  pr view <pr_number>                 View a PR for the selected repository.

  gemini summarize <pr_number>        Summarize the PR diff using Gemini.
  gemini review <pr_number>           Review the PR diff using Gemini.
  gemini commit-title <pr_number>     Generate a commit title based on the PR diff.
  gemini commit-message <pr_number>   Generate a commit message based on the PR diff.

  git user                          Show the configured git user.
  repo list                         List available repositories.
  repo select <repository_name>       Select a repository by its name (from the repo list).

  ... (add additional commands as needed)
"""
    print(help_text)

if __name__ == "__main__":
    load_selected_repo()

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
            try:
                prs = list_prs("open")
            except Exception as e:
                print(e)
                sys.exit(1)
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
            try:
                result = create_pr(title, body, base, head)
                print(result)
            except Exception as e:
                print(e)
        elif subcommand == "view":
            if len(sys.argv) < 4:
                print("Usage: gh_cli.py pr view <pr_number>")
                sys.exit(1)
            pr_number = sys.argv[3]
            try:
                result = view_pr(pr_number)
                print(result)
            except Exception as e:
                print(e)
        else:
            print(f"Unknown PR subcommand: {subcommand}")

    elif command == "gemini":
        if len(sys.argv) < 4:
            print("Usage: gh_cli.py gemini <subcommand> <pr_number>")
            sys.exit(1)
        subcommand = sys.argv[2]
        pr_number = sys.argv[3]
        if subcommand == "summarize":
            try:
                result = summarize_pull_request(pr_number)
                print(result)
            except Exception as e:
                print(e)
        elif subcommand == "review":
            try:
                result = review_pull_request(pr_number)
                print(result)
            except Exception as e:
                print(e)
        elif subcommand == "commit-title":
            try:
                result = generate_commit_title_from_pr(pr_number)
                print(result)
            except Exception as e:
                print(e)
        elif subcommand == "commit-message":
            try:
                result = generate_commit_message_from_pr(pr_number)
                print(result)
            except Exception as e:
                print(e)
        else:
            print("Unknown gemini subcommand. Available: summarize, review, commit-title, commit-message")

    elif command == "git":
        if len(sys.argv) < 3:
            print("Please specify a git subcommand (e.g., user)")
            sys.exit(1)
        subcommand = sys.argv[2]
        if subcommand == "user":
            result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"Git user: {result.stdout.strip()}")
            else:
                print("Error retrieving git user.")
        else:
            print(f"Unknown git subcommand: {subcommand}")

    elif command == "api":
        if len(sys.argv) < 3:
            print("Usage: gh_cli.py api <arguments>")
            sys.exit(1)
        try:
            # Pass all arguments after "api" to the API script.
            result = gh_api(*sys.argv[2:])
            print(result)
        except Exception as e:
            print(e)


    elif command == "repo":
        if len(sys.argv) < 3:
            print("Please specify a repo subcommand (list, select)")
            sys.exit(1)
        subcommand = sys.argv[2]
        if subcommand == "list":
                repos = list_repos()
                print(repos)
        elif subcommand == "select":
            if len(sys.argv) < 4:
                print("Usage: gh_cli.py repo select <repository_name>")
                sys.exit(1)
            repo_name = sys.argv[3]
            try:
                repos = list_repos()
            except Exception as e:
                print(f"Error listing repositories: {e}")
                sys.exit(1)
            selected = None
            for r in repos:
                if r.get("name") == repo_name:
                    selected = r
                    break
            if selected is None:
                print(f"Repository {repo_name} not found in repo list.")
            else:
                select_repo(selected)
                print(f"Repository {repo_name} selected.")
        else:
            print(f"Unknown repo subcommand: {subcommand}")
            print("Available repo subcommands: list, select")

    else:
        print(f"Unknown command: {command}")
        print_help()
