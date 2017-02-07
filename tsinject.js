// (C) 2017 munchkinhalfling <munchkin@rutins.com>
// TSInject dependecy injection library

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}
var tsinject = {
    injectable: {
        $doc: {
            /**
             * @param {...string} selectors
             * @returns {Element}
             */
            select(...selectors) {
                return document.querySelector(selectors);
            },
            /**
             * @param {string} elType
             */
            createEl(elType) {
                return document.createElement(elType);
            },
            base: document,
            getBody() {
                return document.body;
            }
        }
    },
    /**
     * @param {function()} f
     */
    resolve: function(f) {
        let strRep = f.toString();
        let params = getParamNames(f);
        let lines = strRep.split('\n');
        lines.splice(1, 0, 'arguments[0] = arguments[0];');
        for(let line of lines) {
            let injectI = 0;
            let injectArg = '';
            if((injectI = line.indexOf('@inject')) > -1) {
                injectI = injectI + '@inject '.length;
                injectArg = line.slice(injectI);
                lines[lines.indexOf(line)] = `${injectArg} = tsinject.injectable["${injectArg}"];`;
            }
        }
        strRep = lines.join('\n');
        return eval(strRep);
    },
    register: function(name, value) {
        tsinject.injectable[name] = value;
    },
    preparef: function(obj, ctx) {
        return obj.bind(ctx);
    },
    ignore: function(code) {}
}