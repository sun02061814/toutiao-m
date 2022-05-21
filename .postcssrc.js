module.exports = {
    plugins: {
        // 配置使用 autoprefixer 插件,vue-cli默认配置了此项
        // 作用：生成浏览器 CSS 样式规则前缀

        // 'autoprefixer': { // autoprefixer 插件的配置
        //     // 配置要兼容到的环境信息
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },

        // 作用：把px转为rem
        'postcss-pxtorem': {
            // rootValue设置rem的基准值，有两种方式
            // 1.rootValue:数字
            // 2.rootValue({file}){} 动态处理返回
            // {file}对象解构-{file:xxx} flie会返回被postcss-pxtorem处理的文件完整路径
            // postcss-pxtorem处理每个css文件的时候都会来调用这个函数，它会把被处理的css文件相关信息通过参数传递给该函数
            rootValue({file}){
                // 如果vant的索引不等于-1，说明包含vant字眼，就是vant的样式，返回37.5
                return file.indexOf('vant')!==-1 ? 37.5 : 75
            },
            // propList配置要转换的css属性
            // *表示所有
            propList: ['*'],

            // 配置不做rem单位转换的资源文件名
            exclude:'github-makedown-css'
        }
    }
}