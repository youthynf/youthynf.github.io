---
title: 抽丝剥茧学ConcurrentHashMap底层原理
cover: /assets/images/cover2.jpg
icon: creative
date: 2025-07-12
category:
  - ConcurrentHashMap
description: 作为Java开发，ConcurrentHashMap这个名字你一定再熟悉不过——它几乎是高并发场景下的“标配”容器，在生产代码里随处可见。关于它的底层实现，我们或多或少都翻过源码、背过八股文，但真要把每一根“毛细血管”都捋清，仍需要一次系统、彻底、抽丝剥茧式的梳理。今天这篇文章，就带你从宏观设计到微观细节，层层拆解，把ConcurrentHashMap的“骨架”与“肌理”一并还原，让原理真正落到看得见的每一行代码、每一次 CAS、每一个扩容迁移的瞬间。
star: true
sticky: false
breadcrumb: false
head:
  - - meta
    - name: keywords
      content: Spring, Bean
---

## 一、为什么再谈 ConcurrentHashMap
HashMap不是线程安全、HashTable全局锁太重、Collections.synchronizedMap又退化成“串行”——于是ConcurrentHashMap成了高并发场景下的“瑞士军刀”。

ConcurrentHashMap在JDK1.7用分段锁Segment，JDK1.8直接干掉了 Segment，换成“桶 + 链表/红黑树 + CAS + synchronized”的复合打法，性能提升肉眼可见。

但面试、调优、故障排查时，我们需要的不仅是“背结论”，而是“能在脑子里跑源码”。因此，今天做一次“抽丝剥茧”式的梳理，把每一根毛细血管都放到显微镜下。

