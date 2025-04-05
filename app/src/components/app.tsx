import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import styles from './app.module.css';

import { Terminal } from './Terminal.tsx';
import { SidePanel } from './SidePanel.tsx';

const App: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.side}>
                    <SidePanel />
                </div>
                <div className={styles.main}>
                    CONTENT
                </div>
            </div>
            <div className={styles.terminalContainer}>
                <Terminal />
            </div>
        </div>
    )
};

const root = createRoot(document.body);
root.render(<App />);