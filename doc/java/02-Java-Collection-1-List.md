# Java拾遗-集合-List

> **JDK 版本为 1.8**

## 1. Vector

```java
/**
 * Vector源码解析
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/8/26 15:21
 */
public class T01_Vector<E> {

    /**
     * 存储数据的数组，大小构造方法可以赋值，initialCapacity数组初始化大小默认为10
     */
    protected Object[] elementData;

    /**
     * 当前数组中的有效数据大小(就是size方法返回值)，比如数组是10的空间，但是只有8个有效数据，后面的数据都为null
     */
    protected int elementCount;

    /**
     * 数组增量因子，如果大于0就是当前的数量，小于等于0默认为原来的两倍，构造方法可以赋值
     */
    protected int capacityIncrement;

    /**
     * 最大数组容量
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    /**
     * 默认构造方法，可以设置数组初始化大小和增量因子
     */
    public T01_Vector(int initialCapacity, int capacityIncrement) {
        super();
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal Capacity: "+
                    initialCapacity);
        this.elementData = new Object[initialCapacity];
        this.capacityIncrement = capacityIncrement;
    }

    /**
     * 默认构造方法，默认数组大小10，设置增量因子为0，默认两倍扩容
     */
    public T01_Vector(int initialCapacity) {
        this(initialCapacity, 0);
    }

    /**
     * 默认构造方法，默认数组大小10，设置增量因子为0，默认两倍扩容
     */
    public T01_Vector() {
        this(10);
    }

    /**
     * 构造方法传集合，拿到传入的集合，转成数组，进行深拷贝，长度和传入集合长度一致
     */
    public T01_Vector(Collection<? extends E> c) {
        elementData = c.toArray();
        elementCount = elementData.length;
        // c.toArray might (incorrectly) not return Object[] (see 6260652)
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, elementCount, Object[].class);
    }


    /**
     * 扩容前的判断
     *
     * @param minCapacity
     */
    private void ensureCapacityHelper(int minCapacity) {
        // 判断当前最小有效数据大于数组长度，则需要扩容数组
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }

    /**
     * 数组核心扩容方法
     *
     * @param minCapacity
     */
    private void grow(int minCapacity) {
        // 拿到当前数组大小
        int oldCapacity = elementData.length;
        // 判断数组增量因子是否大于0，大于0，扩容量为增量因子的值，不大于0默认为原来两倍
        int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                capacityIncrement : oldCapacity);
        // 扩容后的大小比当前最小数据量还小的话，直接用最小数据量
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        // 扩容后的大小比最大数组容量还大的话，就使用返回一个更大的数Integer.MAX_VALUE
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // 拿到最后数据扩容大小，创建新数组，再把原来数据复制到新数组中
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }

    /**
     * 添加方法，返回的永远的true
     */
    public synchronized boolean add(E e) {
        /*modCount++;*/
        // 先进行扩容判断
        ensureCapacityHelper(elementCount + 1);
        // 然后将新加的数据放入有效数据的下一位
        elementData[elementCount++] = e;
        return true;
    }

    /**
     * 指定位置添加(插入)，没有返回值
     *
     * @param index
     * @param element
     */
    public void add(int index, E element) {
        insertElementAt(element, index);
    }

    public synchronized void insertElementAt(E obj, int index) {
        /*modCount++;*/
        // 必须是有效数据内的插入才行，不然会出现越界异常
        if (index > elementCount) {
            throw new ArrayIndexOutOfBoundsException(index
                    + " > " + elementCount);
        }
        // 进行扩容判断
        ensureCapacityHelper(elementCount + 1);
        // 从index开始的数据全部后移，底层是native方法
        System.arraycopy(elementData, index, elementData, index + 1, elementCount - index);
        // 当前坐标赋值
        elementData[index] = obj;
        // elementCount++
        elementCount++;
    }

    /**
     * 获取指定下标的值
     *
     * @param index
     * @return
     */
    public synchronized E get(int index) {
        // 必须是有效数据内的才行，不然会出现越界异常
        if (index >= elementCount)
            throw new ArrayIndexOutOfBoundsException(index);
        // 获取
        /*return elementData(index);*/
        return null;
    }

    /**
     * 更新指定坐标的值，返回值为旧值
     *
     * @param index
     * @param element
     * @return
     */
    public synchronized Object set(int index, E element) {
        // 必须是有效数据内的才行，不然会出现越界异常
        if (index >= elementCount)
            throw new ArrayIndexOutOfBoundsException(index);
        // 拿到旧值
        /*E oldValue = elementData(index);*/
        E oldValue = null;
        // 更新新值
        elementData[index] = element;
        // 返回值为旧值
        return oldValue;
    }

    /**
     * 移除指定下标，返回被删除的元素
     *
     * @param index
     * @return
     */
    public synchronized E remove(int index) {
        /*modCount++;*/
        // 必须是有效数据内的才行，不然会出现越界异常
        if (index >= elementCount)
            throw new ArrayIndexOutOfBoundsException(index);
        // 拿到移除的值
        /*E oldValue = elementData(index);*/
        E oldValue = null;
        // 计算集合需要移动元素个数
        int numMoved = elementCount - index - 1;
        // 如果需要移动元素个数大于0
        if (numMoved > 0)
            // 删除的坐标后的数据全部往前移动一位，使用arrayCopy底层native方法进行拷贝
            System.arraycopy(elementData, index+1, elementData, index,
                    numMoved);
        // 将源集合后一个元素置为null，尽早让垃圾回收机制对其进行回收
        elementData[--elementCount] = null; // Let gc do its work
        // 返回被删除的元素
        return oldValue;
    }

    /**
     * 移除当前元素，返回成功失败
     *
     * @param o
     * @return
     */
    public boolean remove(Object o) {
        return removeElement(o);
    }

    public synchronized boolean removeElement(Object obj) {
        /*modCount++;*/
        // 查找当前元素存在的左边
        int i = indexOf(obj);
        // 存在去移除，返回true，不存在返回false
        if (i >= 0) {
            removeElementAt(i);
            return true;
        }
        return false;
    }

    public int indexOf(Object o) {
        // 从0开始找
        return indexOf(o, 0);
    }

    public synchronized int indexOf(Object o, int index) {
        // 找到返回坐标，没找到为-1
        if (o == null) {
            for (int i = index ; i < elementCount ; i++)
                // 元素等于null
                if (elementData[i]==null)
                    return i;
        } else {
            for (int i = index ; i < elementCount ; i++)
                // 元素不等于null，用equals判断是否一样
                if (o.equals(elementData[i]))
                    return i;
        }
        return -1;
    }

    public synchronized void removeElementAt(int index) {
        /*modCount++;*/
        // 必须是有效数据内的才行，不然会出现越界异常
        if (index >= elementCount) {
            throw new ArrayIndexOutOfBoundsException(index + " >= " +
                    elementCount);
        }
        else if (index < 0) {
            throw new ArrayIndexOutOfBoundsException(index);
        }
        // 计算集合需要移动元素个数
        int j = elementCount - index - 1;
        // 如果需要移动元素个数大于0
        if (j > 0) {
            // 删除的坐标后的数据全部往前移动一位，使用arrayCopy底层native方法进行拷贝
            System.arraycopy(elementData, index + 1, elementData, index, j);
        }
        // 将源集合后一个元素置为null，尽早让垃圾回收机制对其进行回收
        elementCount--;
        elementData[elementCount] = null; /* to let gc do its work */
    }

}
```

