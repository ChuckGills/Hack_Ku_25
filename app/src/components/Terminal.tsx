import React, { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.css';

interface Command {
  name: string;
  subCommands: string[];
}

// Define your commands
const commands: Command[] = [
    { name: 'pr', subCommands: ['view', 'list', 'create'] },
    { name: 'git', subCommands: ['user'] },
    { name: 'repo', subCommands: ['list', 'select']},
    { name: 'gemini', subCommands: ['summarize', 'review', 'commit-title', 'commit-message']},
    { name: 'api', subCommands: []}
];

function filterCommands(input: string): string[] {
    // If input is empty, display the top-level commands
    input.trim();
    if (input === "") {
	return commands.map(cmd => cmd.name);
	
    }

    // Split the input into tokens to check if user entered a command and perhaps a sub-command
    const tokens = input.split(" ");

    // When only the top-level command (or its prefix) is entered
    if (tokens.length === 1) {
	// Look for commands that start with the typed text
	const matchingCommands = commands.filter(cmd => cmd.name.startsWith(tokens[tokens.length - 1]));

	// If the input exactly matches one top-level command, show its sub-commands
	if (matchingCommands.length === 1 && matchingCommands[0].name === tokens[0]) {
	    return matchingCommands[0].subCommands;
	} else {
	    // Otherwise, show matching top-level command suggestions
	    return matchingCommands.map(cmd => cmd.name);
	}
    } else if (tokens.length > 1) {
	// If the user has typed a top-level command and begun a sub-command, find the command first.
	const mainCommand = tokens[tokens.length - 2];
	const subCommandInput = tokens[tokens.length - 1];
	const command = commands.find(cmd => cmd.name === mainCommand);

	if (command) {
	    // Filter the sub-commands based on the input.
	    console.log("Command Options: ", command.subCommands);
	    const matchingSubCommands = command.subCommands.filter(sub => sub.startsWith(subCommandInput));
	    return matchingSubCommands;
	}
    }
}

export const Terminal: React.FC = () => {
    const [outputs, setOutputs] = useState<string[]>([]);
    const [cmdText, setCmdText] = useState<string>('');
    const [autoComplete, setAutoComplete] = useState<string[]>(commands.map(cmd => cmd.name));
    const [prefix, setPrefix] = useState<string>('$');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [selectionIndex, setSelectionIndex] = useState<number>(0);

    const inputRef = useRef<HTMLElement>(null);
    
    const onFocus = () => setIsFocused(true);
    const onBlur = () => {setIsFocused(false); setSelectionIndex(0);}

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
	if (e.key === "Escape")
	    inputRef.current.blur();

	if (e.key === "ArrowUp")
	    setSelectionIndex(selectionIndex - 1 < 0 ? autoComplete.length-1 : selectionIndex - 1);
	if (e.key === "ArrowDown")
	    setSelectionIndex(selectionIndex + 1 > autoComplete.length-1 ? 0 : selectionIndex + 1)
	console.log("selection index", selectionIndex);

	if (e.key === "Backspace")
	    setAutoComplete(filterCommands(cmdText));

	if(e.key === "Tab")
	{
	    e.preventDefault();
	    let commandToken = cmdText.split(" ");
	    const completedCommand = autoComplete[selectionIndex];

	    if (commandToken.length > 1)
	    {
		commandToken[commandToken.length - 1] = completedCommand;
	    }
	    else
	    {
		commandToken[0] = completedCommand;
	    }

	    
	    setCmdText(
		commandToken.join(" ") + " "
	    );
	    setSelectionIndex(0);
	    setAutoComplete(filterCommands(commandToken.join(" ") + " "));
	}
	
	if (e.key !== "Enter") return;
	
        // Append the command itself
        setOutputs(prev => [...prev, `> ${cmdText}`]);

        try {
            // Invoke the Python script via IPC and await its JSON response
            const result = await window.myAPI.runCommand(cmdText);
            setOutputs(prev => [...prev, JSON.stringify(result)]);
        } catch (error) {
            setOutputs(prev => [...prev, `Error: ${error}`]);
        }
        setCmdText('');
	setAutoComplete("");
    };
    
    const cmdTextInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCmdText(e.target.value);
	setAutoComplete(filterCommands(e.target.value));
    };

    return (
        <div className={styles.terminalContainer}>	{/* Terminal Container */}

            <div className={styles.outputContainer}> {       /* Output Container */
                outputs.slice().reverse().map((output, index) => (
                    <p className={styles.output}><b style={{ color: '#33ff33' }}>{outputs.length - index - 1}:</b> {output}</p>
                ))} </div> {/* End Output Container */}

            <div className={styles.inputContainer}>        {/* Input Box */}
            <span className={styles.prefix}>{prefix}</span>
            <input ref={inputRef} onFocus={onFocus} onBlur={onBlur} value={cmdText} onChange={cmdTextInputHandler} className={styles.input} onKeyDown={handleKeyDown} placeholder="focus" />

	    {autoComplete?.length > 0 && isFocused && ( <div className={styles.commandMenu}>	{/* Autofill Box */}
		<ul>
		{autoComplete.length > 0 && autoComplete.map((option, index) => (<li key={`autocomplete_option${index}`} style={{color: index===selectionIndex ? '#33ff33' : 'rgb(141, 242, 255)'}}>{option}</li>))}
		</ul>
		</div>)} {/* End Autofill Box */}
            </div> {/* End Input Box */}


        </div> /* End Terminal Container */
    );
}

// export default Terminal;
