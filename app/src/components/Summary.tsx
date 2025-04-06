import React, { useState, useEffect } from 'react';
import { Repo } from "./RepoCard";
import { PullRequest } from './PullRequests';
import ReactMarkDown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface SummaryProps {
    repo: Repo,
    pr: PullRequest
}

export const Summary: React.FC<SummaryProps> = ({ repo, pr }) => {
    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (repo === null || pr === null)
            return;

        const getSummary = async () => {
            const data = await window.myAPI.runCommand(`gemini summarize ${pr.number}`);
            console.log("summarize", data);
            setText(data);
            setLoading(false);
        }
        getSummary();

    }, [pr])


    return (
        <div style={{
            padding: '2em',
            paddingBottom: '5em',
            width: '75vw',
            overflowY: 'scroll',
            height: '61vh',
            fontFamily: "'BigBlueTerminal', sans-serif",
            fontWeight: 'lighter',
            fontSize: '16px',
            lineHeight: '22px'
            // wordBreak: 'break-word',
            // overflowWrap: 'break-word',
        }}>
            {!loading ? (<>
                <ReactMarkDown
                children={text}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        return inline ? (
                            <code
                                style={{
                                    backgroundColor: '#2d2d2d',
                                    borderRadius: '4px',
                                    padding: '0.2em 0.4em',
                                    fontSize: '14px',
                                    fontFamily:
                                        'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                }}
                                {...props}
                            >
                                {children}
                            </code>
                        ) : (
                            <pre
                                style={{
                                    backgroundColor: '#2d2d2d',
                                    borderRadius: '6px',
                                    padding: '1em',
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'break-word',
                                    maxWidth: '100%',
                                    overflowX: 'auto',
                                    fontFamily:
                                        'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                }}
                            >
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                }}
            />
            {/* </ReactMarkDown> */}
            <br />
            <br />
            <br />
            </>):(
                <img src={'logo.png'} style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    maxWidth: '100%', /* Ensure the image fits within the container */
                    height: 'auto'
                  }}/>
            )}
            
        </div >
    );
}