## 2. ArrayList

```java
/**
 * ArrayList源码解析
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/8/26 15:21
 */
public class T02_ArrayList<E> {

    /**
     * 默认数组大小
     */
    private static final int DEFAULT_CAPACITY = 10;

    /**
     * 空数组，Shared empty array instance used for empty instances.
     */
    private static final Object[] EMPTY_ELEMENTDATA = {};

    /**
     * 空数组，Shared empty array instance used for default sized empty instances. We
     * distinguish this from EMPTY_ELEMENTDATA to know how much to inflate when
     * first element is added.
     */
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

    /**
     * 存储数据的数组，elementData.length为数组实际大小
     * 当新增元素size > elementData.length后就需要扩容数组，每次1.5倍
     */
    transient Object[] elementData;

    /**
     * 当前数组大小
     */
    private int size;

    /**
     * 最大数组容量
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    /**
     * 默认构造方法，可以设置数组初始化大小
     */
    public T02_ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                    initialCapacity);
        }
    }

    /**
     * 默认空构造方法，数组初始化空
     */
    public T02_ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }

    /**
     * 构造方法传集合，拿到传入的集合，转成数组，进行深拷贝，长度和传入集合长度一致
     */
    public T02_ArrayList(Collection<? extends E> c) {
        elementData = c.toArray();
        // 传入的集合为空，也初始化空数组
        if ((size = elementData.length) != 0) {
            // c.toArray might (incorrectly) not return Object[] (see 6260652)
            if (elementData.getClass() != Object[].class)
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            // replace with empty array.
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }

    /**
     * 扩容前的判断
     * @param minCapacity
     */
    private void ensureExplicitCapacity(int minCapacity) {
        // 实际修改集合次数++ (在扩容的过程中没用，主要是用于迭代器中)
        /*modCount++;*/

        // 判断当前数组大小大于数组实际大小，则需要扩容数组
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }

    /**
     * 数组核心扩容方法
     *
     * @param minCapacity
     */
    private void grow(int minCapacity) {
        // 拿到当前数组实际大小
        int oldCapacity = elementData.length;
        // 默认为原来1.5倍 >> 右移 oldCapacity/2
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        // 判断新容量 - 小容量是否小于 0, 如果是第一次调用add方法必然小于
        if (newCapacity - minCapacity < 0)
            // 还是将小容量赋值给新容量
            newCapacity = minCapacity;
        // 判断新容量-大数组大小 是否>0，如果条件满足就计算出一个超大容量
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // 调用数组工具类方法，创建一个新数组，将新数组的地址赋值给elementData
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
                Integer.MAX_VALUE :
                MAX_ARRAY_SIZE;
    }

    /**
     * 添加方法，返回的永远的true
     *
     * @param e
     * @return
     */
    public boolean add(E e) {
        // 扩容操作
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        // 赋值后size++
        elementData[size++] = e;
        return true;
    }

    private void ensureCapacityInternal(int minCapacity) {
        // 判断集合存数据的数组是否等于空容量的数组
        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
            // 通过小容量和默认容量求出较大值 (用于第一次扩容)
            minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
        }
        // 将if中计算出来的容量传递给下一个方法，继续校验
        ensureExplicitCapacity(minCapacity);
    }

    public void add(int index, E element) {
        // 数组越界判断
        rangeCheckForAdd(index);
        // 扩容判断
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        // 从index开始的数据全部后移，底层是native方法
        System.arraycopy(elementData, index, elementData, index + 1,
                size - index);
        // 当前坐标赋值
        elementData[index] = element;
        // size++
        size++;
    }

    private void rangeCheckForAdd(int index) {
        // 数组越界判断
        if (index > size || index < 0)
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    private String outOfBoundsMsg(int index) {
        return "Index: "+index+", Size: "+size;
    }

    /**
     * 获取指定下标的值
     *
     * @param index
     * @return
     */
    public E get(int index) {
        // 数组越界判断
        rangeCheck(index);
        // 获取
        /*return elementData(index);*/
        return null;
    }

    private void rangeCheck(int index) {
        // 数组越界判断
        if (index >= size)
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    /**
     * 更新指定坐标的值，返回值为旧值
     *
     * @param index
     * @param element
     * @return
     */
    public E set(int index, E element) {
        // 数组越界判断
        rangeCheck(index);
        // 拿到旧值
        /*E oldValue = elementData(index);*/
        E oldValue = null;
        // 更新新值
        elementData[index] = element;
        // 返回值为旧值
        return oldValue;
    }

    /**
     * 移除指定下标，返回被删除的元素
     *
     * @param index
     * @return
     */
    public E remove(int index) {
        // 数组越界判断
        rangeCheck(index);

        /*modCount++;*/
        // 拿到移除的值
        /*E oldValue = elementData(index);*/
        E oldValue = null;
        // 计算集合需要移动元素个数
        int numMoved = size - index - 1;
        // 如果需要移动元素个数大于0
        if (numMoved > 0)
            // 删除的坐标后的数据全部往前移动一位，使用arrayCopy底层native方法进行拷贝
            System.arraycopy(elementData, index+1, elementData, index,
                    numMoved);
        // 将源集合后一个元素置为null，尽早让垃圾回收机制对其进行回收
        elementData[--size] = null; // clear to let GC do its work
        // 返回被删除的元素
        return oldValue;
    }

    /**
     * 移除当前元素，返回成功失败
     *
     * @param o
     * @return
     */
    public boolean remove(Object o) {
        if (o == null) {
            for (int index = 0; index < size; index++)
                // 元素等于null
                if (elementData[index] == null) {
                    // 如果相等，调用fastRemove方法快速删除
                    fastRemove(index);
                    return true;
                }
        } else {
            for (int index = 0; index < size; index++)
                // 元素不等于null，用equals判断是否一样
                if (o.equals(elementData[index])) {
                    // 如果相等，调用fastRemove方法快速删除
                    fastRemove(index);
                    return true;
                }
        }
        return false;
    }

    private void fastRemove(int index) {
        /*modCount++;*/
        // 计算集合需要移动元素的个数
        int numMoved = size - index - 1;
        if (numMoved > 0)
            // 删除的坐标后的数据全部往前移动一位，使用arrayCopy底层native方法进行拷贝
            System.arraycopy(elementData, index+1, elementData, index,
                    numMoved);
        // 将源集合后一个元素置为null，尽早让垃圾回收机制对其进行回收
        elementData[--size] = null; // clear to let GC do its work
    }

}
```

