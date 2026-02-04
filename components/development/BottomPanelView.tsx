
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import Icon from '../shared/Icon';

interface BottomPanelViewProps {
    onClose: () => void;
    logs?: string[];
}

const BottomPanelView: React.FC<BottomPanelViewProps> = ({ onClose, logs = [] }) => {
    const [activeTab, setActiveTab] = useState('terminal');
    const [lines, setLines] = useState<string[]>([
        "Nexus OS [Version 1.2.0]",
        "(c) Nexus Corporation. All rights reserved.",
        ""
    ]);
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastLogIndex = useRef(0);

    // Auto-scroll to bottom whenever lines change
    useEffect(() => {
        if (scrollRef.current) {
             scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    // Focus input when clicking on terminal area
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    // Ingest external logs
    useEffect(() => {
        if (logs.length > lastLogIndex.current) {
            const newLogs = logs.slice(lastLogIndex.current);
            const formattedLogs = newLogs.map(log => `\x1b[33m[SYSTEM]\x1b[0m ${log}`);
            setLines(prev => [...prev, ...formattedLogs]);
            lastLogIndex.current = logs.length;
        }
    }, [logs]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = command.trim();
            const newLines = [...lines, `➜  project \x1b[32mgit:(main)\x1b[0m ${cmd}`];
            
            if (cmd) {
                setHistory(prev => [...prev, cmd]);
                setHistoryIndex(-1);
            }

            // Command Simulation Logic
            if (cmd === 'clear' || cmd === 'cls') {
                setLines([]);
                setCommand('');
                return;
            } else if (cmd === 'help') {
                newLines.push('Available commands: help, clear, status, ls, npm <script>, git <cmd>');
            } else if (cmd === 'ls') {
                 newLines.push('src  public  package.json  tsconfig.json  README.md  node_modules');
            } else if (cmd === 'status') {
                 newLines.push('System Status: Operational');
                 newLines.push('CPU: 12% | MEM: 450MB');
            } else if (cmd === 'git status') {
                 newLines.push('On branch main');
                 newLines.push('Your branch is up to date with \'origin/main\'.');
                 newLines.push('nothing to commit, working tree clean');
            } else if (cmd.startsWith('git commit')) {
                 newLines.push('[main a1b2c3d] ' + (cmd.split('-m')[1]?.replace(/"/g, '').trim() || 'updates'));
                 newLines.push(' 1 file changed, 12 insertions(+)');
            } else if (cmd === 'npm install' || cmd === 'yarn') {
                 newLines.push('added 124 packages, and audited 453 packages in 3s');
                 newLines.push('found 0 vulnerabilities');
            } else if (cmd.startsWith('npm run') || cmd.startsWith('yarn')) {
                newLines.push(`> executing script '${cmd.split(' ')[2] || 'dev'}'...`);
                if (cmd.includes('dev')) {
                    newLines.push('ready started server on 0.0.0.0:3000, url: http://localhost:3000');
                } else if (cmd.includes('test')) {
                     newLines.push('PASS src/components/App.test.tsx');
                     newLines.push('Test Suites: 1 passed, 1 total');
                } else {
                    newLines.push('> done in 0.5s');
                }
            } else if (cmd) {
                newLines.push(`zsh: command not found: ${cmd}`);
            }

            setLines(newLines);
            setCommand('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCommand(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = Math.min(history.length - 1, historyIndex + 1);
                if (historyIndex === history.length - 1) {
                    setHistoryIndex(-1);
                    setCommand('');
                } else {
                    setHistoryIndex(newIndex);
                    setCommand(history[newIndex]);
                }
            }
        }
    };

    // Render colored text
    const renderLine = (text: string, index: number) => {
        // Simple color parsing for specific ANSI-like codes simulation
        // \x1b[32m = green, \x1b[33m = yellow, \x1b[0m = reset
        const parts = text.split(/(\x1b\[32m|\x1b\[33m|\x1b\[0m)/g);
        let currentColor = 'text-slate-300';
        
        return (
            <div key={index} className="whitespace-pre-wrap break-all leading-5">
                {parts.map((part, i) => {
                    if (part === '\x1b[32m') { currentColor = 'text-green-400'; return null; }
                    if (part === '\x1b[33m') { currentColor = 'text-yellow-400'; return null; }
                    if (part === '\x1b[0m') { currentColor = 'text-slate-300'; return null; }
                    return <span key={i} className={currentColor}>{part}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="h-full bg-[#1e293b] border-t border-[#334155] flex flex-col">
            <div className="flex justify-between items-center bg-[#0f172a] px-2 border-b border-[#334155] flex-shrink-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList className="bg-transparent border-0 p-0 h-9">
                        <TabsTrigger value="terminal" className="data-[state=active]:bg-[#1e293b] data-[state=active]:text-accent rounded-t-md rounded-b-none border-b-0 px-4 h-9 text-xs uppercase">Terminal</TabsTrigger>
                        <TabsTrigger value="output" className="data-[state=active]:bg-[#1e293b] data-[state=active]:text-accent rounded-t-md rounded-b-none border-b-0 px-4 h-9 text-xs uppercase">Output</TabsTrigger>
                        <TabsTrigger value="problems" className="data-[state=active]:bg-[#1e293b] data-[state=active]:text-accent rounded-t-md rounded-b-none border-b-0 px-4 h-9 text-xs uppercase">Problems</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                     <button onClick={() => setLines([])} className="text-slate-400 hover:text-white p-1" title="Clear Terminal"><Icon name="trash" className="h-3 w-3" /></button>
                     <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><Icon name="x" className="h-3 w-3" /></button>
                </div>
            </div>
            
            <div className="flex-1 bg-[#0b1120] overflow-hidden relative">
                {activeTab === 'terminal' && (
                    <div 
                        className="h-full p-2 font-mono text-xs text-slate-300 overflow-y-auto" 
                        ref={scrollRef}
                        onClick={handleContainerClick}
                    >
                        {lines.map((line, i) => renderLine(line, i))}
                        <div className="flex items-center mt-1">
                            <span className="text-green-400 mr-2 flex-shrink-0">➜  project git:(main)</span>
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-transparent border-none outline-none flex-1 text-slate-100 p-0 m-0 h-5"
                                autoFocus
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                )}
                {activeTab === 'output' && (
                    <div className="h-full p-2 font-mono text-xs text-slate-300 overflow-y-auto">
                        <p>[INFO] Server started at http://localhost:3000</p>
                        <p>[INFO] Database connection established.</p>
                        <p className="text-yellow-400">[WARN] DeprecationWarning: Buffer() is deprecated due to security and usability issues.</p>
                        <p className="text-green-400">[SUCCESS] Build completed in 2.4s.</p>
                    </div>
                )}
                 {activeTab === 'problems' && (
                    <div className="h-full p-2 font-mono text-xs overflow-y-auto">
                         <div className="text-slate-400 mb-1 flex items-center gap-2">
                            <Icon name="checkCircle" className="h-3 w-3 text-green-400" />
                            <span>No problems found in workspace.</span>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomPanelView;
