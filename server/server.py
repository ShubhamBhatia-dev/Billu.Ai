from flask import Flask, request, jsonify
import os
import requests
import base64
import time
import random
import string

app = Flask(__name__)

API_ENDPOINT = "https://api-lr.agent.ai/v1/agent/g9pk2tju59wj9asx/webhook/413d059e"

def get_username(github_token):
    """Fetch the GitHub username dynamically using the token."""
    url = "https://api.github.com/user"
    headers = {"Authorization": f"token {github_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()['login']
    else:
        return None

def create_repo(repo_name, github_token):
    """Create a new GitHub repository."""
    url = "https://api.github.com/user/repos"
    headers = {"Authorization": f"token {github_token}"}
    data = {"name": repo_name, "private": False, "auto_init": True}
    response = requests.post(url, headers=headers, json=data)
    return response.status_code in [201, 422]

def verify_repo(repo_name, username, github_token, retries=5, delay=5):
    """Verify if the repository is accessible with retries."""
    url = f"https://api.github.com/repos/{username}/{repo_name}"
    headers = {"Authorization": f"token {github_token}"}
    for _ in range(retries):
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return True
        time.sleep(delay)
    return False

def get_file_sha(repo_name, username, file_path, github_token):
    """Get the SHA of an existing file in the repository."""
    url = f"https://api.github.com/repos/{username}/{repo_name}/contents/{file_path}"
    headers = {"Authorization": f"token {github_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()['sha']
    return None

def upload_file(repo_name, username, file_path, file_content, github_token, folder="docs"):
    """Upload or update a file in the repository."""
    adjusted_path = f"{folder}/{file_path.split('/')[-1]}"
    url = f"https://api.github.com/repos/{username}/{repo_name}/contents/{adjusted_path}"
    headers = {"Authorization": f"token {github_token}"}
    sha = get_file_sha(repo_name, username, adjusted_path, github_token)
    data = {
        "message": f"Update {adjusted_path}",
        "content": base64.b64encode(file_content.encode()).decode(),
        "branch": "main",
    }
    if sha:
        data["sha"] = sha
    response = requests.put(url, headers=headers, json=data)
    return response.status_code in [201, 200]

def post_user_input_to_api(user_input):
    """Post user input to the API and fetch the response."""
    response = requests.post(API_ENDPOINT, json={"user_input": user_input})
    if response.status_code == 200:
        return response.json()
    return None

def setup_github_pages(repo_name, username, github_token, path="/docs"):
    """Enable GitHub Pages for the repository."""
    url = f"https://api.github.com/repos/{username}/{repo_name}/pages"
    headers = {"Authorization": f"token {github_token}"}
    data = {"source": {"branch": "main", "path": path}}
    response = requests.post(url, headers=headers, json=data)
    return response.status_code in [201, 202, 204]

def get_github_pages_url(repo_name, username, github_token):
    """Retrieve the GitHub Pages URL for the repository."""
    url = f"https://api.github.com/repos/{username}/{repo_name}/pages"
    headers = {"Authorization": f"token {github_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("html_url")
    return None

@app.route('/deploy', methods=['POST'])
def deploy_to_github():
    """Deploy files to a GitHub repository and enable GitHub Pages."""
    data = request.json
    github_token = data.get("token")
    user_input = data.get("user_input")

    if not github_token or not user_input:
        return jsonify({"error": "Missing 'token' or 'user_input'"}), 400

    username = get_username(github_token)
    if not username:
        return jsonify({"error": "Invalid GitHub token"}), 401

    repo_name = "repo-" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))

    files_data = post_user_input_to_api(user_input)
    if not files_data:
        return jsonify({"error": "Failed to fetch file data from the API"}), 500

    if create_repo(repo_name, github_token):
        if verify_repo(repo_name, username, github_token, retries=10, delay=1):
            for file_data in files_data.get("response", []):
                if isinstance(file_data, dict) and "dir" in file_data and "content" in file_data:
                    folder = "backend" if "backend" in file_data.get("dir", "").lower() else "docs"
                    upload_file(repo_name, username, file_data["dir"], file_data["content"], github_token, folder=folder)

            if setup_github_pages(repo_name, username, github_token, path="/docs"):
                pages_url = get_github_pages_url(repo_name, username, github_token)
                return jsonify({"repository": repo_name, "url": pages_url, "api_response": files_data}), 200

    return jsonify({"error": "Deployment failed"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)