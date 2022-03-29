const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const ejs = require('ejs')
let id = 0

function createAssets(filename) {
  const content = fs.readFileSync(filename, 'utf-8')
  // 利用 @babel/parser 生成 AST 语法抽象树
  const ast = parser.parse(content, {
    // babel官方规定必须加这个参数，不然无法识别ES Module
    sourceType: 'module'
  })

  const dependencies = {}
  const mapping = {}
  // console.log('ast', ast)
  // 利用 @babel/traverse 遍历AST抽象语法树
  traverse(ast, {
    // 获取通过 import 引入的模块
    ImportDeclaration({node}) {
      const dirname = path.dirname(filename)
      const newFile = './' + path.join(dirname, node.source.value)
      //保存所依赖的模块
      dependencies[node.source.value] = newFile
    }
  })

  // 通过 @babel/core 和 @babel/preset-env 进行代码的转换
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })

  return {
    filename, // 文件名
    dependencies, // 文件所有的依赖模块集合
    code, // 转换后的代码
    id,
    mapping: mapping
  }
}

function createGraph(entry) {
  const entryModule = createAssets(entry)
  const graphArray = [entryModule]

  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i]
    // 拿到文件所依赖的模块集合(键值对存储)
    const { dependencies, mapping } = item
    // 广度优先遍历依赖
    for (j in dependencies) {
      const filePath = dependencies[j]
      id++
      mapping[j] = id
      graphArray.push(
        createAssets(filePath)
      )
    }
  }

  // 生成图谱
  const graph = {}
  graphArray.forEach(g => {
    const { code, id, mapping } = g

    graph[id] = {
      dependencies: mapping,
      code: code
    }
  })

  return graph
}

function build(graph) {
  const template = fs.readFileSync('./template.ejs', 'utf-8')
  const data = {
    graph
  }
  const code = ejs.render(template, { data })
  fs.writeFileSync('./dist/bundle.js', code)
}
const graph = createGraph('./src/index.js')

build(graph)