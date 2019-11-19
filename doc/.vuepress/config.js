const keyConfig = require("./config/keyConfig");
const themeConfig = require("./config/themeConfig");

module.exports = {
    title: '笔记',
    description: '世界上最大的谎言就是你不行',
    head: [
        ['link', { rel: 'icon', href: 'https://cdn.jsdelivr.net/gh/wliduo/Index@master/static/favicon.ico' }],
        /* ['script', { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/wliduo/Mark@master/' + 'assets/lib/love.js' }], */
        ['script', { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/wliduo/Index@master/static/count.js' }]
    ],
    // 打包文件夹
    dest: 'docs',
    // 端口
    port: 4000,
    // 插件
    plugins: [
        require('./plugins/diy-loader'),
        require('vuepress-plugin-viewer'),
        ['@vuepress/back-to-top'],
        ['@vuepress/active-header-links'],
        [
            '@vuepress/last-updated',
            {
                // 上次更新时间格式化
                transformer: (timestamp, lang) => {
                    // 不要忘了安装moment
                    const moment = require('moment')
                    moment.locale(lang)
                    // return moment(timestamp).fromNow()
                    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
                }
            }
        ],
        [
            'vuepress-plugin-comment',
            {
                choosen: 'valine',
                // options选项中的所有参数，会传给Valine的配置
                options: {
                    el: '#valine-vuepress-comment',
                    // keyConfig可以看QQ收藏截图
                    appId: keyConfig.appId,
                    appKey: keyConfig.appKey,
                    placeholder: '评论',
                    path: '<%- frontmatter.to.path %>'
                }
            }
        ]
    ],
    markdown: {
        // 代码块显示行号
        /* lineNumbers: true */
    },
    themeConfig: themeConfig
}