module.exports = nav = [
    // 外部链接
    {
        text: '整站地图',
        items: [
            { text: '主页', link: '/' },
            { text: '关于', link: '/about.md' },
            { text: '导航', link: 'https://map.dolyw.com' },
            { text: '生活', link: 'https://blog.dolyw.com' },
            { text: '音乐', link: 'https://res.dolyw.com' },
            { text: '留言', link: 'https://msg.dolyw.com' },
            { text: '简历', link: 'https://cv.dolyw.com' }
        ]
    },
    // 内部链接，以doc为根目录
    /* { text: '主页', link: '/' }, { text: '关于', link: '/about.md' }, */
    {
        text: '学习笔记',
        items: [
            { text: 'Design', link: '/design/' },
            { text: 'Network', link: '/network/' },
            { text: 'Java', link: '/java/' },
            { text: 'Database', link: '/database/' },
            { text: 'Cache', link: '/cache/' },
            { text: 'Elasticsearch', link: '/elasticsearch/' },
            { text: '工具命令', link: '/command/' }
        ]
    },
    {
        text: '架构笔记',
        items: [
            { text: 'SpringBoot', link: '/springboot/' },
            { text: 'Dubbo', link: '/dubbo/' },
            { text: 'Docker', link: '/docker/' },
            { text: '消息队列', link: '/mq/' },
            { text: '文件系统', link: '/fs/' },
            { text: '分布式相关', link: '/distributed/' }
        ]
    },
    // 下拉列表
    {
        text: '零星笔记',
        items: [
            { text: '编程笔记', link: '/note/' },
            { text: '前端记录', link: '/front/' },
            { text: '书籍面试', link: '/book/' },
            { text: '其他笔记', link: '/other/' },
            { text: '编程闲话', link: '/gossip/' }
        ]
    },
    {
        text: '开源项目',
        items: [
            { text: '项目列表', link: '/p/' },
            { text: 'ProjectStudy', link: 'https://github.com/dolyw/ProjectStudy' },
            { text: 'ShiroJwt', link: '/shirojwt/' },
            { text: 'SeckillEvolution', link: '/seckill-evolution/' },
            { text: 'NettyStudy', link: '/netty/' },
            { text: 'ViewGenerator', link: '/viewgenerator/' }
        ]
    }
]