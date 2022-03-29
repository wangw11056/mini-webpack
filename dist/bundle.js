(function(graph) {
  // 实现 require 方法
  function require(moduleId) {
    // 装饰 require
    function localRequire(relativePath) {
      return require(graph[moduleId].dependencies[relativePath]);
    }

    const module = {
      exports: {}
    };
    ;(function(require, exports, code) {
      eval(code)
    })(localRequire, module.exports, graph[moduleId].code);
    return module.exports
  }
  require(0)
})({"0":{"dependencies":{"./message.js":1},"code":"\"use strict\";\n\nvar _message = _interopRequireDefault(require(\"./message.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_message[\"default\"]);"},"1":{"dependencies":{"./word.js":2,"./foo.js":3},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _word = require(\"./word.js\");\n\nvar _foo = _interopRequireDefault(require(\"./foo.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar message = \"say \".concat(_word.word);\n(0, _foo[\"default\"])();\nvar _default = message;\nexports[\"default\"] = _default;"},"2":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.word = exports.hello = void 0;\nvar word = 'hello';\nexports.word = word;\nvar hello = 'hahahaha';\nexports.hello = hello;"},"3":{"dependencies":{},"code":"\"use strict\";\n\nmodule.exports = function () {\n  console.log('foo');\n};"}})