import React, { useState, useEffect } from 'react';
import { exec } from 'child_process';
import path from 'node:path';
import styles from './SidePanel.module.css';


// import { runScript } from '../renderer.ts';



export const SidePanel: React.FC = () => {
    const [repos, setRepos] = useState<string[]>(['test','stest']);

    useEffect(() => {
        // get repos
    }, []);

    return (
        <div className={styles.panelContainer}>
            <div className={styles.headerContainer}>
                Repositories
            </div>

            <div className={styles.contentContainer}>
                {
                    repos.map((repo) => (
                        <p>{repo}</p>
                    ))
                }
            </div>
        </div>
    );
}