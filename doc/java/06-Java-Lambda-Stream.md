# Java8的Lambda和Stream流

> **Java8的Lambda和Stream流例子**

![图片](https://img10.360buyimg.com/img/jfs/t28009/85/679233078/344896/8bef206a/5bfaa166N310607a5.jpg)

## 去重

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