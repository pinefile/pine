'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var minimist = function (args, opts) {
    if (!opts) opts = {};
    
    var flags = { bools : {}, strings : {}, unknownFn: null };

    if (typeof opts['unknown'] === 'function') {
        flags.unknownFn = opts['unknown'];
    }

    if (typeof opts['boolean'] === 'boolean' && opts['boolean']) {
      flags.allBools = true;
    } else {
      [].concat(opts['boolean']).filter(Boolean).forEach(function (key) {
          flags.bools[key] = true;
      });
    }
    
    var aliases = {};
    Object.keys(opts.alias || {}).forEach(function (key) {
        aliases[key] = [].concat(opts.alias[key]);
        aliases[key].forEach(function (x) {
            aliases[x] = [key].concat(aliases[key].filter(function (y) {
                return x !== y;
            }));
        });
    });

    [].concat(opts.string).filter(Boolean).forEach(function (key) {
        flags.strings[key] = true;
        if (aliases[key]) {
            flags.strings[aliases[key]] = true;
        }
     });

    var defaults = opts['default'] || {};
    
    var argv = { _ : [] };
    Object.keys(flags.bools).forEach(function (key) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    
    var notFlags = [];

    if (args.indexOf('--') !== -1) {
        notFlags = args.slice(args.indexOf('--')+1);
        args = args.slice(0, args.indexOf('--'));
    }

    function argDefined(key, arg) {
        return (flags.allBools && /^--[^=]+$/.test(arg)) ||
            flags.strings[key] || flags.bools[key] || aliases[key];
    }

    function setArg (key, val, arg) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg) === false) return;
        }

        var value = !flags.strings[key] && isNumber(val)
            ? Number(val) : val
        ;
        setKey(argv, key.split('.'), value);
        
        (aliases[key] || []).forEach(function (x) {
            setKey(argv, x.split('.'), value);
        });
    }

    function setKey (obj, keys, value) {
        var o = obj;
        for (var i = 0; i < keys.length-1; i++) {
            var key = keys[i];
            if (key === '__proto__') return;
            if (o[key] === undefined) o[key] = {};
            if (o[key] === Object.prototype || o[key] === Number.prototype
                || o[key] === String.prototype) o[key] = {};
            if (o[key] === Array.prototype) o[key] = [];
            o = o[key];
        }

        var key = keys[keys.length - 1];
        if (key === '__proto__') return;
        if (o === Object.prototype || o === Number.prototype
            || o === String.prototype) o = {};
        if (o === Array.prototype) o = [];
        if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
            o[key] = value;
        }
        else if (Array.isArray(o[key])) {
            o[key].push(value);
        }
        else {
            o[key] = [ o[key], value ];
        }
    }
    
    function aliasIsBoolean(key) {
      return aliases[key].some(function (x) {
          return flags.bools[x];
      });
    }

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        
        if (/^--.+=/.test(arg)) {
            // Using [\s\S] instead of . because js doesn't support the
            // 'dotall' regex modifier. See:
            // http://stackoverflow.com/a/1068308/13216
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            var key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
                value = value !== 'false';
            }
            setArg(key, value, arg);
        }
        else if (/^--no-.+/.test(arg)) {
            var key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false, arg);
        }
        else if (/^--.+/.test(arg)) {
            var key = arg.match(/^--(.+)/)[1];
            var next = args[i + 1];
            if (next !== undefined && !/^-/.test(next)
            && !flags.bools[key]
            && !flags.allBools
            && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            }
            else if (/^(true|false)$/.test(next)) {
                setArg(key, next === 'true', arg);
                i++;
            }
            else {
                setArg(key, flags.strings[key] ? '' : true, arg);
            }
        }
        else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1,-1).split('');
            
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
                var next = arg.slice(j+2);
                
                if (next === '-') {
                    setArg(letters[j], next, arg);
                    continue;
                }
                
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split('=')[1], arg);
                    broken = true;
                    break;
                }
                
                if (/[A-Za-z]/.test(letters[j])
                && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                
                if (letters[j+1] && letters[j+1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j+2), arg);
                    broken = true;
                    break;
                }
                else {
                    setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
                }
            }
            
            var key = arg.slice(-1)[0];
            if (!broken && key !== '-') {
                if (args[i+1] && !/^(-|--)[^-]/.test(args[i+1])
                && !flags.bools[key]
                && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i+1], arg);
                    i++;
                }
                else if (args[i+1] && /^(true|false)$/.test(args[i+1])) {
                    setArg(key, args[i+1] === 'true', arg);
                    i++;
                }
                else {
                    setArg(key, flags.strings[key] ? '' : true, arg);
                }
            }
        }
        else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(
                    flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
                );
            }
            if (opts.stopEarly) {
                argv._.push.apply(argv._, args.slice(i + 1));
                break;
            }
        }
    }
    
    Object.keys(defaults).forEach(function (key) {
        if (!hasKey(argv, key.split('.'))) {
            setKey(argv, key.split('.'), defaults[key]);
            
            (aliases[key] || []).forEach(function (x) {
                setKey(argv, x.split('.'), defaults[key]);
            });
        }
    });
    
    if (opts['--']) {
        argv['--'] = new Array();
        notFlags.forEach(function(key) {
            argv['--'].push(key);
        });
    }
    else {
        notFlags.forEach(function(key) {
            argv._.push(key);
        });
    }

    return argv;
};

