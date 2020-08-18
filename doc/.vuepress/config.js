const keyConfig = require("./config/keyConfig");
const nav = require("./nav");
const sidebar = require("./sidebar");

module.exports = {
    title: '笔记',
    description: '世界上最大的谎言就是你不行',
    head: [
        ['link', { rel: 'icon', href: 'https://cdn.jsdelivr.net/gh/wliduo/Index@master/static/favicon.ico' }],
        /* ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css' }], */
        /* ['script', { type: 'text/javascript', src: 'https://cdn.staticfile.org/jquery/2.2.3/jquery.min.js' }], */
        /* ['script', { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js' }], */
        /* ['script', { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/wliduo/Mark@master/' + 'assets/lib/love.js' }], */
        ['script', { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/wliduo/Index@master/static/count.js' }]
    ],
    // 打包文件夹
    dest: 'docs',
    // 端口
    port: 4000,
    // 插件
    plugins: [
        // 页面加载条
        require('./plugins/diy-loader'),
        // 图片点击查看 https://github.com/dongyuanxin/blog/blob/master/.vuepress/config.js
        // require('vuepress-plugin-viewer'),
        [
            '@vuepress/medium-zoom',
            {
                // selector: 'img.zoom-custom-imgs',
                // medium-zoom options here
                // See: https://github.com/francoischalifour/medium-zoom#options
                options: {
                    margin: 24,
                    // background: '#BADA55',
                    // container: '#zoom-container',
                    // template: '#zoom-template'
                    scrollOffset: 0
                }
            }
        ],
        // 点击链接平滑滚动
        ['vuepress-plugin-smooth-scroll'],
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
                    // keyConfig在有道云上传了
                    appId: keyConfig.appId,
                    appKey: keyConfig.appKey,
                    placeholder: '评论',
                    path: '<%- frontmatter.to.path %>'
                }
            }
            /* {
                choosen: 'gitalk',
                options: {
                    // keyConfig可以看QQ收藏截图
                    clientID: keyConfig.clientID,
                    clientSecret: keyConfig.clientSecret,
                    repo: "Note",
                    owner: "wliduo",
                    admin: ["wliduo", "dolyw"],
                    // 页面的唯一标识。长度必须小于50。
                    id: decodeURI("<%- frontmatter.to.path || window.location.pathname %>"),
                    // 类似Facebook评论框的全屏遮罩效果.
                    distractionFreeMode: false,
                    // GitHub issue 的标签。
                    labels: ['Gitalk'],
                    // GitHub issue 的标题。
                    title: "[Gitalk]",
                    // GitHub issue 的内容。
                    body: "<%- window.location.origin %><%- frontmatter.to.path || window.location.pathname %>"
                }
            } */
        ]
        // 添加PWA
        // https://vuepress.vuejs.org/zh/plugin/official/plugin-pwa.html
        // https://segmentfault.com/a/1190000014746656#item-6
    ],
    markdown: {
        // 代码块显示行号
        /* lineNumbers: true */
    },
    themeConfig: {
        // Github显示
        repo: 'https://github.com/dolyw',
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        docsRepo: 'dolyw/Note',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'doc',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '在 GitHub 上编辑此页',
        // 将同时提取markdown中h1和h2标题，显示在侧边栏上
        sidebarDepth: 2,
        // 文档更新时间，每个文件git最后提交的时间
        lastUpdated: '上次更新时间',
        nav: nav,
        sidebar: sidebar
    }
}