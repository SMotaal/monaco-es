import fs from 'fs';
import path from 'path';
import subprocess from 'child_process';

/// Builtin
const { log, warn } = console;
const {isArray} = Array;

/// Sources

const Tail = / *$/;

export const tail = string => Tail.exec(string)[0];

export const reindent = (string, shift = -tail(string).length) =>
  string && shift && shift < Infinity
    ? shift > 0
      ? string.replace(/^/gm, ' '.repeat(shift))
      : string.replace(new RegExp(`^ {0,${0 - shift}}`, 'gm'), '')
    : string;

export const canonicals = pathname =>
  /^(?:(\w{2,}:)\/{2}|)(?:(.*(?=\/))\/|)([^\/].*)$/.exec(pathname);

export const canonical = pathname =>
  pathname.replace(/.*?[/](?:node_modules[/]|(?=src))/, '…');


///  Files

export const cleanFiles = (dirname, ...segments) => {
  const deleted = [];
  let filenames, trashes;
  let exclusions = segments[segments.length - 1];
  isArray(exclusions) ? segments.pop : exclusions = [];

  try {
    if (segments.length) dirname = path.resolve(dirname, ...segments);

    if (!fs.existsSync(dirname))
      return deleted;
    else if (!fs.statSync(dirname).isDirectory())
      return (
        warn(`Could not clean %s because it is not a directory`, dirname) ||
        deleted
      );

    trashes = path.resolve(dirname, 'trash');
    filenames = new Set(fs.readdirSync(dirname));

    if (filenames.delete('trash'))
      subprocess.execSync(`npx trash-cli ${trashes}`);

    for (const exclusion of exclusions)
      filenames.delete(exclusion);

    if (!filenames.size) return deleted;

    fs.mkdirSync(trashes);
  } catch (exception) {
    return warn(`Could not clean %s:`, dirname, exception.message) || deleted;
  }

  for (const filename of filenames) {
    const source = path.resolve(dirname, filename);
    const target = path.resolve(trashes, filename);
    try {
      !fs.existsSync(target) || fs.unlinkSync(target);
      fs.renameSync(source, target);
      deleted.push(filename);
    } catch (exception) {
      warn(`Could not delete %s:`, source, exception.message);
    }
  }

  if (deleted.length) log(`Cleaned %d files from %s`, deleted.length, dirname);

  return deleted;
};
