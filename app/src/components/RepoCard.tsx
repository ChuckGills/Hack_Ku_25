import React, { useState } from 'react';
import styles from './RepoCard.module.css';
// import {shell} from 'electron';

export interface Repo {
    name: string,
    url: string,
    updatedAt: string,
    visibility: string
}

interface RepoCardProps {
    repo: Repo
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
    const date = new Date(repo.updatedAt);
    const simpleDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // 12-hour format (AM/PM)
    });

    const openLink = (url: string) => {
        window.myAPI.openLink(url);  // Access the method exposed by preload.js
    };

    const selectRepo = async (name: string) => {
        const result = await window.myAPI.runCommand(`repo select ${name}`);
    }

    return (
        <div className={styles.repoCardContainer}>
	    
            <div style={{ display: 'flex',
			  justifyContent: 'space-between',
			  alignItems: 'center',
			  width: '100%' }}>

                <span style={{
                    color: repo.visibility === 'PUBLIC'
                        ? 'white'
                        : repo.visibility === 'PRIVATE'
                            ? 'red'
                            : 'white',
                    fontSize: 'x-small',
                    alignSelf: 'center',
                    paddingRight: '8px'
                }}> {repo.visibility} </span>
            </div>

            <span style={{ color: 'rgb(127, 210, 249)' }}>Updated: {simpleDate}</span><br />
            <br />
        </div>
    );
}
