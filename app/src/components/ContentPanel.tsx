import React, {useState, useEffect} from 'react';
import {Repo} from './RepoCard.tsx';
import styles from './ContentPanel.module.css';

interface ContentPanelProps {
    repo: Repo;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({repo}) => {
    // const [repo, setRepo] = useState<Repo | null>();

    return (
        <div className={styles.panelContainer}>
            <div className={styles.headerContainer}>
                {repo ? repo.name : 'Select a repository!'}
            </div>

            <div className={styles.contentContainer}>
                test test test
            </div>
        </div>
    );
}