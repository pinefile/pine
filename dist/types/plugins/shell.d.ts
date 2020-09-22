/// <reference types="node" />
declare type ShellOptionsType = {
    cwd: string;
    outputStream: NodeJS.WriteStream;
};
export declare const shell: (cmd: string, opts?: ShellOptionsType | undefined) => Promise<unknown>;
export {};