## 3. LinkedList

```java
/**
 * LinkedList源码解析
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/8/26 15:21
 */
public class T03_LinkedList<E> {

    /**
     * Node节点内部类，存放当前节点，前驱节点，后继节点
     *
     * @param <E>
     */
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }

    /**
     * 当前集合的大小
     */
    transient int size = 0;

    /**
     * 当前集合第一个节点
     */
    transient Node<E> first;

    /**
     * 当前集合最后一个节点
     */
    transient Node<E> last;

    /**
     * 构造为空
     */
    public T03_LinkedList() {
    }

    // 待补充

}
```

## 4. CopyOnWriteArrayList

> 另外还有一个 CopyOnWriteArraySet 集合，它的内部就是使用 CopyOnWriteArrayList 集合实现的

CopyOnWriteArrayList 集合是一种 CopyOnWrite 的一种实现，根据 CopyOnWrite 方式介绍。所以我们知道 CopyOnWriteArrayList 集合中所有读取的方法都是不加锁的，而修改的方法是加锁的

CopyOnWriteArrayList集合可以解决多线程操作集合的并发问题，而且它的读取操作非常快，而修改操作将对较慢，因为使用的 Lock 锁，同一时间只有一个线程，能够进行修改操作，其他线程必须等待

它唯一的缺点就是，一个线程对 CopyOnWriteArrayList 集合进行修改，另一线程并不能立即读取到。当然对同一线程来说，就没有这个问题的

* [Java并发集合_CopyOnWriteArrayList原理分析](https://www.jianshu.com/p/8244c2405133)
