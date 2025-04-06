import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import styles from './app.module.css';

import { Terminal } from './Terminal.tsx';
import { SidePanel } from './SidePanel.tsx';
import { ContentPanel } from './ContentPanel.tsx';
import { Repo } from './RepoCard.tsx';

const App: React.FC = () => {
    const [repo, setRepo] = useState<Repo | null>(null);

    const handleChildData = (repo: Repo) => {
        setRepo(repo);
    }

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.side}>
                    <SidePanel sendDataToParent={handleChildData}/>
                </div>
                <div className={styles.main}>
                    <ContentPanel repo={repo}/>
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