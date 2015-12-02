#!/usr/bin/env node

var shell = require('shelljs');
var program = require('commander');
var path = require('path');
var pkg = require('./package.json');
 
program
    .version(pkg.version)
    .option('-u, --update', 'update the last number of current version')
    .option('--newver [value]', 'set the version as your want')
    .option('-d, --daily', 'is publish to daily')
    .parse(process.argv);

var currentProjectPackagePath = path.resolve(process.cwd(), 'package.json');

var currentProjectPackage = require(currentProjectPackagePath);
console.log('current version is', currentProjectPackage.version);
if (program.update) {
    currentProjectPackage.version = String(currentProjectPackage.version).replace(/\.(\d+)$/, function ($, $1) {
        return '.' + (Number($1) + 1);
    });
} else if (program.newver) {
    currentProjectPackage.version = program.newver;
}
console.log('will update to', currentProjectPackage.version);

require('fs').writeFileSync(currentProjectPackagePath, JSON.stringify(currentProjectPackage, null, 4));

var cmd = [
    'cd ' + process.cwd(),
    'git add package.json',
    'git commit "auto commit by gpub"',
    'git push origin master'
];

if (program.daily) {
    cmd.push('git push origin master:daily/' + currentProjectPackage.version);
} else {
    cmd.push('git tag publish/' + currentProjectPackage.version);
    cmd.push('git push origin publish/' + currentProjectPackage.version);
}

console.log(cmd);
// shell.exec(cmd.join(' && '));