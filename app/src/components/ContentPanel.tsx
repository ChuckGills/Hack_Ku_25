import React, {useState, useEffect} from 'react';
import {Repo} from './RepoCard.tsx';
import styles from './ContentPanel.module.css';
import { PullRequest, PullRequests } from './PullRequests.tsx';
import { Summary } from './Summary.tsx';


interface ContentPanelProps {
    repo: Repo,
    pr: PullRequest,
    sendDataToParent: (data: PullRequest) => void;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ repo, pr }) => {
    // const [currRepo, setCurrRepo] = useState<Repo | null>();
    const [activeTab, setActiveTab] = useState<string>('Pull Requests');
    const [pullReq, setPullReq] = useState<PullRequest>(null);

    const tabs = ['Pull Requests','Summary',];

    const handleChildData = (pr: PullRequest) => {
        setPullReq(pr);
        
    }

    const renderTab = () => {
        switch (activeTab) {
            case 'Summary':
                return <Summary repo={repo} pr={pullReq}/>;
                return <p>summary</p>
            case 'Pull Requests':
                return <PullRequests repo={repo} sendDataToParent={handleChildData}/>;
            default:
                return null;
        }
    }

    return (
        <div className={styles.panelContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.repoText}>
                    {repo ? repo.name : 'Select a repository!'}
                    {pullReq ? `: [${pullReq.number}] ${pullReq.title}` : ''}
                </div>
                <div className={styles.tabsContainer}>
                    {tabs.map((tab, index)=>(
                        <div 
                            key={`tab_${index}`} 
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={()=>setActiveTab(tab)}>
                                {tab}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.contentContainer}>
                {renderTab()}
            </div>
        </div>
    );
}