import React, {useState, useEffect} from 'react';
import {Repo} from './RepoCard.tsx';
import styles from './ContentPanel.module.css';

interface ContentPanelProps {
    repo: Repo;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({repo}) => {
    // const [repo, setRepo] = useState<Repo | null>();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const tabs = ['Summary', 'Pull Requests', 'Linter'];

    return (
        <div className={styles.panelContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.repoText}>
                    {repo ? repo.name : 'Select a repository!'}
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
                {activeTab}
            </div>
        </div>
    );
}