import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FILE_ICONS = {
  "API": "🧪",
  "Architecture": "🏛️",
  "Build": "🔨",
  "Changelog": "📝",
  "Coding": "📔",
  "Config": "⚙️",
  "Configuration": "🔧",
  "Contributing": "🤝",
  "Deploy": "🚀",
  "Deployment": "📦",
  "Design": "🎨",
  "Development": "🛠️",
  "Docs": "📚",
  "Documentation": "📖",
  "Examples": "💡",
  "FAQ": "❓",
  "Getting Started": "🎯",
  "GitHub": "🐙",
  "Guide": "📘",
  "Installation": "📥",
  "License": "📜",
  "Notes": "📋",
  "Project": "🌟",
  "Roadmap": "🗺️",
  "Sample": "📂",
  "Setup": "⚡",
  "Test": "🧬",
  "Todo": "✅",
  "Troubleshooting": "🔍",
  "Tutorial": "🎓",
  "Usage": "📊",
  "default": "📄"
};

export default function MarkdownViewer() {
  const navigate = useNavigate();
  const [markdownFiles, setMarkdownFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastModified, setLastModified] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getIconForFile = (filename) => {
    const name = filename.replace('.md', '').replace(/_/g, ' ');
    
    for (const key in FILE_ICONS) {
      if (name.toLowerCase() === key.toLowerCase()) {
        return FILE_ICONS[key];
      }
    }
    for (const key in FILE_ICONS) {
      if (name.toLowerCase().startsWith(key.toLowerCase())) {
        return FILE_ICONS[key];
      }
    }
    
    return FILE_ICONS.default;
  };

  const discoverMarkdownFiles = async () => {
    try {
      const possibleFiles = [
        'Coding.md', 'GitHub_Repo.md', 'Sample.md',
        'Notes.md', 'Todo.md', 'Guide.md', 'Tutorial.md',
        'API.md', 'Docs.md', 'Documentation.md', 'Project.md',
        'Setup.md', 'Config.md', 'Configuration.md', 'Test.md',
        'Development.md', 'Deploy.md', 'Deployment.md', 'Build.md',
        'Getting_Started.md', 'Installation.md', 'Usage.md', 'Examples.md',
        'FAQ.md', 'Troubleshooting.md', 'Contributing.md', 'License.md',
        'Changelog.md', 'Roadmap.md', 'Architecture.md', 'Design.md'
      ];
      
      const discovered = [];
      await Promise.all(
        possibleFiles.map(async (filename) => {
          try {
            const response = await fetch(`/${filename}`, { method: 'HEAD' });
            if (response.ok) {
              const label = filename.replace('.md', '').replace(/_/g, ' ');
              const lastMod = response.headers.get("last-modified");
              discovered.push({
                id: filename.toLowerCase().replace(/\.md$/, '').replace(/[^a-z0-9_]/g, '-'),
                label: label,
                path: `/${filename}`,
                icon: getIconForFile(filename),
                filename: filename,
                lastModified: lastMod ? new Date(lastMod) : null
              });
            }
          } catch (e) {
          }
        })
      );
      discovered.sort((a, b) => a.label.localeCompare(b.label));
      setMarkdownFiles(discovered);
      setSelectedFile(current => {
        if (current && discovered.find(f => f.id === current.id)) {
          return current;
        }
        return discovered.length > 0 ? discovered[0] : null;
      });
    } catch (err) {
      console.error('Error discovering markdown files:', err);
    }
  };

  const fetchMarkdown = async (file) => {
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(file.path + "?t=" + Date.now());
      
      if (!response.ok) {
        throw new Error(`Failed to load ${file.label}`);
      }

      const text = await response.text();
      const modified = response.headers.get("last-modified");
      
      setContent(text);
      setLastModified(modified);
    } catch (err) {
      setError(err.message);
      setContent("# Error\n\nFailed to load markdown file.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    discoverMarkdownFiles();
    const discoveryInterval = setInterval(() => {
      discoverMarkdownFiles();
    }, 3000);
    
    return () => clearInterval(discoveryInterval);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchMarkdown(selectedFile);
    }
  }, [selectedFile]);

  const filteredFiles = markdownFiles.filter(file =>
    file.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="max-w-400 mx-auto px-6 pb-20 space-y-6">
      {/* Header with Back Button */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6"
      >
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <h1 className="text-4xl font-black italic uppercase tracking-widest text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">
          📚 Documentation Hub
        </h1>
      </motion.div>

      {/* Main Content - 2 Column Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Column 1: File Browser */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
              Documents
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search documents..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* File Count Badge */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available Files
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {/* File List */}
          <div className="space-y-2 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <motion.button
                  key={file.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all text-left ${
                    selectedFile?.id === file.id
                      ? "bg-indigo-500/20 border border-indigo-500/40 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-indigo-500/30"
                  }`}
                >
                  <span className="text-xl shrink-0">{file.icon}</span>
                  <span className="flex-1 truncate">{file.label}</span>
                  {selectedFile?.id === file.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-indigo-400"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))
            ) : markdownFiles.length === 0 ? (
              <div className="py-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl mb-3"
                >
                  📂
                </motion.div>
                <p className="text-slate-400 text-sm mb-2">No markdown files found</p>
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-slate-500 text-xs flex items-center justify-center gap-2"
                >
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Scanning...
                </motion.p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-slate-400 text-sm">No files match your search</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Column 2: Markdown Content Viewer */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl min-h-175"
        >
          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key={selectedFile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col relative"
              >
                {/* Document Header */}
                <div className="bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-500 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.span 
                      className="text-4xl"
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {selectedFile.icon}
                    </motion.span>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{selectedFile.label}</h3>
                      <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Documentation</p>
                    </div>
                  </div>
                  {loading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-white text-2xl"
                    >
                      ↻
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 px-8 py-8 pb-16 overflow-y-auto custom-scrollbar">
                  {error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <strong className="font-black">Error:</strong>
                        <p className="text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-slate dark:prose-invert max-w-none
                        prose-headings:font-bold prose-headings:text-white
                        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6
                        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-4
                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                        prose-code:text-indigo-400 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-700
                        prose-strong:text-white
                        prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                        prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                        prose-li:text-slate-300 prose-li:mb-2
                        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400
                        prose-hr:border-slate-700
                        prose-table:border-collapse prose-table:w-full
                        prose-th:bg-slate-800 prose-th:p-3 prose-th:text-left prose-th:text-white
                        prose-td:border prose-td:border-slate-700 prose-td:p-3 prose-td:text-slate-300
                        prose-img:rounded-lg prose-img:shadow-lg">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Footer - Fixed at bottom */}
                {lastModified && (
                  <div className="absolute bottom-0 left-0 right-0 px-8 py-4 bg-black/40 border-t border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                    <span className="opacity-60">🕒</span>
                    <span className="font-mono">Last modified: {new Date(lastModified).toLocaleString()}</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center px-8 py-16 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl mb-4"
                >
                  📄
                </motion.div>
                <p className="text-slate-300 text-xl font-bold mb-3">
                  Select a document to view
                </p>
                <p className="text-slate-400 text-sm">
                  Choose a file from the left to get started
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
