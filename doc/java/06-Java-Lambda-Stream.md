# Java8的Lambda和Stream流

> **Java8的Lambda和Stream流例子**

![图片](https://img10.360buyimg.com/img/jfs/t28009/85/679233078/344896/8bef206a/5bfaa166N310607a5.jpg)

* **一般有 filter 操作时，不用并行流 parallelStream，如果用的话可能会导致线程安全问题**
* **distinct() 只能对于简单的如 List<String>，List<int> 等起作用，而对于 List<T> 不起作用**
* **判断对象要重写 hash**

## 去重

* List去重

```java
public static void main(String[] args) {
    List<String> icpCodeList = new ArrayList<>();
    icpCodeList.add("CAA");
    icpCodeList.add("SAA");
    icpCodeList.add("CAA");
    icpCodeList.add("SAA");
    icpCodeList.add("CAA");
    System.out.println(icpCodeList.toString());
    // distinct()只能对于简单的如List<String>，List<int>等起作用，而对于List<T>不起作用
    icpCodeList = icpCodeList.stream().distinct().collect(Collectors.toList());
    System.out.println(icpCodeList.toString());
}
```
> 输出
```json
[CAA, SAA, CAA, SAA, CAA]
[CAA, SAA]
```

* Map根据Key为Id去重，转换为List

```java
public static void main(String[] args) {
    // 根据key为Id去重
    Map<String, BlockDefDto> blockDefDtoMap = new HashMap<>(16);
    BlockDefDto blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name11");
    blockDefDtoMap.put(blockDefDto.getBlockId().toString(), blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name22");
    blockDefDtoMap.put(blockDefDto.getBlockId().toString(), blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(3);
    blockDefDto.setBlockName("Name33");
    blockDefDtoMap.put(blockDefDto.getBlockId().toString(), blockDefDto);
    // 1-简单转换
    List<BlockDefDto> blockDefDtoList1 = new ArrayList<>();
    blockDefDtoMap.forEach((blockId, blockDefDtoTemp) -> {
        blockDefDtoList1.add(blockDefDtoTemp);
    });
    // 2-快速转换
    List<BlockDefDto> blockDefDtoList2 = blockDefDtoMap.values().stream().collect(Collectors.toList());
    System.out.println(JSON.toJSONString(blockDefDtoList1));
    System.out.println(JSON.toJSONString(blockDefDtoList2));
}
```
> 输出
```json
[{"blockId":2,"blockName":"Name22"},{"blockId":3,"blockName":"Name33"}]
[{"blockId":2,"blockName":"Name22"},{"blockId":3,"blockName":"Name33"}]
```

* List直接根据字段去重

```java
public static void main(String[] args) {
    List<BlockDefDto> blockDefDtoList = new ArrayList<>();
    BlockDefDto blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name11");
    blockDefDtoList.add(blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name22");
    blockDefDtoList.add(blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(3);
    blockDefDto.setBlockName("Name33");
    blockDefDtoList.add(blockDefDto);
    // List去重
    List<BlockDefDto> blockDefDtoListResult = blockDefDtoList.stream()
                .collect(Collectors.collectingAndThen(Collectors.toCollection(() ->
                        new TreeSet<>(Comparator.comparing(BlockDefDto::getBlockId))), ArrayList::new));
    System.out.println(JSON.toJSONString(blockDefDtoList));
    System.out.println(JSON.toJSONString(blockDefDtoListResult));
}
```
> 输出
```json
[{"blockId":2,"blockName":"Name11"},{"blockId":2,"blockName":"Name22"},{"blockId":3,"blockName":"Name33"}]
[{"blockId":2,"blockName":"Name11"},{"blockId":3,"blockName":"Name33"}]
```

## 交差并集

```java
public static void main(String[] args) {
    // 判断对象要重写hash
    // 一般有filter操作时，不用并行流parallelStream，如果用的话可能会导致线程安全问题
    List<String> list1 = new ArrayList();
    list1.add("1111");
    list1.add("2222");
    list1.add("3333");

    List<String> list2 = new ArrayList();
    list2.add("3333");
    list2.add("4444");
    list2.add("5555");

    // 交集
    List<String> intersection = list1.stream().filter(item -> list2.contains(item)).collect(Collectors.toList());
    System.out.println("---得到交集 intersection---");
    intersection.parallelStream().forEach(System.out :: println);

    // 差集 (list1 - list2)
    List<String> reduce1 = list1.stream().filter(item -> !list2.contains(item)).collect(Collectors.toList());
    System.out.println("---得到差集 reduce1 (list1 - list2)---");
    reduce1.parallelStream().forEach(System.out :: println);

    // 差集 (list2 - list1)
    List<String> reduce2 = list2.stream().filter(item -> !list1.contains(item)).collect(Collectors.toList());
    System.out.println("---得到差集 reduce2 (list2 - list1)---");
    reduce2.parallelStream().forEach(System.out :: println);

    // 并集
    List<String> listAll = list1.parallelStream().collect(Collectors.toList());
    List<String> listAll2 = list2.parallelStream().collect(Collectors.toList());
    listAll.addAll(listAll2);
    System.out.println("---得到并集 listAll---");
    listAll.parallelStream().forEach(System.out :: println);

    // 去重并集
    List<String> listAllDistinct = listAll.stream().distinct().collect(Collectors.toList());
    System.out.println("---得到去重并集 listAllDistinct---");
    listAllDistinct.parallelStream().forEach(System.out :: println);

    System.out.println("---原来的List1---");
    list1.parallelStream().forEach(System.out :: println);
    System.out.println("---原来的List2---");
    list2.parallelStream().forEach(System.out :: println);
}
```
> 输出
```json
---得到交集 intersection---
3333
---得到差集 reduce1 (list1 - list2)---
2222
1111
---得到差集 reduce2 (list2 - list1)---
5555
4444
---得到并集 listAll---
3333
4444
3333
1111
2222
5555
---得到去重并集 listAllDistinct---
3333
1111
5555
2222
4444
---原来的List1---
2222
3333
1111
---原来的List2---
4444
5555
3333
```

## GroupingBy

```java
public static void main(String[] args) {
    List<BlockDefDto> blockDefDtoList = new ArrayList<>();
    BlockDefDto blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name11");
    blockDefDtoList.add(blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name22");
    blockDefDtoList.add(blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(3);
    blockDefDto.setBlockName("Name33");
    blockDefDtoList.add(blockDefDto);
    // groupingBy根据ID字段分组
    Map<Integer, List<BlockDefDto>> blockDefDtoMapGroup = blockDefDtoList.stream()
            .collect(Collectors.groupingBy(BlockDefDto::getBlockId));
    // groupingBy根据ID字段分组统计Name
    Map<Integer, List<String>> blockDefDtoMapGroupBlockName = blockDefDtoList.stream()
            .collect(Collectors.groupingBy(BlockDefDto::getBlockId, 
                    Collectors.mapping(BlockDefDto::getBlockName, Collectors.toList())));
    // groupingBy根据ID字段分组计数
    Map<Integer, Long> blockDefDtoMapCount = blockDefDtoList.stream()
            .collect(Collectors.groupingBy(BlockDefDto::getBlockId, Collectors.counting()));
    System.out.println(JSON.toJSONString(blockDefDtoList));
    System.out.println(JSON.toJSONString(blockDefDtoMapGroup));
    System.out.println(JSON.toJSONString(blockDefDtoMapGroupBlockName));
    System.out.println(JSON.toJSONString(blockDefDtoMapCount));
}
```
> 输出
```json
[{"blockId":2,"blockName":"Name11"},{"blockId":2,"blockName":"Name22"},{"blockId":3,"blockName":"Name33"}]
{2:[{"blockId":2,"blockName":"Name11"},{"blockId":2,"blockName":"Name22"}],3:[{"blockId":3,"blockName":"Name33"}]}
{2:["Name11","Name22"],3:["Name33"]}
{2:2,3:1}
```

## 排序

* Map排序

```java
// 初始数据
Map<String, Float> map = new HashMap<>();
map.put("1", 11f);
map.put("3", 33.1f);
map.put("5", 12f);
map.put("2", 22f);
map.put("4", 33.2f);
List<Map.Entry<String, Float>> list = new ArrayList<>();
list.addAll(map.entrySet());
// 排序从大到小，从小到大将1和-1互换即可
Collections.sort(list, (o1, o2) -> {
    if (o1.getValue() > o2.getValue()) {
        return -1;
    }
    if (o1.getValue().equals(o2.getValue())) {
        return 0;
    }
    return 1;
});
list.forEach(entry -> {
    System.out.println("key:" + entry.getKey() + ",value:" + entry.getValue());
});
```
> 输出
```json
key:4,value:33.2
key:3,value:33.1
key:2,value:22.0
key:5,value:12.0
key:1,value:11.0
```

* List排序

```java
// 初始数据
List<String> list  =   new ArrayList<>();
for  ( int  i  =   0 ; i  <   9 ; i ++ )  {
    list.add( "T" + i);
}
// 倒序排列
Collections.reverse(list);
System.out.println(list);
// 顺序排列
Collections.sort(list);
System.out.println(list);
// 随机排序
Collections.shuffle(list);
System.out.println(list);
```
> 输出
```json
[T8, T7, T6, T5, T4, T3, T2, T1, T0]
[T0, T1, T2, T3, T4, T5, T6, T7, T8]
[T6, T1, T0, T3, T7, T5, T8, T4, T2]
```

## 随意转换

* 随意转换

```java
public static void main(String[] args) {
    List<BlockDefDto> blockDefDtoList = new ArrayList<>();
    BlockDefDto blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(1);
    blockDefDto.setBlockName("Name22");
    blockDefDtoList.add(blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(2);
    blockDefDto.setBlockName("Name22");
    blockDefDtoList.add(blockDefDto);
    blockDefDto = new BlockDefDto();
    blockDefDto.setBlockId(3);
    blockDefDto.setBlockName("Name33");
    blockDefDtoList.add(blockDefDto);
    // 1-简单转换
    Set<String> blockNameSet1 = new HashSet<>(16);
    blockDefDtoList.forEach(blockDefDtoTemp -> {
        blockNameSet1.add(blockDefDtoTemp.getBlockName());
    });
    // 2-快速转换
    Set<String> blockNameSet2 = blockDefDtoList.stream().map(BlockDefDto::getBlockName).collect(Collectors.toSet());
    // 转List
    List<String> blockNameList3 = blockDefDtoList.stream().map(BlockDefDto::getBlockName).collect(Collectors.toList());
    System.out.println(JSON.toJSONString(blockNameSet1));
    System.out.println(JSON.toJSONString(blockNameSet2));
    System.out.println(JSON.toJSONString(blockNameList3));
}
```
> 输出
```json
["Name22","Name33"]
["Name22","Name33"]
["Name22","Name22","Name33"]
```

**参考**

* [Java8函数式编程（三）：Collectors.groupingBy](https://www.jianshu.com/p/21b20c375599)
* [Java8 List<对象> 转 Set、Map（高级）、排序、分组、统计](https://www.cnblogs.com/LUA123/p/9367657.html)