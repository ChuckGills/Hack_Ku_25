import React, {useState, useEffect} from 'react';
import { Repo } from "./RepoCard";

interface PullRequests {
    repo: Repo;
}

interface PullRequest {
    author: string;
    number: number;
    title: string;
}
export const PullRequests: React.FC<PullRequests> = ({repo}) => {
    const [prs, setPrs] = useState<PullRequest[]>([]);

    useEffect(()=>{
        const fetchRepo = async () => {
            const result = await window.myAPI.runCommand(`pr list`);
            console.log(result);
        }
        fetchRepo();
    },[repo])

    return (
        <div>
            {/* < */}
        </div>
    );
}
