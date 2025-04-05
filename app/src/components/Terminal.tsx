import React, { useState } from 'react';
import styles from './Terminal.module.css';

export const Terminal: React.FC = () => {
  const [outputs, setOutputs] = useState<string[]>([]);
  const [cmdText, setCmdText] = useState<string>('');

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
  };

  return (
    <div className={styles.terminalContainer}>
      {/* Output container */}
      <div className={styles.outputContainer}>
        {outputs.slice().reverse().map((output, index) => (
          <p key={index} className={styles.output}>
            <b>{outputs.length - index - 1}:</b> {output}
          </p>
        ))}
      </div>
      {/* Input container */}
      <div className={styles.inputContainer}>
        <input
          value={cmdText}
          onChange={cmdTextInputHandler}
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};