function hasKey (obj, keys) {
    var o = obj;
    keys.slice(0,-1).forEach(function (key) {
        o = (o[key] || {});
    });

    var key = keys[keys.length - 1];
    return key in o;
}

function isNumber (x) {
    if (typeof x === 'number') return true;
    if (/^0x[0-9a-f]+$/i.test(x)) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

var parseArgv = function parseArgv(argv) {
  var obj = minimist(argv);

  obj.get = function (key) {
    if (this[key]) {
      return this[key];
    }

    if (this._[key]) {
      return this._[key];
    }
  };

  return obj;
};

var flattenArray = function flattenArray(a) {
  return a.reduce(function (acc, value) {
    return acc.concat(value);
  }, []);
};

var PINE_FILE_ORDER = Object.freeze(['Pinefile', 'pinefile.js']);
var isFile = function isFile(filePath) {
  return fs__default['default'].existsSync(filePath) && !fs__default['default'].lstatSync(filePath).isDirectory();
};
var findFile = function findFile() {
  var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (file.startsWith('/') && isFile(file)) {
    return file;
  }

  return resolveFilePathByTraversing(path__default['default'].resolve('.'), process.cwd(), file);
};

var resolveFilePathByTraversing = function resolveFilePathByTraversing(pathToResolve, cwd) {
  var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var customFile = path__default['default'].resolve(pathToResolve, file);

  if (file && isFile(customFile)) {
    return customFile;
  }

  var pineFile = PINE_FILE_ORDER.map(function (file) {
    return path__default['default'].resolve(pathToResolve, file);
  }).find(isFile);

  if (pineFile) {
    return pineFile;
  } // system root


  if (pathToResolve === path__default['default'].dirname(pathToResolve)) {
    throw new Error('Could not find any pinefile.');
  } // go up a level and try it again


  return resolveFilePathByTraversing(path__default['default'].dirname(pathToResolve), cwd);
};

var help = function help() {
  console.log("Usage: pine <task>\n\nOptions:\n  --help  Show help\n  --file  Path to Pinefile");
};

function pkg() {
  return readJSON('package.json');
}
function readJSON(file) {
  return require(findFile(file));
}
function writeJSON(file, content) {
  if (!file.startsWith('/') && isFile(file)) {
    file = path__default['default'].join(process.cwd(), file);
  }

  var data = JSON.stringify(content, null, 2);
  fs__default['default'].writeFileSync(file, data);
  return true;
}

var shell = function shell(cmd, opts) {
  var cwd = (opts === null || opts === void 0 ? void 0 : opts.cwd) || process.cwd();
  var outputStream = opts === null || opts === void 0 ? void 0 : opts.outputStream;
  return new Promise(function (resolve, reject) {
    var stdout = '';
    var stderr = ''; // @ts-ignore

    process.env.FORCE_COLOR = true;
    var sp = child_process.spawn(cmd, [], {
      cwd: cwd,
      shell: true,
      env: process.env
    });

    if (outputStream) {
      // @ts-ignore
      sp.stdout.pipe(outputStream); // @ts-ignore

      sp.stderr.pipe(outputStream);
    } // @ts-ignore


    sp.stdout.on('data', function (data) {
      if (!outputStream) {
        stdout += data;
      }
    }); // @ts-ignore

    sp.stderr.on('data', function (data) {
      if (!outputStream) {
        stdout += data;
      }

      stderr += data;
    });
    sp.on('error', function (err) {
      reject(err);
    });
    sp.on('close', function (code) {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim()));
      }
    });
  });
};

