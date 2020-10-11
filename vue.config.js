module.exports = {
    lintOnSave: false,
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }
    },
    // 修改项目处于不同编译模式下的配置
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            // 修改入口文件
            config.entry('app').clear().add('./src/main-prod.js');
            // 用cdn优化打包
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            });
            // 为html插件新增isProd属性
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            // 修改入口文件
            config.entry('app').clear().add('./src/main-dev.js');
            // 为html插件新增isProd属性
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            });
        })
    }
}