import React, { useState, useEffect } from 'react';
import { PullRequest } from './PullRequests';
import ReactMarkDown from 'react-markdown';

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
        <div style={{
            padding: '2em',
            width: 'auto',
            // wordBreak: 'break-word',
            // overflowWrap: 'break-word',
        }}>
            <ReactMarkDown
              components={{
                pre: ({ node, ...props }) => (
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                    {...props}
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                    {...props}
                  />
                ),
              }}>
                {text}
            </ReactMarkDown>
        </div>
    )
}