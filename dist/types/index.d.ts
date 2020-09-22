/**
 * Register task that should be runned before a task.
 *
 * Example
 *   before('build', 'compile', 'write')
 *   before('build', ['compile', 'write'])
 */
export declare const before: (...args: any[]) => void;
/**
 * Register task that should be runned after a task.
 *
 * Example
 *   after('build', 'publish', 'log')
 *   after('build', ['publish', 'log'])
 */
export declare const after: (...args: any[]) => void;
/**
 * Run tasks or show help.
 *
 * @param {array} argv
 */
export declare const run: (argv: Array<any>) => void;
export * from './plugins/file';
export * from './plugins/shell';
