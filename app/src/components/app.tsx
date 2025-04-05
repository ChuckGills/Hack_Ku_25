import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);

const App: React.FC = () => {
    const [outputs, setOutputs] = useState<string[]>([]);
    const [cmdText, setCmdText] = useState<string>('');

    const handleClick = () => {
        setOutputs([...outputs, cmdText]);
    }

    const cmdTextInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCmdText(e.target.value);
    }

    return (
        <div>
            {/* output div */}
            <div>
                {
                    outputs.map((output, index) => (
                        <p><b>{index}:</b> {output}</p>
                    ))
                }
            </div>

            {/* input div */}
            <div>
                <input value={cmdText} onChange={cmdTextInputHandler}/>
                <button onClick={handleClick}>Exec</button>
            </div>
        </div>
    );
};

root.render(<App/>);