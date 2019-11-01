# 在Windows下安装与使用Jekyll

简单的介绍在Windows系统下如何安装Ruby和Jekyll，以及怎么样使用Jekyll简单的进行创建和运行Blog项目

## 安装

### 安装`Ruby`
下载网站：[https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/)，这里要注意，安装有配套`DevKit`的版本，如`Ruby+Devkit 2.4.4-2(x64)`  
安装路径`D:\Tools`，过程简单的`I accept`，`Next`，`Finish`即可  
打开`CMD`，输入如下命令查看`Ruby`版本，查看是否安装成功
```ruby
ruby -v
```
显示
```
ruby 2.4.4p296 (2018-03-28 revision 63013) [x64-mingw32]
```
### 安装`Jekyll`和`Bundler`
```
gem install jekyll bundler
```
显示太多不全贴出来，最后显示如下
```
Installing ri documentation for listen-3.1.5
Parsing documentation for jekyll-watch-2.0.0
Installing ri documentation for jekyll-watch-2.0.0
Parsing documentation for kramdown-1.17.0
Installing ri documentation for kramdown-1.17.0
Parsing documentation for liquid-4.0.0
Installing ri documentation for liquid-4.0.0
Parsing documentation for mercenary-0.3.6
Installing ri documentation for mercenary-0.3.6
Parsing documentation for forwardable-extended-2.6.0
Installing ri documentation for forwardable-extended-2.6.0
Parsing documentation for pathutil-0.16.1
Installing ri documentation for pathutil-0.16.1
Parsing documentation for rouge-3.3.0
Installing ri documentation for rouge-3.3.0
Parsing documentation for safe_yaml-1.0.4
Installing ri documentation for safe_yaml-1.0.4
Parsing documentation for jekyll-3.8.4
Installing ri documentation for jekyll-3.8.4
Done installing documentation for public_suffix, addressable, colorator, http_parser.rb, eventmachine, em-websocket, concurrent-ruby, i18n, rb-fsevent, ffi, rb-inotify, sass-listen, sass, jekyll-sass-converter, ruby_dep, listen, jekyll-watch, kramdown, liquid, mercenary, forwardable-extended, pathutil, rouge, safe_yaml, jekyll after 44 seconds
Fetching: bundler-1.16.6.gem (100%)
Successfully installed bundler-1.16.6
Parsing documentation for bundler-1.16.6
Installing ri documentation for bundler-1.16.6
Done installing documentation for bundler after 9 seconds
26 gems installed
```

-----

## 使用

### 使用`Jekyll`创建`Blog`
`CMD`切换到D盘(项目路径)，创建`Blog`
```
D:
jekyll new blog
```
显示太多不全贴出来，最后显示如下
```
  Bundler: Using jekyll-sass-converter 1.5.2
  Bundler: Using ruby_dep 1.5.0
  Bundler: Using listen 3.1.5
  Bundler: Using jekyll-watch 2.0.0
  Bundler: Using kramdown 1.17.0
  Bundler: Using liquid 4.0.0
  Bundler: Using mercenary 0.3.6
  Bundler: Using pathutil 0.16.1
  Bundler: Using rouge 3.3.0
  Bundler: Using safe_yaml 1.0.4
  Bundler: Using jekyll 3.8.4
  Bundler: Fetching jekyll-feed 0.11.0
  Bundler: Installing jekyll-feed 0.11.0
  Bundler: Fetching jekyll-seo-tag 2.5.0
  Bundler: Installing jekyll-seo-tag 2.5.0
  Bundler: Fetching minima 2.5.0
  Bundler: Installing minima 2.5.0
  Bundler: Fetching thread_safe 0.3.6
  Bundler: Installing thread_safe 0.3.6
  Bundler: Fetching tzinfo 1.2.5
  Bundler: Installing tzinfo 1.2.5
  Bundler: Fetching tzinfo-data 1.2018.5
  Bundler: Installing tzinfo-data 1.2018.5
  Bundler: Fetching wdm 0.1.1
  Bundler: Installing wdm 0.1.1 with native extensions
  Bundler: Bundle complete! 5 Gemfile dependencies, 33 gems now installed.
  Bundler: Use `bundle info [gemname]` to see where a bundled gem is installed.
New jekyll site installed in D:/blog.
```
可以看到项目路径`D:/blog`
### 安装`Bundle`组件
切换到项目路径`D:/blog`，执行命令，安装`Bundle`组件
```
cd blog
bundle install
```
显示太多不全贴出来，最后显示如下
```
Using ffi 1.9.25 (x64-mingw32)
Using forwardable-extended 2.6.0
Using i18n 0.9.5
Using rb-fsevent 0.10.3
Using rb-inotify 0.9.10
Using sass-listen 4.0.0
Using sass 3.6.0
Using jekyll-sass-converter 1.5.2
Using ruby_dep 1.5.0
Using listen 3.1.5
Using jekyll-watch 2.0.0
Using kramdown 1.17.0
Using liquid 4.0.0
Using mercenary 0.3.6
Using pathutil 0.16.1
Using rouge 3.3.0
Using safe_yaml 1.0.4
Using jekyll 3.8.4
Using jekyll-feed 0.11.0
Using jekyll-seo-tag 2.5.0
Using minima 2.5.0
Using thread_safe 0.3.6
Using tzinfo 1.2.5
Using tzinfo-data 1.2018.5
Using wdm 0.1.1
Bundle complete! 5 Gemfile dependencies, 33 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
```
### 更新`Bundle`组件
执行命令，更新`Bundle`组件
```
bundle update
```
显示太多不全贴出来，最后显示如下
```
Using http_parser.rb 0.6.0
Using em-websocket 0.5.1
Using ffi 1.9.25 (x64-mingw32)
Using forwardable-extended 2.6.0
Using i18n 0.9.5
Using rb-fsevent 0.10.3
Using rb-inotify 0.9.10
Using sass-listen 4.0.0
Using sass 3.6.0
Using jekyll-sass-converter 1.5.2
Using ruby_dep 1.5.0
Using listen 3.1.5
Using jekyll-watch 2.0.0
Using kramdown 1.17.0
Using liquid 4.0.0
Using mercenary 0.3.6
Using pathutil 0.16.1
Using rouge 3.3.0
Using safe_yaml 1.0.4
Using jekyll 3.8.4
Using jekyll-feed 0.11.0
Using jekyll-seo-tag 2.5.0
Using minima 2.5.0
Using thread_safe 0.3.6
Using tzinfo 1.2.5
Using tzinfo-data 1.2018.5
Using wdm 0.1.1
Bundle updated!
```
### 启动转化和本地服务
```
bundle exec jekyll serve
```
启动成功后显示
```
Configuration file: D:/blog/_config.yml
            Source: D:/blog
       Destination: D:/blog/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 0.56 seconds.
  Please add the following to your Gemfile to avoid polling for changes:
    gem 'wdm', '>= 0.1.0' if Gem.win_platform?
 Auto-regeneration: enabled for 'D:/blog'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```
访问[http://127.0.0.1:4000/](http://127.0.0.1:4000/)即可  
关闭服务，关闭当前窗口即可或者`Ctrl加C`