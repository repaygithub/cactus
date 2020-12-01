import { Inputs } from './create-pull-request';
export declare class GitHubHelper {
    private octokit;
    constructor(token: string);
    private parseRepository;
    private createOrUpdate;
    getRepositoryParent(headRepository: string): Promise<string>;
    createOrUpdatePullRequest(inputs: Inputs, baseRepository: string, headRepository: string): Promise<void>;
}
