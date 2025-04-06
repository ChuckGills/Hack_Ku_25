import React, { useState } from 'react';
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

    return (
        <div style={{
            borderTop: '1px rgb(141, 242, 255) solid',
            borderBottom: '1px rgb(141, 242, 255) solid',
            // paddingBottom: '8px'
            padding: '12px',
            paddingBottom: '14px',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <span style={{
                    fontWeight: 'semi-bold',
		    fontSize: '20 px',
		    color: '#33ff33',
                    marginBottom: '4px',
		    cursor: 'pointer'
                }}
	onClick={() => openLink(repo.url)}>
                    {repo.name}
                </span>
                <span style={{
                    color: 'rgb(127, 210, 249)',
                    fontSize: 'x-small',
                    alignSelf: 'center',
                    paddingRight: '8px'
                }}>
                    {repo.visibility}
                </span>
            </div>
            <span style={{ color: 'rgb(127, 210, 249)' }}>Updated: {simpleDate}</span><br />
            <br/>
        </div>
    );
}
