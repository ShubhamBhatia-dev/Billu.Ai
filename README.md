# 🚀 Billu AI

## LOGIN PAGE GLIMPSE
![BilluAI LOGIN](https://i.imgur.com/15sXcQ5.png)

## DASHBOARD PAGE GLIMPSE
![BilluAI DASHBOARD](https://i.imgur.com/blw4rv9.png)

**Billu AI** is a cutting-edge platform that revolutionizes website creation! 🎉  
By leveraging advanced AI technology, Billu AI enables users to generate fully functional and aesthetically pleasing websites simply by describing their requirements in a prompt.  

This tool is perfect for anyone looking to save time, streamline workflows, and avoid the complexities of manual coding. 💻✨  

---

## 🎯 Purpose
The primary objective of **Billu AI** is to make website development effortless for everyone.  
Whether you're a business owner, a developer, or someone with no coding background, **Billu AI** empowers you to transform your ideas into reality with just a few clicks. 🚀  

---

## 🛠 Technology Stack
- **Frontend:** React.js  
- **Backend:** Node.js, Python, Express  
- **Database:** MongoDB  
- **AI Integration:** Agents.AI agent  

---

## 🗂 File Structure
The repository is organized as follows:  

![Directory Structure](https://i.imgur.com/R6e3zn4.png)

---

## 🧑‍💻 How to Run the Project

Follow these steps to set up and run the project locally:  

### 1️⃣ Clone the Repository:
```bash
git clone <repository-url>
cd Billu.Ai
```

### 2️⃣ Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Backend Setup:
Navigate back to the root directory and set up the backend:
```bash
cd ..
cd server
```

- **Add your GitHub token and secret** by creating a **GitHub OAuth App**.  
  Create a `.env` file and add your credentials:
  ```env
  GITHUB_TOKEN=your_github_token
  GITHUB_SECRET_KEY=your_secret_key
  ```

- Install dependencies and start the server:
  ```bash
  npm install
  node server.js
  ```

### 4️⃣ Python Backend:
Run the Python server:
```bash
python3 server.py
```

### 5️⃣ Access the Application:
Open your browser and go to:  
[**http://localhost:5173**](http://localhost:5173)  

### 6️⃣ Login:
Use the login screen to authenticate, after which you will be redirected to the dashboard.

---

## 🌟 Features
- 🖊 **Automatic Website Generation:** Build websites effortlessly by describing your needs in a text prompt.  
- 🛠 **Code Editor:** View and edit the generated code in an intuitive, built-in editor.  
- 🌐 **GitHub Pages Integration:** Automatically host your website on **GitHub Pages** for easy sharing and deployment.  
- 📊 **User-Friendly Dashboard:** Navigate with ease and manage your projects efficiently.  

---

## 🔍 Basic Idea of Code
1. **Authenticate User:** Authenticate users via GitHub and store their access token in MongoDB.  
2. **Redirect to Dashboard:** After successful login, redirect users to the dashboard.  
3. **Handle User Prompt:** Collect the user’s prompt and send it to the backend.  
4. **AI Agent Interaction:** The backend sends the prompt to **Agents.AI** and collects responses from the **designer and developer agents**.  
5. **GitHub Integration:** Using the access token, create a **GitHub repository**, upload the generated files, and host the site on **GitHub Pages**.  
6. **Return Deployment Link:** Provide the link to the deployed website in the chat for user access.  


---

## 🔮 Future Scope
- 🎨 **Enhanced Templates:** Add more versatile and customizable templates to cater to diverse user needs.  
- 🤖 **Improved AI:** Boost AI capabilities for more sophisticated and dynamic website customization.  
- ☁ **Cloud Hosting:** Enable one-click cloud hosting for instant deployment and scalability.  

---

## 📝 Notes
Ensure you have the following installed on your system:
- **Node.js**  
- **Python 3**  
- **npm**  

**Billu AI is open for contributions!** 🎉  
Feel free to **fork the repository**, submit **pull requests**, or report any **issues**.  

Together, let's make website building **accessible** to everyone! 🙌  

---

**Happy coding!** 💻 🚀

