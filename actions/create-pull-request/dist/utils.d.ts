import * as core from '@actions/core';
export declare function getInputAsArray(name: string, options?: core.InputOptions): string[];
export declare function getStringAsArray(str: string): string[];
export declare function getRepoPath(relativePath?: string): string;
interface RemoteDetail {
    protocol: string;
    repository: string;
}
export declare function getRemoteDetail(remoteUrl: string): RemoteDetail;
export declare function getRemoteUrl(protocol: string, repository: string): string;
export declare function secondsSinceEpoch(): number;
export declare function randomString(): string;
interface DisplayNameEmail {
    name: string;
    email: string;
}
export declare function parseDisplayNameEmail(displayNameEmail: string): DisplayNameEmail;
export declare function fileExistsSync(path: string): boolean;
export {};
