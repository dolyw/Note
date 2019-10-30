# List集合去重方式及效率对比

<!-- 2019-01-17 15:18:18 -->

## 介绍

* **List**集合相信大家在开发过程中几乎都会用到。有时候难免会遇到集合里的数据是重复的，需要进行去除。然而，去重方式有好几种方式，你用的是哪种方式呢？去重方式效率是否是最高效、最优的呢？今天就给大家讲解一下**List**集合去重的常见及常用的四种方式

## 实现思路

### 实现方式一

* 使用两个**for**循环遍历集合所有元素，然后进行判断是否有相同元素，如果有，则去除。这种方式是大部分最先想到的，也是最简单的实现方式。其中，这种方式可以保证**List**集合原来的顺序不变
* 代码

```java
/**
* 使用两个for循环实现List去重
* @author dolyw
* @date 2019/1/17 18:08
*/
public static List repeatListWayOne(List<String> list) {
   for (int i = 0; i < list.size(); i++) {
       for (int j = i + 1; j < list.size(); j++) {
           if (list.get(i).equals(list.get(j))) {
               list.remove(j);
           }
       }
   }
   return list;
}
```

### 实现方式二

* 我们知道**HashSet**实现了**Set**接口，不允许出现重复元素。可以基于这个想法，把**List**集合所有元素存入**HashSet**对象，接着把**List**集合元素全部清空，最后把**HashSet**对象元素全部添加至**List**集合中，这样就可以保证不出现重复元素。而**HashSet**有一个构造函数，在初始化时可以直接添加元素。其中，**HashSet**不能保证顺序不变，所以此方式不能保证**List**集合原来的顺序不变
* 代码

```java
/**
* 使用HashSet实现List去重
* @author dolyw
* @date 2019/1/17 18:08
*/
public static List repeatListWayTwo(List<String> list) {
  // 初始化HashSet对象，并把list对象元素赋值给HashSet对象
  HashSet set = new HashSet(list);
  // 把List集合所有元素清空
  list.clear();
  // 把HashSet对象添加至List集合
  list.addAll(set);
  return list;
}
```

### 实现方式三

* **TreeSet**集合也是实现**Set**接口，是一个有序的，并且无重复元素集合。同理，我们可以根据上面方式二的思想进行去重。其中，去重后的**List**集合可以保证和原来的顺序一致
* 代码

```java
/**
* 使用TreeSet实现List去重
* @author dolyw
* @date 2019/1/17 18:08
*/
public static List repeatListWayThird(List<String> list) {
   // 初始化TreeSet对象，并把list对象元素赋值给TreeSet对象
   TreeSet set = new TreeSet(list);
   // 把List集合所有元素清空
   list.clear();
   // 把TreeSet对象添加至List集合
   list.addAll(set);
   return list;
}
```

### 实现方式四

* 利用**List**集合**contains**方法循环遍历，先创建新的**List**集合，接着循环遍历原来的**List**集合，判断新集合是否包含有旧集合，如果有，则不添加至新集合，否则添加。最后，把旧集合清空，把新集合元素赋值给旧集合
* 代码

```java
/**
* 利用List集合contains方法循环遍历去重
* @author dolyw
* @date 2019/1/17 18:08
*/
public static List repeatListWayFourth(List<String> list) {
   // 新建新List集合，用于存放去重后的元素
   List<String> newList = new ArrayList<String>();
   // 循环遍历旧集合元素
   for (int i = 0; i < list.size(); i++ ) {
       // 判断新集合是否包含有，如果不包含有，则存入新集合中
       boolean isContains = newList.contains(list.get(i));
       if(!isContains) {
           newList.add(list.get(i));
       }
   }
   // 把List集合所有元素清空
   list.clear();
   // 把新集合元素添加至List集合
   list.addAll(newList);
   return list;
}
```

## 效率对比

