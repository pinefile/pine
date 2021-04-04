declare type RunDockerOptionsType = {
    args?: string;
    image: string;
    versions: Array<string>;
    cmd: string;
};
export declare const run: (cmd: string, opts: RunDockerOptionsType) => Promise<void>;
export {};
