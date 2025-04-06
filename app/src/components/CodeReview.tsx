import React, { useState, useEffect } from 'react';
import { PullRequest } from './PullRequests';

interface CodeReviewProps {
    pr: PullRequest
}

export const CodeReview: React.FC<CodeReviewProps> = ({ pr }) => {
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (pr === null)
            return;

        const getSummary = async () => {
            const data = await window.myAPI.runCommand(`gemini review ${pr.number}`);
            console.log("review", data);
            setText(data);
        }
        getSummary();

    }, [pr])

    return (
        <div>
            {text}
        </div>
    )
}