import React, {useState} from 'react';

export interface Repo {
    name: string,
    url: string,
    updated?: Date,
    visibility: string
}

interface RepoCardProps {
    repo: Repo
}

export const RepoCard: React.FC<RepoCardProps> = ({repo}) => {
    return (
        <div>
            <span>{repo.name}</span><br/>
            <span>{repo.visibility}</span><br/>
            {/* <span>{repo.updated.toString()}</span><br/> */}
            <span>{repo.url}</span><br/>
        </div>
    );
}