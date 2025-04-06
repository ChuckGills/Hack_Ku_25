import React, { useState, useEffect } from 'react';
import { Repo } from "./RepoCard";
import styles from "./PullRequests.module.css";

interface PullRequestsProps {
    repo: Repo,
    sendDataToParent: (data: PullRequest) => void;
}

export interface PullRequest {
    author: string;
    number: number;
    title: string;
    open?: boolean;
}
export const PullRequests: React.FC<PullRequestsProps> = ({ repo, sendDataToParent }) => {
    const [openPrs, setOpenPrs] = useState<PullRequest[]>([]);
    const [closedPrs, setClosedPrs] = useState<PullRequest[]>([]);

    useEffect(() => {
        if (repo === null) {
            return;
        }
        const getPrList = async () => {
            const data = await window.myAPI.runCommand(`pr list`);

            // Map the data to fit the PullRequest interface
            const openPrArr: PullRequest[] = data.open.map((pr: any) => ({
                author: pr.author.login,
                number: pr.number,
                title: pr.title,
            }));

            const closedPrArr: PullRequest[] = data.closed.map((pr: any) => ({
                author: pr.author.login,
                number: pr.number,
                title: pr.title,
            }));
            setOpenPrs(openPrArr);
            setClosedPrs(closedPrArr);
            // return result;
        }
        getPrList();
    }, [repo]);

    const selectPr = (pr: PullRequest) => {
        console.log("called", pr);
        sendDataToParent(pr);
    }

    return (
        <div>
            {
                openPrs.map((pr, index) => (
                    <div className={styles.openPullRequest} onClick={() => selectPr(pr)}>
			<span style={{ color: 'grey' }}> { `[${pr.number}] > ` }</span>
                        <span style={{ color: '#33ff33' }}>{`open`}</span>
			<span style={{ color: 'yellow' }}> {`${pr.author}: `}</span>
                        <span style={{ color: 'white' }}>{`${pr.title}`}</span>
                    </div>
                ))
            }
            {
                closedPrs.map((pr, index) => (
                    <div className={styles.closedPullRequest} onClick={() => selectPr(pr)}>
			<span style={{ color: 'grey' }}> { `[${pr.number}] > ` }</span>
                        <span style={{ color: 'red' }}>{`closed`}</span>
		    	<span style={{ color: 'yellow' }}> {`${pr.author}: `}</span>
                        <span style={{ color: 'white' }}>{`${pr.title}`}</span>
                    </div>
                ))
            }
        </div>
    );
}
