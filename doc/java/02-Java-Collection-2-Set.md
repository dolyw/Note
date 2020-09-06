# Java拾遗-集合-Set

> **JDK 版本为 1.8**

## 1. HashSet

基于 HashMap

## 2. LinkedHashSet

基于 HashSet 添加一个双向链表保证顺序

## 3. TreeSet

待补充

## 4. CopyOnWriteArraySet

内部是使用 CopyOnWriteArrayList 集合实现的，具体查看 List 源码的 CopyOnWriteArrayList

## 4. ConcurrentSkipListSet

内部是使用 ConcurrentSkipListMap 集合实现的，具体查看 Map 源码的 ConcurrentSkipListMap