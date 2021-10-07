import { execSync } from 'child_process';

export const npm = (c: any) => {
  const p = execSync(`npm ${c}`, {
    cwd: __dirname + '/..',
  });
  console.log(p.toString());
};
