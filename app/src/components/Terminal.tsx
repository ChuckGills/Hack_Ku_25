import React, {useState} from 'react';
import styles from './Terminal.module.css';

export const Terminal: React.FC = () => {
    const [outputs, setOutputs] = useState<string[]>([]);
    const [cmdText, setCmdText] = useState<string>('');

    const handleKeyDown = (e: React.KeyboardEvent<Element>) => {
        if (e.key !== "Enter")
            return;
        
        setOutputs([...outputs, cmdText]);
        setCmdText('');
    }

    const cmdTextInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCmdText(e.target.value);
    }

    return (
        <div className={styles.terminalContainer}>
            {/* output div */}
            <div className={styles.outputContainer}>
                {
                    outputs.slice().reverse().map((output, index) => (
                        <p className={styles.output}><b>{outputs.length - index - 1}:</b> {output}</p>
                    ))
                }
            </div>

            {/* input div */}
            <div className={styles.inputContainer}>
                <input value={cmdText} onChange={cmdTextInputHandler} className={styles.input} onKeyDown={handleKeyDown}/>
            </div>
        </div>
    );
}

// export default Terminal;