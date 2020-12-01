import { GitCommandManager } from './git-command-manager';
export declare class GitAuthHelper {
    private git;
    private gitConfigPath;
    private extraheaderConfigKey;
    private extraheaderConfigPlaceholderValue;
    private extraheaderConfigValueRegex;
    private persistedExtraheaderConfigValue;
    constructor(git: GitCommandManager);
    savePersistedAuth(): Promise<void>;
    restorePersistedAuth(): Promise<void>;
    configureToken(token: string): Promise<void>;
    removeAuth(): Promise<void>;
    private setExtraheaderConfig;
    private getAndUnset;
    private gitConfigStringReplace;
    private getServerUrl;
}
