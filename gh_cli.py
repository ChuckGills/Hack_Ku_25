import subprocess, json
from gemini_handler import summarize_pr, review_pr

def run_script(script, *args):
    result = subprocess.run([script, *args], capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"Script {script} failed: {result.stderr}")

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return result.stdout.strip()


# PR Handling
def list_prs(state="open"):
    return run_script("./scripts/gh_pr_list.sh", state)

def create_pr(title, body, base, head):
    return run_script("./scripts/gh_pr_create.sh", title, body, base, head)

def view_pr(pr_number):
    return run_script("./scripts/gh_pr_view.sh", str(pr_number))

def pr_diff(pr_number):
    return run_script("./scripts/gh_pr_diff.sh", str(pr_number))


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


if __name__ == "__main__":

    prs = list_prs("open")
    print("Open PRs:")
    for pr in prs:
        print(f"#{pr['number']} {pr['title']} by {pr['author']['login']}")

    pr_number = prs[0]['number']
    summary = summarize_pull_request(pr_number)
    review = review_pull_request(pr_number)

    print(f"\nSummary for PR #{pr_number}:\n{summary}")
    print(f"\nReview for PR #{pr_number}:\n{review}")
