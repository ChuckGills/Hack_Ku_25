import React, { useState, useEffect } from 'react';
import { Repo } from "./RepoCard";
import { PullRequest } from './PullRequests';

interface SummaryProps {
    repo: Repo,
    pr: PullRequest
}


export const Summary: React.FC<SummaryProps> = ({ repo, pr }) => {
    const [text, setText] = useState<string>('');
    useEffect(()=>{
        if (repo === null || pr === null)
            return;

        const getSummary = async () => {
            const data = await window.myAPI.runCommand(`gemini summarize ${pr.number}`);
            console.log("summarize",data);
            setText(data);
        }
        getSummary();

    }, [pr])


    return (
        <div>
            {text}
        </div>
    );
}