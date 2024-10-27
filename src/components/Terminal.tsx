import { useState, useRef, useEffect } from 'react';
import { FileSystemService } from '../services/fileSystem';
import { commandRegistry } from '../commands/registry';

interface TerminalHistory {
  command: string;
  output: string;
  timestamp: number;
}

const Terminal = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [fs] = useState(new FileSystemService());
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleCommand = (commandLine: string) => {
    // Parse command line respecting quotes
    const args: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < commandLine.length; i++) {
      const char = commandLine[i];
      
      if (char === '"' && (i === 0 || commandLine[i - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current) {
      args.push(current);
    }

    // Remove quotes from arguments
    const cleanArgs = args.map(arg => arg.replace(/^"(.*)"$/, '$1'));
    
    if (cleanArgs.length === 0) return;

    const cmd = cleanArgs[0].toLowerCase();
    const command = commandRegistry.getCommand(cmd);
    
    if (command) {
      const result = command.execute(cleanArgs.slice(1), fs);
      
      if (result.output === 'CLEAR_TERMINAL') {
        setHistory([]);
        return;
      }

      const newHistoryItem: TerminalHistory = {
        command: commandLine,
        output: result.output,
        timestamp: Date.now()
      };

      setHistory(prev => [...prev, newHistoryItem]);
    } else {
      const newHistoryItem: TerminalHistory = {
        command: commandLine,
        output: `Command not found: ${cmd}`,
        timestamp: Date.now()
      };

      setHistory(prev => [...prev, newHistoryItem]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] h-[90vh] bg-terminal-background rounded-lg shadow-2xl border border-terminal-text/10">
        {/* Terminal Header */}
        <div className="flex items-center h-8 bg-gray-800 rounded-t-lg px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        {/* Terminal Content */}
        <div 
          ref={terminalRef} 
          className="h-[calc(90vh-2rem)] overflow-y-auto p-4 font-mono text-sm sm:text-base"
        >
          {history.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex">
                <span className="text-terminal-prompt">$ </span>
                <span className="ml-2">{item.command}</span>
              </div>
              <div className="ml-4 whitespace-pre-wrap">{item.output}</div>
            </div>
          ))}
          <div className="flex">
            <span className="text-terminal-prompt">$ </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 ml-2 bg-transparent outline-none text-terminal-text"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;