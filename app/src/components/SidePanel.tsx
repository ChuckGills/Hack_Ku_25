import React, { useState, useEffect } from 'react';
import { exec } from 'child_process';
import path from 'node:path';
import styles from './SidePanel.module.css';

import { Repo, RepoCard } from './RepoCard.tsx';

interface SidePanelProps {
    sendDataToParent: (data: Repo) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ sendDataToParent }) => {
    const [repos, setRepos] = useState<Repo[]>([]);

    useEffect(() => {
        // get repos
        const fetchRepos = async () => {
            const result = await window.myAPI.runCommand('repo list');
            // let lines = result.split('\n');
            // Filter out lines that start with "<generator"
            // lines = lines.filter(line => !line.trim().startsWith('<generator'));
            // Rejoin the remaining lines
            // let raw = lines.join('\n');
            // Remove a "Repos" prefix if present
            let raw = result.replace(/^Repositories:\s*/, '');
            // Optionally, replace single quotes with double quotes if needed
            raw = raw.replace(/'/g, '"');
            console.log("raw\n", raw);
            const res: Repo[] = JSON.parse(raw.slice("\n"));
            // console.log("raw", raw, raw.slice[0])
            setRepos(res);
        }
        fetchRepos();
    }, []);

    const selectRepo = (repo: Repo) => {
        const fetchRepo = async () => {
            const result = await window.myAPI.runCommand(`repo select ${repo.name}`);
            console.log(result);
            sendDataToParent(repo);

        }
        fetchRepo();
    }

    return (
        <div className={styles.panelContainer}>
            <div className={styles.contentContainer}>
                {
                    repos.map((repo, index) => (
                        <div onClick={() => selectRepo(repo)}>
                            <RepoCard
                                key={`repo_card_${index}`}
                                repo={repo}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
