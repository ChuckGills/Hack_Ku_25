import React, { useState } from 'react';
import styles from './Terminal.module.css';

let commandList: string[] = [
    "view",
    "list",
    "create",
    "git",
    "user",
]

function filterCommands(input: string): string[] {
    const cmdRegex = new RegExp(input, '');
    return commandList.filter((str) => cmdRegex.test(str))
}


export const Terminal: React.FC = () => {
    const [outputs, setOutputs] = useState<string[]>([]);
    const [cmdText, setCmdText] = useState<string>('');
    const [autoComplete, setAutoComplete] = useState<string[]>(commandList);
    const [prefix, setPrefix] = useState<string>('$')

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
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
            <input value={cmdText} onChange={cmdTextInputHandler} className={styles.input} onKeyDown={handleKeyDown} />

	    {cmdText.startsWith('') && ( <div className={styles.commandMenu}>	{/* Autofill Box */}
		<ul>
		    {autoComplete.map((option, index) => (<li key={`autocomplete_option${index}`}>{option}</li>))}
		</ul>
		</div>)} {/* End Autofill Box */}
            </div> {/* End Input Box */}


        </div> /* End Terminal Container */
    );
}

// export default Terminal;