## 二、宏观视角：图说演进
### HashMap
HashMap是Java中最常用的哈希表实现，其底层数据结构在JDK8进行了重大优化。JDK7使用Entry数组 + 单向链表，所有冲突键值对存储在链表中（头插法）。链表过长时，查询效率退化为 O(n)。JDK1.8引入了红黑树（当链表长度 ≥8 且数组长度 ≥64 时转换），查询效率优化为 O(logn)，插入方式也改用了尾插法（解决并发扩容死循环问题），节点类型改为Node链表节点（类似Entry）和TreeNode红黑树节点（继承自Node）。下面是HashMap的JDK8底层数据结构图：
![image.png](https://s2.loli.net/2025/07/13/VaqknoJD9ZlAvtN.png)

### HashTable
HashTable是Java早期提供的线程安全哈希表实现（JDK 1.0），但设计过时、性能差，所有操作锁整个表，高并发时性能急剧下降，而HashMap是非线程安全的现代实现，非高并发场景推荐使用HashMap，高并发场景则推荐使用性能更高的ConcurrentHashMap。
![image.png](https://s2.loli.net/2025/07/13/ZHlVcnBoKd7DmrO.png)

### ConcurrentHaMap
ConcurrentHashMap是Java并发包（java.util.concurrent）中提供的线程安全哈希表，专为高并发场景设计，在 JDK1.7和 JDK1.8中有显著不同的实现。

在JDK1.7中，使用Segment数组 + HashEntry链表实现，通过ReentrantLock实现的分段锁，通过锁住整个Segment的方式实现线程安全，初始化是支持指定Segment个数，初始化之后不支持修改，默认Segment个数为16，即并发度为16。
![ConcurrentHashMap的JDK7底层结构.png](https://s2.loli.net/2025/07/13/GH4BDpKCmkLbgxo.png)

在JDK1.8中，底层数据结构进行了升级优化，废弃Segment方式，改用Node数据+链表/红黑树作为底层数据结构实现，将锁的粒度细化到桶锁，使用CAS+synchronized方式加锁，先CAS尝试修改，修改失败时则对桶使用synchronized加锁，理论上并发度就是桶的数量。
![image.png](https://s2.loli.net/2025/07/13/mT2u6lHDVSIYjok.png)

## 三、微观视角：把源码拆骨剔肉
### 1.JDK1.7 底层实现
在JDK1.7中，ConcurrentHashMap使用分段锁（Segment）技术，将整个哈希表分成多个段（Segment），每个段相当于一个小的Hashtable。每个段有自己的锁，不同段可以并发操作。
```java
final Segment<K,V>[] segments;  // 段数组

static final class Segment<K,V> extends ReentrantLock {
   transient volatile HashEntry<K,V>[] table;  // 每个段内部的哈希表
   // ...
}

static final class HashEntry<K,V> {
    final int hash;
    final K key;
    volatile V value;       // value 用 volatile 保证可见性
    volatile HashEntry<K,V> next; // next 指针也是 volatile
    // ...
}
```
默认并发级别（concurrencyLevel）为16，即默认有16个段（Segment），初始化时支持设置其他值，一旦初始化后，不支持修改。 整表的初始化容量为 16（非单个Segment容量）。其中单个Segment容量的计算公式：
  ```java
int segmentCapacity = initialCapacity / concurrencyLevel;
segmentCapacity = roundUpToPowerOf2(segmentCapacity); // 取不小于结果的2的幂
  ```
由此计算得到每个Segment=1，然后向上取2的幂为2，因此Segment[i]的默认大小为2。 扩容是按Segment独立扩容的，负载因子是0.75，初始容量为2，计算得出初始阈值为1：
  ```java
threshold = (int)(segmentCapacity * loadFactor); // segmentCapacity=2, loadFactor=0.75 → threshold=1
  ```
当插入第一个元素时，size=1≥threshold=1，触发扩容2倍变为4。源码中会检查++count>threshold判断是否需要扩容。

### 2.JDK1.8 底层实现
JDK1.8对ConcurrentHashMap进行了重大改进，移除了分段锁设计，改用CAS+synchronized实现更细粒度的锁。 节点Node的结构与HashEntry类似，但改为泛型设计。
```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    volatile V val;       // val 用 volatile 修饰
    volatile Node<K,V> next; // next 也是 volatile
    // ...
}
```
当哈希冲突时，使用链表 + 红黑树结构（类似HashMap，当链表长度超过阈值（默认为8）时，如果哈希表的容量达到64，则转换为红黑树，否则优先进行扩容）。红黑树节点使用TreeBin作为代理节点，提供线程安全访问，底层实际的红黑树节点还是TreeNode。
```java
static final class TreeBin<K,V> extends Node<K,V> {
    TreeNode<K,V> root;  // 红黑树根节点
    volatile TreeNode<K,V> first; // 链表头（维护双向链表）
    volatile Thread waiter; // 等待线程（读写锁控制）
    // ...
}
```
底层实现通过使用volatile关键字和Unsafe类提供的CAS操作保证原子性。

## 四、核心方法解析
### 1.put方法的执行过程
#### 1.1 JDK1.8 执行过程
```java
public V put(K key, V value) {
    return putVal(key, value, false);
}

final V putVal(K key, V value, boolean onlyIfAbsent) {
    // 1. 检查 key/value 是否为 null（ConcurrentHashMap 不允许 null 键值）
    if (key == null || value == null) throw new NullPointerException();
    
    // 2. 计算哈希值（扰动函数 + 强制正数）
    int hash = spread(key.hashCode()); // (h ^ (h >>> 16)) & 0x7fffffff
    int binCount = 0; // 记录链表长度（用于树化判断）
    // ...
}
```
**表初始化检查**：如果表为空，则`initTable()`初始化表，通过`CAS`保证线程安全。
  ```java
  for (Node<K,V>[] tab = table;;) {
      Node<K,V> f; int n, i, fh;
      // 1. 表为空则初始化（CAS 保证线程安全）
      if (tab == null || (n = tab.length) == 0)
          tab = initTable(); // 内部使用 sizeCtl 控制并发初始化
      // ...
  }
  ```
**定位桶并尝试无锁插入**：先通过`Unsafe.getObjectVolatile`原子读取桶头节点，通过`CAS`（也是`Unsafe`类方法）尝试插入，失败时继续循环。
  ```java
  else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
      // 1. 桶为空时，直接 CAS 插入新节点
      if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))
          break; // 插入成功则退出循环
  }
  ```
**处理哈希冲突（锁细化控制）**：仅锁定冲突桶的头节点（`synchronized(f)`），其他桶仍可访问，并二次检查桶的头节点，防止加锁期间发生扩容修改。当链表长度≥8时触发转化红黑树，若表容量小于64则优先扩容，避免过早树化。
**协助扩容与计数更新**：遇到`MOVED`节点时，当前线程协助迁移数据（即多线程并行加速扩容）；通过使用`countercell[]`分段计数方式，避免单一`baseCount`的`CAS`竞争问题。
  ```java
  // 1. 检测到扩容中（ForwardingNode 标记）
  else if ((fh = f.hash) == MOVED) // MOVED = -1
      tab = helpTransfer(tab, f); // 协助数据迁移

  // 2. 更新元素计数（CAS + 分段计数）
  addCount(1L, binCount);
  ```

#### 1.2 JDK1.7 执行过程

**计算段位置**：首先计算key的hash值，然后根据hash值确定应该放在哪个Segment中。
```java
// 当前segmentShift的值为32-4=28，segmentMask为16-1=15
Segment<K,V> segment = segments[(hash >>> segmentShift) & segmentMask];
```
**获取段锁**：尝试获取该Segment的锁（可重入锁），如果获取失败，线程会阻塞等待。

**段内操作**：获取锁后，在Segment内部的HashEntry数组上进行操作。先是计算桶位置，然后遍历链表查找是否已存在相同 key，如果存在，更新 value，如果不存在，采用头插法插入新节点。
```java
int index = (tab.length - 1) & hash;
```

**检查扩容**：检查是否需要扩容（超过阈值），扩容时只扩容当前Segment的HashEntry数组。

**释放锁**：操作完成后释放Segment锁。

**伪代码实现**：
```java
public V put(K key, V value) {
   Segment<K,V> s;
   // 1. 计算 hash
   int hash = hash(key);
   // 2. 找到对应的 Segment
   int j = (hash >>> segmentShift) & segmentMask;
   s = ensureSegment(j);
   // 3. 调用 Segment 的 put 方法
   return s.put(key, hash, value, false);
}

// Segment 内部的 put 方法
final V put(K key, int hash, V value, boolean onlyIfAbsent) {
   // 加锁
   HashEntry<K,V> node = tryLock() ? null : scanAndLockForPut(key, hash, value);
   try {
       // 在锁保护下操作
       HashEntry<K,V>[] tab = table;
       int index = (tab.length - 1) & hash;
       HashEntry<K,V> first = entryAt(tab, index);
       // 遍历链表...
       // 插入或更新...
       // 检查扩容...
   } finally {
       unlock(); // 释放锁
   }
}
```

### 2.get方法的执行过程

get()操作是无锁的，依赖`volatile`和`final`语义来保证线程安全。

```java
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    // 1. 计算哈希
    int h = spread(key.hashCode());
    
    // 2. 定位桶位置（volatile 读取）
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {
        
        // 3. 检查桶头节点
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                return e.val; // 直接匹配头节点
        }
        
        // 4. 特殊节点处理
        else if (eh < 0) 
            return (p = e.find(h, key)) != null ? p.val : null;
        
        // 5. 遍历链表
        while ((e = e.next) != null) {
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
    return null; // 未找到
}
```

**关键设计**：
- 通过`Unsafe.getObjectVolatile()`实现原子读（`tabAt()`）。
- `Node.val`和`Node.next`用`volatile`修饰保证可见性。
- 遇到`ForwardingNode`（`hash=MOVED`）时调用其`find()`方法自动跳转到新表。

### 3.size方法的执行过程

Java 8 中使用一个`volatile`变量`baseCount`和`CounterCell`数组来统计元素数量，通过`CAS`更新，避免了锁的使用。`size()`不保证强一致性，采用分治统计优化并发性能。

```java
public int size() {
    long n = sumCount(); // 实际统计方法
    return (n < 0L) ? 0 : (n > Integer.MAX_VALUE) ? Integer.MAX_VALUE : (int)n;
}

final long sumCount() {
    CounterCell[] as = counterCells;
    long sum = baseCount;
    if (as != null) {
        for (CounterCell a : as) {
            if (a != null)
                sum += a.value; // 累加所有分片
        }
    }
    return sum;
}
```

### 4.计数更新机制（在 addCount() 中）

**4.1 优先尝试 CAS 更新 baseCount**：
```java
if (U.compareAndSwapLong(this, BASECOUNT, s = baseCount, s + x))
   return;
```
**4.2 竞争时初始化/更新 CounterCell**： 线程通过哈希（`ThreadLocalRandom.getProbe()`）定位自己的CounterCell槽位，然后通过`CAS`更新所属槽位的值：
```java
if (cellsBusy == 0 && counterCells == as &&
   U.compareAndSwapInt(this, CELLSBUSY, 0, 1)) {
   try {
       // 扩容或初始化 CounterCell 数组
   } finally {
       cellsBusy = 0;
   }
}
```
**4.3 动态扩容CounterCell数组**：当检测到冲突频繁时，通过`CELLSBUSY`锁双倍扩容数组。

## 五、扩容机制要点对比

### 1.JDK1.7 扩容机制

#### 1.1 核心特点

- **分段扩容**：每个 Segment 独立扩容，不影响其他 Segment。
- **单线程扩容**：每个 Segment 的扩容由持有该 Segment 锁的线程完成。
- **扩容时机**：当单个 Segment 中的元素数量超过 `容量 × 负载因子`。

#### 1.2 扩容流程

1. 创建一个新的 HashEntry 数组，大小为原来的 2 倍。
2. 重新计算所有元素在新数组中的位置。
3. 将旧数组中的元素迁移到新数组。
4. 用新数组替换旧数组。

#### 1.3 关键代码片段

```java
// Segment 内部的 rehash 方法
void rehash() {
   HashEntry<K,V>[] oldTable = table;
   int oldCapacity = oldTable.length;
   if (oldCapacity >= MAXIMUM_CAPACITY)
       return;
   
   // 新数组是原数组大小的 2 倍
   HashEntry<K,V>[] newTable = HashEntry.newArray(oldCapacity<<1);
   threshold = (int)(newTable.length * loadFactor);
   // ...迁移数据...
   table = newTable;
}
```

### 2.JDK1.8扩容机制

#### 2.1 核心特点

- **整体扩容**：整个哈希表一起扩容。
- **多线程协同**：多个线程可以共同参与扩容。
- **渐进式迁移**：不需要一次性完成所有数据迁移。
- **扩容时机**：当元素总数超过 `容量 × 负载因子` 或链表长度≥8但表容量<64。

#### 2.2 扩容流程

1. 创建新数组（大小为原数组 2 倍）。
2. 分配迁移任务给多个线程（每个线程负责一个桶区间）。
3. 迁移时对每个桶加锁（`synchronized`）。
4. 使用 `ForwardingNode` 标记已迁移的桶。
5. 迁移完成后替换旧数组。

#### 2.3 关键优化
- **并发迁移**：通过 `transferIndex` 和 `sizeCtl` 协调多线程扩容。
- **无锁化任务分配**：使用 `CAS` 操作分配迁移任务。
- **扩容期间读写不阻塞**：读操作可以访问新旧表，写操作协助迁移。

## 六、Hash值计算

### 1.JDK1.7 的Hash计算
```java
private int hash(Object k) {
   int h = k.hashCode();
   h += (h << 15) ^ 0xffffcd7d;
   h ^= (h >>> 10);
   h += (h << 3);
   h ^= (h >>> 6);
   h += (h << 2) + (h << 14);
   return h ^ (h >>> 16);
}
```
#### 核心设计点分析
1. **多次位运算**：通过多次位移和异或操作，使哈希值更分散，减少冲突。
2. **无扰动优化**：虽然计算复杂，但未采用类似 `HashMap` 的 **扰动函数**（如 `hash ^ (hash >>> 16)`）。
3. **分段锁依赖**：由于 JDK 7 采用 Segment 分段锁，哈希计算主要用于确定 Segment 索引和 HashEntry 数组索引。

### 2.JDK 8 的 Hash 计算

```java
static final int spread(int h) {
   return (h ^ (h >>> 16)) & 0x7fffffff;
}
```
#### 核心设计点分析：
1. **扰动优化**：采用`h ^ (h >>> 16)`（类似 `HashMap`），使高位参与运算，减少哈希冲突。`& 0x7fffffff` 确保结果为正数（因为 `ConcurrentHashMap` 的桶索引不能为负）。
2. **更简单高效**：相比JDK1.7的复杂位运算，JDK1.8的计算更简洁，性能更高。
3. **适应新结构**：JDK1.8改用数组+链表/红黑树结构，不再依赖Segment分段锁，而是使用`CAS`+`synchronized`优化并发性能。

### 3.为什么JDK1.8优化Hash计算？

1. **减少计算开销**：JDK1.7的多次位运算在并发场景下可能成为性能瓶颈。
2. **适应新结构**：JDK1.8改用红黑树处理冲突，即使哈希冲突稍多，也能保证O(log n) 的查询效率。
3. **CAS友好**：更简单的哈希计算能提高`CAS`（Compare-And-Swap）操作的效率。

## 七、简单使用示例

```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// 线程安全的 put
map.put("key1", 1);

// 线程安全的复合操作
map.compute("key1", (k, v) -> v == null ? 1 : v + 1);

// 线程安全的遍历
map.forEach((k, v) -> System.out.println(k + ": " + v));
```

## 八、适用场景

- 高并发环境下的键值存储。
- 需要线程安全的哈希表且对性能要求较高。
- 替代传统的 `Hashtable` 或 `Collections.synchronizedMap`。

## 九、注意事项

1. 虽然线程安全，但复合操作（如 check-then-act）仍需额外同步。
2. 迭代器是弱一致性的，不保证反映最新的修改。
3. 批量操作（如 `putAll`）不保证原子性。
4. Java 8 后的版本性能优于早期版本。

## 总结

`ConcurrentHashMap`是Java并发编程中的重要工具类，合理使用可以显著提高多线程环境下的程序性能。一句话：ConcurrentHashMap=数组 + 链表/红黑树 + CAS + synchronized + 分段扩容，读写极致并行，锁粒度细到极致。