var _before = {};
var _after = {};
var _file = '';
var _module = {};
/**
 * Load custom package.json config.
 *
 * @param {object} pkg
 */

var loadPkgConf = function loadPkgConf(pkg) {
  if (!pkg) return;
  var pine = _typeof(pkg.pine) === 'object' && !Array.isArray(pkg.pine) ? pkg.pine : {};
  var req = (Array.isArray(pine.require) ? pine.require : [pine.require]).filter(function (r) {
    return r;
  });
  req.map(function (r) {
    return require(findFile(r));
  });
};
/**
 * Register task that should be runned before a task.
 *
 * Example
 *   before('build', 'compile', 'write')
 *   before('build', ['compile', 'write'])
 */


var before = function before() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var before = args[0];
  var after = Array.prototype.slice.call(args, 1);

  if (!_before[before]) {
    _before[before] = [];
  }

  _before[before] = _before[before].concat(flattenArray(after));
  _before[before] = _toConsumableArray(new Set(_before[before]));
};
/**
 * Register task that should be runned after a task.
 *
 * Example
 *   after('build', 'publish', 'log')
 *   after('build', ['publish', 'log'])
 */

var after = function after() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var after = args[0];
  var before = Array.prototype.slice.call(args, 1);

  if (!_after[after]) {
    _after[after] = [];
  }

  _after[after] = _after[after].concat(flattenArray(before));
  _after[after] = _toConsumableArray(new Set(_after[after]));
};
/**
 * Execute task.
 *
 * @param {string} name
 * @param {object} args
 */

var execute = function execute(name, args) {
  if (_before[name]) {
    _before[name].forEach(function (name) {
      return execute(name, args);
    });
  }

  if (_module[name]) {
    _module[name](args);
  }

  if (_after[name]) {
    _after[name].forEach(function (name) {
      return execute(name, args);
    });
  }
};
/**
 * Run tasks or show help.
 *
 * @param {array} argv
 */


var run = function run(argv) {
  var args = parseArgv(argv);

  var name = args._.shift();

  if (args.help) {
    help();
    return;
  }

  if (!_file) {
    _file = findFile(args.file);
  }

  try {
    // eslint-disable-next-line
    var pkg = require(findFile('package.json'));

    loadPkgConf(pkg);
  } catch (err) {
    console.log(err);
  }

  try {
    // eslint-disable-next-line
    _module = require(_file);
  } catch (err) {
    console.error(err);
    return;
  }

  if (!_module) {
    console.error('Pinefile not found');
    return;
  }

  if (!name) {
    console.error('No task provided');
    return;
  }

  if (!_module[name]) {
    console.error("Task ".concat(name, " not found"));
    return;
  }

  execute(name, args);
};

exports.after = after;
exports.before = before;
exports.pkg = pkg;
exports.readJSON = readJSON;
exports.run = run;
exports.shell = shell;
exports.writeJSON = writeJSON;
