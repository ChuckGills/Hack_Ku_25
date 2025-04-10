import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import styles from './app.module.css';

import { Terminal } from './Terminal.tsx';
import { SidePanel } from './SidePanel.tsx';
import { ContentPanel } from './ContentPanel.tsx';
import { Repo } from './RepoCard.tsx';
import { PullRequest } from './PullRequests.tsx';

const App: React.FC = () => {
    const [repo, setRepo] = useState<Repo | null>(null);
    const [pr, setPr] = useState<PullRequest | null>(null);

    const handleChildRepoData = (repo: Repo) => {
        setRepo(repo);
    }

    const handleChildPRData = (pr: PullRequest) => {
        setPr(pr);
    }

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>

                <div className={styles.side}>
                    <div className={styles.headerContainer}>
                        Repositories
                    </div>
                    <div className={styles.sideScroll}>
                        {/* All the content that needs vertical scrolling goes here */}
                        <SidePanel sendDataToParent={handleChildRepoData} />
                        {/* Other side panel content */}
                    </div>
                </div>
                <div className={styles.main}>
                    <ContentPanel repo={repo} pr={pr} sendDataToParent={handleChildPRData} />
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
