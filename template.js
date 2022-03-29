(function(graph) {
  // 实现 require 方法
  function require(module) {
    // 装饰 require
    function localRequire(relativePath) {
      return require(graph[module].dependencies[relativePath]);
    }

    const module = {
      exports: {}
    };
    ;(function(require, exports, code) {
      eval(code)
    })(localRequire, module.export, graph[module].code);
    return exports
  }
  require('./src/index.js')
})()