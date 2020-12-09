# 建造者模式(Builder Pattern)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

待补充

## 1. 介绍

待补充

## 2. 使用

通常是一个对象，具有多个成员变量可能需要初始化，常规方法，需要提供大量构造函数。例如：

```java
// 非Android中的AlertDialog，便于说明问题，举个例子
public class AlertDialog {
    private int width;
    private int height;
    private String title;
    private String confirmText;
    private String denyText;

    private AlertDialog(){}
    public AlertDialog(int width, int height){ // 空白的警告框
         AlertDialog(width,height,null);
    }

    // 带标题的警告框
    public AlertDialog(int width, int height, String title){ // 带标题的警告框
        AlertDialog(width, height, title, "确定");
    }

    // 带标题的警告框，有确定按钮
    public AlertDialog(int width, int height, String title, String confirm){
        AlertDialog(width, height, title, confirm, null);
    }

    // 带标题的警告框，有确定按钮，取消按钮
    public AlertDialog(int width, int height, String title, String confirm, String denyText){
        // set every thing.
    }
}
```

有多种样式的警告框，为了调用方便，必须提供多个构造函数。否则用户在调用时，只能使用完整构造函数，容易犯错且无法进行阅读。极不灵活。如果采用另外一种方式，则可以解决，但会花费很多经历处理并发的情况：

```java
// 非Android中的AlertDialog，便于说明问题，举个例子
public class AlertDialog {
    private int width;
    private int height;
    private String title;
    private String confirmText;
    private String denyText;

    public AlertDialog(){}// 空白的构造函数

    public void setWidth(int width){
        this.width = width;
    }
    // 其他set方法
}
```

调用时，通过调用各个参数的set方法进行设置。问题来了：

并发
无法进行参数校验。
例如，只创建了对象，设置了标题，却没有尺寸，相当于创建了一个没有尺寸的警告框。

在 Android 中，大量的控件都使用了构造器 Builder。

```java
// 非Android中的AlertDialog，便于说明问题，举个例子
public class AlertDialog {
    private int width;
    private int height;
    private String title;
    private String confirmText;
    private String denyText;

    // private
    private AlertDialog(){}

    // Builder中使用
    protected AlertDialog(Builder b){
        width = b.width;
        height = b.height;
        // .....
        if(width==0||height==0) throws new Exception("size must be set");
    }

    // 构造器
    public static class Builder {
        private int width;
        private int height;
        private String title;
        private String confirmText;
        private String denyText;

        // 注意：返回的Builder。
        public Builder setTitle(String title) {
            this.title = title;
            return this;
        }
        // 其他set...

        public AlertDialog build(){
            return AlertDialog(this);
        }
    }
}
```

于是，可以根据相应需求，进行相应设置，并在AlertDialog真正构造时，进行参数校验。就像这样：

```java
new AlertDialog.Builder().setTitle("提示").build();
```

上述例子，会成功抛出异常。