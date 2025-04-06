import React, { useState, useEffect } from 'react';
import { Repo } from './RepoCard.tsx';

interface PullRequestsProps {
    repo: Repo;
}

interface PullRequest {
    author: string,
    number: number,
    title: string,
}

export const PullRequests: React.FC<PullRequestsProps> = ({ repo }) => {
    const [prArr, setPrArr] = useState<PullRequest[]>([]);
    const [pullRequest, setPullRequest] = useState<PullRequest>(null);

    useEffect(() => {
        // get repos
        const fetchRepos = async () => {
            const result = await window.myAPI.runCommand('pr list');
            let raw = result.replace(/^Open PRs:\s*/, '');
            raw = raw.replace(/\b(False|True)\b/g, match => match === 'False' ? 'false' : 'true');
            raw = raw.replace(/'/g, '"');
            console.log("raw\n", raw);
            const parsedData = JSON.parse(raw);
            const res: PullRequest[] = parsedData.map((pr: any) => ({
                author: pr.author.login,
                number: pr.number,
                title: pr.title,
            }));

            setPrArr(res);
        }
        fetchRepos();
    }, [repo]);

    return (
        <div>
            {prArr.map((pr, index) => (
                <div style={{
                    color: 'white'
                }}>{`[${pr.number}] ${pr.author}: ${pr.title}`}</div>
            ))}
        </div>
    )
}