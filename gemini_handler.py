# gemini_handler.py

from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('models/gemini-1.5-pro')


# PR Summarization
def summarize_pr(diff_text, temperature=0.7):
    prompt = f"""
    Summarize this pull request diff briefly, clearly highlighting its key changes and overall purpose:

    Diff:
    {diff_text}
    """
    response = model.generate_content(prompt)
    return response.text.strip()

# Commit Title Generator
def generate_commit_title(diff_text):
    prompt = f"""
    Write a simple git commit title that describes the biggest change made:

    Diff:
    {diff_text}
    """
    response = model.generate_content(prompt)
    return response.text.strip()

# Commit Message Generator
def generate_commit_message(diff_text):
    prompt = f"""
    Write a clear, concise git commit message summarizing these changes:

    Diff:
    {diff_text}
    """
    response = model.generate_content(prompt)
    return response.text.strip()

# PR Review (Code suggestions)
def review_pr(diff_text, temperature=0.7):
    prompt = f"""
    Perform a detailed code review for the following pull request diff. Analyze the changes and explain:
    - What changes were made and why they might have been introduced.
    - Any potential issues, bugs, or areas for improvement.le code review of the changes within the big pairs (Ex: GitHub has green and red for changed "pairs") So please provide code bits of the changes and explain.

    Diff:
    {diff_text}
    """
    response = model.generate_content(prompt)
    return response.text.strip()
