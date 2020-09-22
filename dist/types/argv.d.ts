declare type Argv = {
    [key: string]: any;
    get(key: string | number): any;
};
export declare const parseArgv: (argv: Array<any>) => Argv;
export {};
