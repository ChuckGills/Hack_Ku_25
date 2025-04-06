import React, {useState, useEffect} from 'react';
import { Repo } from "./RepoCard";

interface PullRequests {
    repo: Repo;
}

interface PullRequest {
    author: string;
    number: number;
    title: string;
    open?: boolean;
}
export const PullRequests: React.FC<PullRequests> = ({repo}) => {
    const [openPrs, setOpenPrs] = useState<PullRequest[]>([]);
    const [closedPrs, setClosedPrs] = useState<PullRequest[]>([]);

    useEffect(()=>{
        const getPrList = async () => {
            const data = await window.myAPI.runCommand(`pr list`);
            console.log('data',data);
            
            // const parsedData = JSON.parse(data);

            // Map the data to fit the PullRequest interface
            const openPrArr: PullRequest[] = data.open.map((pr: any) => ({
                author: pr.author.login, // Extract the login as the author's name
                number: pr.number,
                title: pr.title,
            }));

            const closedPrArr: PullRequest[] = data.closed.map((pr: any) => ({
                author: pr.author.login, // Extract the login as the author's name
                number: pr.number,
                title: pr.title,
            }));
            setOpenPrs(openPrArr);
            setClosedPrs(closedPrArr);
            // return result;
        }
        getPrList();
    },[repo])

    return (
        <div>
            {
                openPrs.map((pr, index)=>(
                    <div>
                        <span style={{color:'#33ff33'}}>{`open [${pr.number}] ${pr.author}: `}</span>
                        <span style={{color:'white'}}>{`${pr.title}`}</span>
                    </div>
                ))
            }
            {
                closedPrs.map((pr, index)=>(
                    <div>
                        <span style={{color:'red'}}>{`closed [${pr.number}] ${pr.author}: `}</span>
                        <span style={{color:'white'}}>{`${pr.title}`}</span>
                    </div>
                ))
            }
        </div>
    );
}
