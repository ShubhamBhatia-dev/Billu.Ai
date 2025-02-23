import React, { useState, useEffect, useRef } from 'react';
import { FolderTree, Code2, MessageSquare, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import './dashboard.css';

const WS_URL = 'ws://localhost:4000';

const initialFolderStructure = {
  frontend: {
    components: {
      'Header.tsx': '// Header component code here',
      'Footer.tsx': '// Footer component code here',
    },
    pages: {
      'Home.tsx': '// Home page code here',
      'About.tsx': '// About page code here',
    },
    'App.tsx': '// App component code here',
    'main.tsx': '// Main entry file code here',
  },
  backend : {
    'index.html': '<!-- HTML content here -->',
    'styles.css': '*{margin:0;padding:0;}.pixel{font-family:"PixelifySans",serif;font-optical-sizing:auto;font-weight:700;font-style:normal;}/*LoginPage*/.container{width:100%;height:100vh;background-image:url("./assets/back.png");display:flex;flex-direction:column;}.up{width:100%;height:85vh;display:flex;}.bottom{width:100%;height:15vh;}.left,.right{width:50%;height:100%;display:flex;align-items:center;}.left{align-items:center;}.billu-img{width:300px;position:relative;}.sign-in{height:300px;width:500px;background-color:white;background:rgba(255,255,255,0.2);border-radius:16px;box-shadow:04px30pxrgba(0,0,0,0.1);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);border:1pxsolidrgba(255,255,255,0.3);display:flex;flex-direction:column;justify-content:center;align-items:center;}.billu-img{animation:updn5slinearinfinite;}@keyframesupdn{0%{transform:translateX(-50px)rotate(360deg);;}20%{}40%{transform:translateX(50px)translateY(-50px);}}#github{width:200px;}#github:hover{transform:scale(0.9);}#truck{width:150px;}/*Carasoul*/.carousel{width:100%;height:12vh;overflow:hidden;position:relative;margin-left:auto;margin-right:auto;}.carousel-track{display:flex;gap:4rem;animation:scroll25slinearinfinite;}.carousel-tracki{font-size:5rem;color:#333;transition:transform0.3s;}.carousel-tracki:hover{transform:scale(1.2);color:#007bff;}i{color:white;}@keyframesscroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}#prompt{width:300px;}'
  },
};

function FolderStructureView({ structure, indent = 0, onSelectFile }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  return (
    <div style={{ marginLeft: `${indent * 16}px` }}>
      {Object.entries(structure).map(([key, value]) => {
        const isFolder = typeof value === 'object';
        const isExpanded = expandedFolders[key];

        return (
          <div key={key}>
            {isFolder ? (
              <>
                <div className="folder-item folder" onClick={() => toggleFolder(key)}>
                  <span className="icon">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <FolderTree size={16} className="icon" />
                  <span className="text">{key}</span>
                </div>
                {isExpanded && (
                  <FolderStructureView
                    structure={value}
                    indent={indent + 1}
                    onSelectFile={(filePath) => onSelectFile(`${key}/${filePath}`)}
                  />
                )}
              </>
            ) : (
              <div className="folder-item file file-item" onClick={() => onSelectFile(key)}>
                <Code2 size={16} className="icon" />
                <span className="text">{key}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getFileContentByPath(structure, path) {
  const parts = path.split('/');
  let current = structure;
  for (const part of parts) {
    current = current[part];
  }
  return current || '';
}

function Dash() {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [str , setstr ] = useState(initialFolderStructure);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem("name");

  const ws = useRef(null);
//  Response Parser 
// Parser to convert given file structure into the desired nested format
function parseApiResponse(files) {
  const output = {};

  if (!Array.isArray(files)) {
    throw new Error('Input must be an array');
  }

  for (const file of files) {
    const { content, dir } = file;
    const parts = dir.split('/').filter(Boolean); // Ensure no empty parts
    let current = output;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part is the file
        current[part] = content;
      } else {
        // Intermediate directories
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    });
  }

  return output;
}


//  Websocket Connection  ------> 

  const connectWebSocket = () => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = async(event) => {

      // CHECK AGENT OUTPUT 
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage.array);

      // CREATE NEW FILE STRUCTURE 
     // const resp =   await fetch("https://mocki.io/v1/33966a75-336b-47fe-b1af-4b0daf60c611").then((data)=>{return data.json()});
      const parsed =  parseApiResponse(receivedMessage.array) ;
      setstr(parsed);
      
      setMessages((prev) => [...prev, { type: 'agent', content: ` Your Website is Live at : ${receivedMessage.url}  Good Things Take Time  `}]);
      
      setIsGenerating(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.warn('WebSocket disconnected. Retrying in 3 seconds...');
      setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      ws.current?.close();
    };
  }, []);

  // Handle PROMPT Submission :-( Kitna karna padta hai yaar
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    setMessages((prev) => [...prev, { type: 'user', content: prompt }]);
    setIsGenerating(true);
    setPrompt('');

    ws.current.send(JSON.stringify({user_input : prompt , email : localStorage.getItem("email")}))
  };

  const handleFileSelect = (filePath) => {
    setSelectedFile(filePath);
    const content = getFileContentByPath(str, filePath);
    setFileContent(content);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div id="billu">
      <div className="container-billu">
        <h1 className="title">Welcome, {username}</h1>
        <div className="dashboard-grid">
          <div className="panel chat-section">
            <div className="panel-header">
              <MessageSquare className="icon" />
              <h2 className="panel-title">Chat with Billu</h2>
            </div>
            <div className="messages-container" style={{ overflowY: 'auto', height: '400px', scrollBehavior: 'smooth' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  {msg.content}
                </div>
              ))}
              {isGenerating && (
                <div className="loading-message">
                  <Loader2 className="spin" size={20} />
                  <span className="loading-text">Generating response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                className="chat-input"
                placeholder={isGenerating ? 'Waiting for response...' : 'Type your prompt...+ Enter '}
              />
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <FolderTree className="icon" />
              <h2 className="panel-title">Folder Structure</h2>
            </div>
            <div className="folder-structure">
              <FolderStructureView structure={str}

              onSelectFile={handleFileSelect} />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <Code2 className="icon" />
              <h2 className="panel-title">Code Viewer</h2>
            </div>
            <div className="code-viewer" style={{ height: '80%' }}>
              {selectedFile ? (
                <div>
                  <h3 className="file-name">{selectedFile}</h3>
                  <Editor height="400px" defaultLanguage="typescript" value={fileContent} theme="vs-dark" options={{ readOnly: true }} />
                </div>
              ) : (
                <div className="empty-state">Select a file from the folder structure to view its content</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash;
