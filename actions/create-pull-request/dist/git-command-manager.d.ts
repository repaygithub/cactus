export declare class GitCommandManager {
    private gitPath;
    private workingDirectory;
    private identityGitOptions?;
    private constructor();
    static create(workingDirectory: string): Promise<GitCommandManager>;
    setIdentityGitOptions(identityGitOptions: string[]): void;
    checkout(ref: string, startPoint?: string): Promise<void>;
    cherryPick(options?: string[], allowAllExitCodes?: boolean): Promise<GitOutput>;
    commit(options?: string[]): Promise<void>;
    config(configKey: string, configValue: string, globalConfig?: boolean): Promise<void>;
    configExists(configKey: string, configValue?: string, globalConfig?: boolean): Promise<boolean>;
    fetch(refSpec: string[], remoteName?: string, options?: string[]): Promise<void>;
    getConfigValue(configKey: string, configValue?: string): Promise<string>;
    getWorkingDirectory(): string;
    hasDiff(options?: string[]): Promise<boolean>;
    isDirty(untracked: boolean): Promise<boolean>;
    push(options?: string[]): Promise<void>;
    revList(commitExpression: string[], options?: string[]): Promise<string>;
    revParse(ref: string, options?: string[]): Promise<string>;
    status(options?: string[]): Promise<string>;
    symbolicRef(ref: string, options?: string[]): Promise<string>;
    tryConfigUnset(configKey: string, configValue?: string, globalConfig?: boolean): Promise<boolean>;
    tryGetRemoteUrl(): Promise<string>;
    exec(args: string[], allowAllExitCodes?: boolean): Promise<GitOutput>;
}
declare class GitOutput {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export {};