* 上面给大家介绍了四种List集合去重方式。那么，哪种方式效率是最好的呢？下面就演示一下进行对比
* 为了演示方式，随机生成0-500之间的20000个整数字符串，并存入List集合，并在相应代码打印相关时间进行对比。其中，随机生成List集合代码如下

```java
public static List<String> getRandomList() {
   List<String> list = new ArrayList<String>();
   // 随机生成20000个整数字符串
   for (int i = 1; i <= 20000; i++) {
       // 任意取[0,500)之间整数，其中0可以取到，500取不到
       int number = new Random().nextInt(500);
       String number_str = "geshan" + number;
       list.add(number_str);
   }
   return list;
}
```

* 为了保证List集合元素一致，创建四个List集合，分别对应List去重方式。效率对比代码如下

```java
public static void main(String[] args) {
   // 随机生成0-500之间的1000个整数字符串List集合
   List<String> list = getRandomList();

   // 为了演示四种方式效率，创建四个List集合，保证List集合元素一致
   // 方式一List集合
   List<String> oneList = new ArrayList<>();
   oneList.addAll(list);
   // 方式二List集合
   List<String> twoList = new ArrayList<>();
   twoList.addAll(list);
   // 方式三List集合
   List<String> thirdList = new ArrayList<>();
   thirdList.addAll(list);
   // 方式四List集合
   List<String> fourthList = new ArrayList<>();
   fourthList.addAll(list);

   System.out.println("方式一：使用两个for循环实现List去重");
   System.out.println("原来集合大小:" + oneList.size() + "，集合元素>>" + oneList);
   Date oneDateBegin = new Date();
   repeatListWayOne(oneList);
   System.out.println("集合去重大小:" + oneList.size()+"，集合元素>>" + oneList);
   Date oneDateEnd = new Date();
   System.out.println("去重所需时间:" + (oneDateEnd.getTime() - oneDateBegin.getTime()) + "毫秒");

   System.out.println("方式二：使用HashSet实现List去重");
   System.out.println("原来集合大小:" + twoList.size() + "，集合元素>>" + twoList);
   Date twoDateBegin = new Date();
   repeatListWayTwo(twoList);
   System.out.println("集合去重大小:" + twoList.size() + "，集合元素>>" + twoList);
   Date twoDateEnd = new Date();
   System.out.println("去重所需时间:" + (twoDateEnd.getTime() - twoDateBegin.getTime()) + "毫秒");

   System.out.println("方式三：使用TreeSet实现List去重");
   System.out.println("原来集合大小:" + thirdList.size() + "，集合元素>>" + thirdList);
   Date thirdDateBegin = new Date();
   repeatListWayThird(thirdList);
   System.out.println("集合去重大小:" + thirdList.size() + "，集合元素>>" + thirdList);
   Date thirdDateEnd = new Date();
   System.out.println("去重所需时间:" + (thirdDateEnd.getTime() - thirdDateBegin.getTime()) + "毫秒");

   System.out.println("方式四：利用List集合contains方法循环遍历去重");
   System.out.println("原来集合大小:" + fourthList.size()+"，集合元素>>" + fourthList);
   Date fourthDateBegin = new Date();
   repeatListWayFourth(fourthList);
   System.out.println("集合去重大小:" + fourthList.size()+"，集合元素>>" + fourthList);
   Date fourthDateEnd = new Date();
   System.out.println("去重所需时间:" + (fourthDateEnd.getTime() - fourthDateBegin.getTime()) + "毫秒");
}
```

### 多次运行结果如下

* 第一次四种方式运行时间如下：223、10、16、30(ms)  
* 第二次四种方式运行时间如下：164、10、17、43(ms)  
* 第三次四种方式运行时间如下：164、9、16、37(ms)

## 总结

* 综合代码及运行时间对比，方式二是最好的去重方式，代码最简洁、耗时最短，不过无法保证顺序，需要保证顺序一致可以采用方式三