'use strict';

/* eslint-disable import/no-commonjs */

module.exports = {
  showChangelog: showChangelog,
  updateChangelog: updateChangelog,
  getChangelog: getChangelog
};

var colors = require('colors/safe');

var baseConvChangelog = 'conventional-changelog -p angular';

function showChangelog(shell) {
  shell.echo(colors.yellow.underline('\nNext version changelog:'));
  var changelog = shell.exec(baseConvChangelog + ' -u', { silent: true }).stdout;
  shell.echo(colors.white(changelog));
}

function updateChangelog(shell) {
  shell.echo(colors.yellow('⚠️ Updating changelog'));
  shell.exec(baseConvChangelog + ' --infile CHANGELOG.md --same-file', {
    silent: true
  });
}

function getChangelog(shell) {
  return shell.exec(baseConvChangelog, { silent: true }).stdout.trim();
}