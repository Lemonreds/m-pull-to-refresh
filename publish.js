const shelljs = require('shelljs');

shelljs.exec('npm run build');
shelljs.exec('rm -rf ../Lemonreds.github.io/demo/m-pull-to-refresh');
shelljs.exec('mkdir ../Lemonreds.github.io/demo/m-pull-to-refresh');
shelljs.exec('cp -r ./build ../Lemonreds.github.io/demo/m-pull-to-refresh');

shelljs.cd('../Lemonreds.github.io');
shelljs.exec('git add .');
shelljs.exec(`git commit -m "${new Date().toUTCString()}"`);
shelljs.exec('git push origin master');
