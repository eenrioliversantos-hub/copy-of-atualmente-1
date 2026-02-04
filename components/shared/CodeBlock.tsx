import React, { useState } from 'react';
import { Button } from '../ui/Button';
import Icon from './Icon';

interface CodeBlockProps {
    language: string;
    code: string;
    isEditable?: boolean;
    onCodeChange?: (newCode: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, isEditable = false, onCodeChange }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900 rounded-lg my-2 text-left h-full flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-700/50 rounded-t-lg flex-shrink-0">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <Icon name="code" className="h-4 w-4" /> {language}
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-400 hover:text-white hover:bg-slate-600 h-8 px-2">
                    <Icon name={copied ? 'check' : 'copy'} className={`h-4 w-4 mr-1 ${copied ? 'text-green-400' : ''}`} />
                    {copied ? 'Copiado!' : 'Copiar'}
                </Button>
            </div>
            {isEditable ? (
                <textarea
                    value={code}
                    onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
                    className="w-full flex-1 bg-slate-900 text-white font-mono p-4 resize-none focus:outline-none text-sm rounded-b-lg"
                    spellCheck="false"
                />
            ) : (
                <pre className="p-4 text-sm text-white overflow-auto flex-1"><code className="font-mono">{code}</code></pre>
            )}
        </div>
    );
};

export default CodeBlock;