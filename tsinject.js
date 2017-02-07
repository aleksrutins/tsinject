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
    /**
     * "injectables": dependencies that can be injected.
     * For internal use only.
     */
    injectable: {
        $doc: {
            /**
             * @param {...string} selectors
             * @returns {Element}
             * alias for document.querySelector(...selectors)
             */
            select(...selectors) {
                return document.querySelector(selectors);
            },
            /**
             * @param {string} elType
             * Alias for document.createElement(elType)
             */
            createEl(elType) {
                return document.createElement(elType);
            },
            base: document,
            /**
             * Alias for document.body
             */
            getBody() {
                return document.body;
            },
            /**
             * Alias for 'window.onload = f;'
             */
            onReady(f) {
                window.onload = f;
            }
        }
    },
    /**
     * @param {function()} f
     * resolves the dependencies of f (a.k.a @inject <dependency> directives). All dependencies must be names of injectables.
     * Default injectables:
     *  $doc: Helper functions for the document objects. Also includes a "base" property assigned to the document.
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
    /**
     * Registers a new injectable.
     * @param {string} name
     * @param {any} value
     */
    register: function(name, value) {
        tsinject.injectable[name] = value;
    },
    /**
     * Binds a function to the context of ctx.
     */
    preparef: function(obj, ctx) {
        return obj.bind(ctx);
    },
    /**
     * Another way of commenting things out.
     */
    ignore: function(code) {}
}