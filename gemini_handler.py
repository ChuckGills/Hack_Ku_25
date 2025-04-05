# gemini_handler.py

from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

# PR Summarization
def summarize_pr(diff_text):
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
def review_pr(diff_text):
    prompt = f"""
    Review this pull request diff. Provide feedback, point out potential issues, and suggest improvements clearly:

    Diff:
    {diff_text}
    """
    response = model.generate_content(prompt)
    return response.text.strip()
