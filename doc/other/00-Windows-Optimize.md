# Windows的优化记录

Windows的一些优化

## 文件转移

**QQ**和**微信**文件路径调整，不要存放默认的**C盘文档**文件夹

### QQ文件转移

QQ -> 设置 -> 文件管理 -> 下面那个自定义

修改为 `E:\Documents\Tencent Files` 目录，需要自己创建下 `Tencent Files`

### 微信文件转移

微信 -> 设置 -> 文件管理 -> 微信文件的默认保存位置

修改为 `E:\Documents` 目录，`WeChat Files` 目录会自行转移

## 优化服务

* `Windows Search` 服务关了，会在后台偷偷查户口
* `Print Spooler` 如果你用不着打印机，把打印机的服务也关了吧
* `Hyper-V` 服务如果不用也关了吧
* `Diagnostics` 开头的服务(这诊断工具服务就算诊断出系统有问题，也解决不了，还吃内存)
* `Program CompatibilityAssistant Service` 程序兼容助手服务也可以关了
* `Windows Defender` 服务，已经安装了电脑管家等，也可以关了，这货防护能力一般般
* `Windows 10` 设置-隐私，背景应用，后台应用全关了

## 垃圾清理

下面代码复制为 Bat 可执行文件执行即可

```bash
@echo off 
color 0a
title 系统垃圾清理---
echo 清理系统垃圾文件，请稍等......
echo 清理垃圾文件，速度由电脑文件大小而定 
echo 请勿关闭本窗口 
echo 正在清除系统垃圾文件，请稍后...... 
echo 删除补丁备份目录 
RD %windir%\$hf_mig$ /Q /S 
echo 把补丁卸载文件夹的名字保存成2950800.txt 
dir %windir%\$NtUninstall* /a:d /b >%windir%\2950800.txt 
echo 从2950800.txt中读取文件夹列表并且删除文件夹 
for /f %%i in (%windir%\2950800.txt) do rd %windir%\%%i /s /q 
echo 删除2950800.txt 
del %windir%\2950800.txt /f /q 
echo 删除补丁安装记录内容（下面的del /f /s /q %systemdrive%\*.log已经包含删除此类文件） 
del %windir%\KB*.log /f /q 
echo 删除系统盘目录下临时文件 
del /f /s /q %systemdrive%\*.tmp 
echo 删除系统盘目录下临时文件 
del /f /s /q %systemdrive%\*._mp 
echo 删除系统盘目录下日志文件 
del /f /s /q %systemdrive%\*.log 
echo 删除系统盘目录下GID文件(属于临时文件，具体作用不详) 
del /f /s /q %systemdrive%\*.gid 
echo 删除系统目录下scandisk（磁盘扫描）留下的无用文件 
del /f /s /q %systemdrive%\*.chk 
echo 删除系统目录下old文件 
del /f /s /q %systemdrive%\*.old 
echo 删除回收站的无用文件 
del /f /s /q %systemdrive%\recycled\*.* 
echo 删除系统目录下备份文件 
del /f /s /q %windir%\*.bak 
echo 删除应用程序临时文件 
del /f /s /q %windir%\prefetch\*.* 
echo 删除系统维护等操作产生的临时文件 
rd /s /q %windir%\temp & md %windir%\temp 
echo 删除当前用户的COOKIE（IE） 
del /f /q %userprofile%\cookies\*.* 
echo 删除internet临时文件 
del /f /s /q "%userprofile%\local settings\temporary internet files\*.*" 
echo 删除当前用户日常操作临时文件 
del /f /s /q "%userprofile%\local settings\temp\*.*" 
echo 删除访问记录（开始菜单中的文档里面的东西） 
del /f /s /q "%userprofile%\recent\*.*" 
echo 清理全部完成
echo.
```
