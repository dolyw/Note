# Java拾遗-集合

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/04/20200429001.png)

> **JDK 版本为 1.8**

## 1. 简介

在 Java 中，如果有一个类专门用来存放其它类的对象，这个类就叫做容器，或者就叫做集合，集合就是将若干性质相同或相近的类对象组合在一起而形成的一个整体

> **数组的容量是有限制的，而集合没有这样的限制，它的容量是可以自动调节的**

Java 中的集合层次结构分为 **单列集合(Collection)** 和 **双列集合(Map)**。单列和双列的直接理解就是，集合的每个项能存储多少个数据。Collection 以及它的子类在每个项中能存储一个数据，因此是单列集合。Map 以及它的子类一次性能存储两个数据，键和值，因此是双列集合

::: tip 总结
* List，Set，Queue，Map 都是接口，前三个继承至 Collection 接口，Map 为独立接口
:::

## 2. List

List 下有 ArrayList，LinkedList，Vector

* **ArrayList**

ArrayList 是线程不安全的，效率高，使用率高，**因为底层是 Object数组，所以查询速度快，修改，删除，插入速度很慢**

* **LinkedList**

LinkedList 也是线程不安全的，效率高，**因为底层是双向链表( JDK1.6 之前为循环链表，JDK1.7 取消了循环)，查询速度慢，修改，删除，插入速度很快**

* **Vector**

Vector 是线程安全的(方法基本都经过 synchronized 修饰)，效率低，**底层是 Object数组，使用率低，如果要线程安全可以使用 JUC 下的 CopyOnWriteArrayList**

## 3. Set

Set 下有 HashSet，LinkedHashSet，TreeSet

* **HashSet**

底层数据结构是哈希表(无序，唯一)，依赖两个方法 hashCode() 和 equals() 来保证元素唯一性

* **LinkedHashSet**

HashSet 的有序扩展，底层数据结构是链表和哈希表(FIFO 插入有序，唯一)，**由链表保证元素有序，由哈希表保证元素唯一**

* **TreeSet**

底层数据结构是红黑树(唯一，有序)

1. 如何保证元素排序的呢?

自然排序，比较器排序

2.如何保证元素唯一性的呢?

根据比较的返回值是否是0来决定

## 3. Queue

Queue 下有 ArrayDeque，PriorityQueue，而且 LinkedList 也实现了 Queue 接口

待补充

## 4. Map

Map 下有 Hashtable，HashMap，LinkedHashMap，TreeMap

* Hashtable

HashTable 是线程安全的(方法基本都经过 synchronized 修饰)，效率低，**使用率低，如果要线程安全可以使用 JUC 下的 ConcurrentHashMap**

* HashMap

HashMap 是线程不安全的，效率较高，**如果要线程安全可以使用 JUC 下的 ConcurrentHashMap**

* LinkedHashMap

待补充

* TreeMap

待补充

## 5. 底层

主要是常用的几个容器了解清楚

### 5.1. HashMap

待补充

### 5.2. ConcurrentHashMap

待补充

### 5.3. ArrayList

待补充

### 5.4. LinkedList

待补充

### 5.5. CopyOnWriteArrayList

待补充

**参考**

* [Java集合中List,Set以及Map等集合体系详解(史上最全)](https://blog.csdn.net/zhangqunshuai/article/details/80660974)


