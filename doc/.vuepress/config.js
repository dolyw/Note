module.exports = {
    title: '随心',
    description: '世界上最大的谎言就是你不行',
    head: [
        ['link', { rel: 'icon', href: 'https://dolyw.com/static/favicon.ico' }],
        /* ['script', { type: 'text/javascript', src: 'https://dolyw.gitee.io/reader/JS/love.js' }], */
        ['script', { type: 'text/javascript', src: 'https://dolyw.com/static/count.js' }]
    ],
    // 打包文件夹
    dest: 'docs',
    // 端口
    port: 4000,
    markdown: {
        // 代码块显示行号
        lineNumbers: true
    },
    themeConfig: {
        // 将同时提取markdown中h1和h2标题，显示在侧边栏上
        sidebarDepth: 2,
        // 文档更新时间，每个文件git最后提交的时间
        lastUpdated: 'Last Updated',
        nav: [
            // 内部链接，以doc为根目录
            /* { text: '主页', link: '/' }, */
            {
                text: '学习记录',
                items: [
                    { text: 'Redis', link: '/redis/' },
                    { text: 'MySQL', link: '/mysql/' },
                    { text: 'Elasticsearch', link: '/elasticsearch/' }
                ]
            },
            {
                text: '开源项目',
                items: [
                    { text: 'ShiroJwt', link: '/shirojwt/' }
                ]
            },
            // 外部链接
            { text: 'Life博客', link: 'https://dolyw.com/go?url=https://blog.dolyw.com' },
            // 下拉列表
            {
                text: '联系',
                items: [
                    { text: '导航', link: 'https://dolyw.com/go?url=https://map.dolyw.com' },
                    { text: '留言', link: 'https://dolyw.com/go?url=https://msg.dolyw.com' },
                    { text: '简历', link: 'https://dolyw.com/go?url=https://cv.dolyw.com' },
                    { text: 'GitHub', link: 'https://dolyw.com/go?url=https://github.com/dolyw' }
                ]
            }
        ],
        sidebar: {
            '/mysql/': [
                ['', '目录']
            ],
            '/elasticsearch/': [
                ['', '目录'],
                ['000-GettingStarted.md', '基础入门'],
                ['001-LocalInstallation', '本地安装'],
                ['002-LocalInstallationIK.md', 'IK分词插件']
            ]
        }
    }
}