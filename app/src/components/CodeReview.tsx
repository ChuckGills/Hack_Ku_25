import React, { useState, useEffect } from 'react';
import { PullRequest } from './PullRequests';
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

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
            paddingBottom: '5em',
            width: '75vw',
            overflowY: 'scroll',
            height: '61vh',
            fontFamily: "'BigBlueTerminal', sans-serif"
            // wordBreak: 'break-word',
            // overflowWrap: 'break-word',
        }}>
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
        </div >
    )
}