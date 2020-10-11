// 这是项目发布阶段要用到的 babel 插件

module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 发布产品时候用的插件
        "@babel/plugin-syntax-dynamic-import"
    ]
}