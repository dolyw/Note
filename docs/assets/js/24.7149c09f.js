(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{307:function(t,n,s){"use strict";s.r(n);var a=s(0),e=Object(a.a)({},(function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"单例模式-singleton-pattern"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#单例模式-singleton-pattern"}},[t._v("#")]),t._v(" 单例模式(Singleton Pattern)")]),t._v(" "),s("blockquote",[s("p",[t._v("目录: "),s("a",{attrs:{href:"https://note.dolyw.com/design/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://note.dolyw.com/design/"),s("OutboundLink")],1)])]),t._v(" "),s("p",[s("strong",[t._v("代码地址")])]),t._v(" "),s("ul",[s("li",[t._v("Github："),s("a",{attrs:{href:"https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/singleton",target:"_blank",rel:"noopener noreferrer"}},[t._v("DesignPattern/src/main/java/com/design/singleton"),s("OutboundLink")],1)]),t._v(" "),s("li",[t._v("Gitee(码云)："),s("a",{attrs:{href:"https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/singleton",target:"_blank",rel:"noopener noreferrer"}},[t._v("DesignPattern/src/main/java/com/design/singleton"),s("OutboundLink")],1)])]),t._v(" "),s("h2",{attrs:{id:"_1-介绍"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-介绍"}},[t._v("#")]),t._v(" 1. 介绍")]),t._v(" "),s("p",[s("strong",[t._v("单例模式")]),t._v("是 Java 中最简单的设计模式之一。这种类型的设计模式属于"),s("strong",[t._v("创建型模式")]),t._v("，它提供了一种创建对象的最佳方式，这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建")]),t._v(" "),s("p",[t._v("这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象")]),t._v(" "),s("h3",{attrs:{id:"_1-1-特点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-特点"}},[t._v("#")]),t._v(" 1.1. 特点")]),t._v(" "),s("ul",[s("li",[t._v("单例类只有一个实例对象")]),t._v(" "),s("li",[t._v("该单例对象必须由单例类自行创建")]),t._v(" "),s("li",[t._v("单例类对外提供一个访问该单例的全局访问点")])]),t._v(" "),s("h3",{attrs:{id:"_1-2-结构"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-结构"}},[t._v("#")]),t._v(" 1.2. 结构")]),t._v(" "),s("ul",[s("li",[t._v("单例类：包含一个实例且能自行创建这个实例的类")]),t._v(" "),s("li",[t._v("访问类：使用单例的类")])]),t._v(" "),s("h3",{attrs:{id:"_1-3-优缺点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-优缺点"}},[t._v("#")]),t._v(" 1.3. 优缺点")]),t._v(" "),s("ul",[s("li",[t._v("意图：保证一个类仅有一个实例，并提供一个访问它的全局访问点")]),t._v(" "),s("li",[t._v("主要解决：一个全局使用的类频繁地创建与销毁")]),t._v(" "),s("li",[t._v("何时使用：当您想控制实例数目，节省系统资源的时候")]),t._v(" "),s("li",[t._v("如何解决：判断系统是否已经有这个单例，如果有则返回，如果没有则创建")]),t._v(" "),s("li",[t._v("关键代码：构造函数是私有的")])]),t._v(" "),s("ul",[s("li",[t._v("优点\n"),s("ul",[s("li",[t._v("在内存里只有一个实例，减少了内存的开销，尤其是频繁的创建和销毁实例")]),t._v(" "),s("li",[t._v("避免对资源的多重占用")])])]),t._v(" "),s("li",[t._v("缺点\n"),s("ul",[s("li",[t._v("没有接口，不能继承，与单一职责原则冲突")]),t._v(" "),s("li",[t._v("一个类应该只关心内部逻辑，而不关心外面怎么样来实例化")])])])]),t._v(" "),s("h3",{attrs:{id:"_1-4-举例"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-举例"}},[t._v("#")]),t._v(" 1.4. 举例")]),t._v(" "),s("p",[t._v("例如 Windows 中只能打开一个任务管理器，这样可以避免因打开多个任务管理器窗口而造成内存资源的浪费，或出现各个窗口显示内容的不一致等错误")]),t._v(" "),s("p",[t._v("在计算机系统中，还有 Windows 的回收站、操作系统中的文件系统、多线程中的线程池、显卡的驱动程序对象、打印机的后台处理服务、应用程序的日志对象、数据库的连接池、网站的计数器、Web 应用的配置对象、应用程序中的对话框、系统中的缓存等常常被设计成单例")]),t._v(" "),s("h2",{attrs:{id:"_2-代码"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-代码"}},[t._v("#")]),t._v(" 2. 代码")]),t._v(" "),s("p",[t._v("一共五种实现方式，都是按线程安全来实现")]),t._v(" "),s("ol",[s("li",[t._v("饿汉式")]),t._v(" "),s("li",[t._v("懒汉式")]),t._v(" "),s("li",[t._v("双检锁/双重校验锁(DCL，即 double-checked locking)")]),t._v(" "),s("li",[t._v("登记式/静态内部类")]),t._v(" "),s("li",[t._v("枚举")])]),t._v(" "),s("h3",{attrs:{id:"_2-1-饿汉式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-饿汉式"}},[t._v("#")]),t._v(" 2.1. 饿汉式")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * 单例-饿汉式\n *\n * 优点：没有加锁，执行效率会提高\n * 缺点：类加载时就初始化，浪费内存\n *\n * 一般有这个类肯定会用到，所以浪费内存还是比较少见的\n *\n * 它基于ClassLoader机制避免了多线程的同步问题，不过INSTANCE在类装载时就实例化，\n * 虽然导致类装载的原因有很多种，在单例模式中大多数都是调用getInstance()方法，\n * 但是也不能确定有其他的方式（或者其他的静态方法）导致类装载，\n * 这时候初始化INSTANCE显然没有达到Lazy Loading的效果，所以就衍生出了懒汉式\n *\n * @author wliduo[i@dolyw.com]\n * @date 2020/5/26 10:26\n */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HungrySingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例-INSTANCE\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HungrySingleton")]),t._v(" INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HungrySingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*private static final HungrySingleton INSTANCE;\n\n    static {\n        INSTANCE = new HungrySingleton();\n    }*/")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 私有构造，不能直接New\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HungrySingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例获取静态方法\n     *\n     * @param\n     * @return com.design.singleton.HungrySingleton\n     * @throws\n     * @author wliduo[i@dolyw.com]\n     * @date 2020/5/26 10:50\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HungrySingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInstance")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"_2-2-懒汉式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-懒汉式"}},[t._v("#")]),t._v(" 2.2. 懒汉式")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * 单例-懒汉式\n *\n * 优点：第一次调用才初始化，避免内存浪费\n * 缺点：必须加锁synchronized才能保证单例，但加锁会影响效率\n *\n * getInstance()的性能对应用程序不是很关键（该方法使用不太频繁）\n * 但是每次访问时都要同步，会影响性能，且消耗更多的资源，这是懒汉式单例的缺点，\n * 所以衍生出了 双检锁/双重校验锁(DCL，即 Double-Checked Locking) 的方式\n *\n * @author wliduo[i@dolyw.com]\n * @date 2020/5/26 10:26\n */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LazySingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例-INSTANCE\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*volatile*/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LazySingleton")]),t._v(" INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 私有构造，不能直接New\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LazySingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例获取静态方法\n     *\n     * @param\n     * @return com.design.singleton.LazySingleton\n     * @throws\n     * @author wliduo[i@dolyw.com]\n     * @date 2020/5/26 10:50\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LazySingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInstance")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LazySingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"_2-3-双检锁-双重校验锁"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-双检锁-双重校验锁"}},[t._v("#")]),t._v(" 2.3. 双检锁/双重校验锁")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * 单例-双检锁/双重校验锁(DCL，即 Double-Checked Locking)\n *\n * 优点：第一次调用才初始化，避免内存浪费\n *\n * 这种方式采用双锁机制，安全且在多线程情况下能保持高性能\n * getInstance()的性能对应用程序很关键\n *\n * @author wliduo[i@dolyw.com]\n * @date 2020/5/26 10:26\n */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("DclSingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例-INSTANCE-加volatile\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("volatile")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("DclSingleton")]),t._v(" INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 私有构造，不能直接New\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("DclSingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例获取静态方法\n     *\n     * @param\n     * @return com.design.singleton.DclSingleton\n     * @throws\n     * @author wliduo[i@dolyw.com]\n     * @date 2020/5/26 10:50\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("DclSingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInstance")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("DclSingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                    INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("DclSingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"_2-4-登记式-静态内部类"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-登记式-静态内部类"}},[t._v("#")]),t._v(" 2.4. 登记式/静态内部类")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * 单例-登记式/静态内部类\n *\n * 优点：第一次调用才初始化，避免内存浪费\n *\n * 这种方式能达到双检锁方式一样的功效，但实现更简单。\n * 对静态域使用延迟初始化，应使用这种方式而不是双检锁方式。\n * 这种方式只适用于静态域的情况，双检锁方式可在实例域需要延迟初始化时使用。\n *\n * 这种方式同样利用了ClassLoader机制来保证初始化INSTANCE时只有一个线程，\n * 这种方式的好处是InnerSingleton类被装载了，INSTANCE不一定被初始化。\n * 因为SingletonHolder类没有被主动使用，只有通过显式调用getInstance方法时，\n * 才会显式装载SingletonHolder类，从而实例化INSTANCE。\n *\n * @author wliduo[i@dolyw.com]\n * @date 2020/5/26 11:30\n */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InnerSingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 私有构造，不能直接New\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InnerSingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 静态内部类\n     *\n     * @author wliduo[i@dolyw.com]\n     * @date 2020/5/26 11:33\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SingletonHolder")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n         * 单例-INSTANCE\n         */")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InnerSingleton")]),t._v(" INSTANCE "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InnerSingleton")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例获取静态方法\n     *\n     * @param\n     * @return com.design.singleton.InnerSingleton\n     * @throws\n     * @author wliduo[i@dolyw.com]\n     * @date 2020/5/26 10:50\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InnerSingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInstance")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SingletonHolder")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"_2-5-枚举"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-5-枚举"}},[t._v("#")]),t._v(" 2.5. 枚举")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * 单例-枚举\n *\n * 这种实现方式还没有被广泛采用，但这是实现单例模式的最佳方法。\n * 它更简洁，自动支持序列化机制，绝对防止多次实例化。\n * 这种方式是 Effective Java 作者 Josh Bloch 提倡的方式，\n * 它不仅能避免多线程同步问题，而且还自动支持序列化机制，\n * 防止反序列化重新创建新的对象，绝对防止多次实例化\n *\n * 不过，由于 JDK1.5 之后才加入 enum 特性，\n * 用这种方式写不免让人感觉生疏，在实际工作中，也很少用。\n * 也不能通过 reflection attack 来调用私有构造方法\n *\n * @author wliduo[i@dolyw.com]\n * @date 2020/5/26 11:38\n */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("enum")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EnumSingleton")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 单例-INSTANCE\n     */")]),t._v("\n    INSTANCE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * 方法\n     *\n     * @author wliduo[i@dolyw.com]\n     * @date 2020/5/26 11:40\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("whateverMethod")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])])}),[],!1,null,null,null);n.default=e.exports}}]);