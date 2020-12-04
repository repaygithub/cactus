export interface Inputs {
    token: string;
    path: string;
    commitMessage: string;
    committer: string;
    author: string;
    signoff: boolean;
    branch: string;
    deleteBranch: boolean;
    branchSuffix: string;
    base: string;
    pushToFork: string;
    title: string;
    body: string;
    labels: string[];
    assignees: string[];
    reviewers: string[];
    teamReviewers: string[];
    milestone: number;
    draft: boolean;
}
export declare function createPullRequest(inputs: Inputs): Promise<void>;
