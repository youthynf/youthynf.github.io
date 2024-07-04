---
date: 2024-07-03
title: EhCache缓存
category: 开发框架
star: true
sticky: true
breadcrumb: false
head:
  - - meta
    - name: keywords
      content: EhCache, EhCache详解, EhCache缓存实战应用, EhCache缓存教程
  - - meta
    - name: description
      content: 本文主要介绍EhCache缓存的基本使用，帮助大家快速实现EhCache入门。
---

# EhCache缓存

## 一、EhCache介绍

在查询数据的时候，数据大多来自数据库，咱们会基于SQL语句的方式与数据库交互，数据库一般会基于本地磁盘IO的形式将数据读取到内存，返回给Java服务端，Java服务端再将数据响应给客户端，做数据展示。

但是MySQL这种关系型数据库在查询数据时，相对比较慢，因为有磁盘IO，有时没命中索引还需要全盘扫描。在针对一些热点数据时，如果完全采用MySQL，会存在俩问题。第一个MySQL相对很脆弱，肯能会崩，第二个MySQL查询效率慢。会采用缓存。

而缓存分为很多种，相对服务端的角度来说大致分为两种，一种JVM缓存（堆内缓存），另一种是堆外缓存（操作系统的内存中、Redis跨服务的缓存）

Redis不用说太多，Redis基于内存读写，效率很高，而且Redis服务的并发能力很强。毕竟Redis是另一个服务，需要通过网络IO的形式去查询数据。不过一般分布式微服务的缓存首选还是Redis。

但是单体项目，想把缓存的性能提升的比Redis还要快，选择JVM缓存了，一般框架自带的缓存机制，比如Hibernate缓存，MyBatis也有一级缓存和二级缓存。

**为什么DAO层框架已经提供了缓存的概念，为什么要搞EhCache：**

因为DAO层框架的缓存是在Mapper层触发的，EhCache可以将缓存提到Service层触发。效率肯定会有提升

并且EhCache提供了非常丰富的功能，不但可以将数据存储在JVM内部，还可以放到堆外，甚至还可以存储到本地磁盘。

## 二、EhCache基本使用

EhCache的官网：http://www.ehcache.org

EhCache明显开源的，EhCache可以几乎0成本和Spring整合，配合Java规范，直接采用Cache注解实现缓存

@Cacheable这个是Java的规范，Spring集成了这个规范默认整合Redis，不过也可以整合EhCache

EhCache官方有两大版本，分别是2.x和3.x的版本，这里选择3.x版本去玩，可以更好的以SpringBoot的形式去集成到一起使用

先单独使用EhCache查看效果

EhCache快速入门

导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.ehcache</groupId>
        <artifactId>ehcache</artifactId>
        <version>3.8.1</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```

入门操作

```java
@Test
public void test(){
    //1. 初始化好CacheManager
    CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder()
            // 一个CacheManager可以管理多个Cache
            .withCache(
                    "singleDog",
                    CacheConfigurationBuilder.newCacheConfigurationBuilder(
                            String.class,
                            Object.class,
                            // heap相当于设置数据在堆内存中存储的 个数 或者 大小
                            ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10).build()).build()
            ).build(true);
//        cacheManager.init();

    //2. 基于CacheManager回去到Cache对象
    Cache<String, Object> cache = cacheManager.getCache("singleDog", String.class, Object.class);

    //3. 存  set/put/add/
    cache.put("ehcache","57个单身狗！！");

    //4. 取
    System.out.println(cache.get("ehcache"));
}
```

## 三、EhCache配置

EhCache提供很多丰富的配置，其中有两个是很重要的。

### 3.1 数据存储位置

EhCache3.x版本中不但提供了堆内缓存heap，还提供了堆外缓存off-heap，并且还提供了数据的持久化操作，可以将数据落到磁盘中disk。

**heap堆内内存存储**

heap表示使用堆内内存：

* heap(10)代表当前Cache最多只能存储10个数据，当你put第11个数据时，第一个数据就会被移除。
* heap(10,大小单位MB)代表当前Cache最多只能存储10MB数据。

**off-heap堆外内存**

off-heap是将存储的数据放到操作系统的一块内存区域存储，不是JVM内部，这块空间属于RAM。这种对象是不能直接拿到JVM中使用的，在存储时，需要对数据进行序列化操作，同时获取出来的时候也要做反序列化操作。

**disk落到磁盘**

disk表将数据落到本地磁盘，这样的话，当服务重启后，依然会从磁盘反序列化数据到内存中。

EhCache提供了三种组合方式：

* heap + off-heap
* heap + disk
* heap + off-heap + disk

![EhCache缓存方式](https://s2.loli.net/2024/07/05/ACndYweQUy7sVlu.png)

在组合情况下存储，存储数据时，数据先落到堆内内存，同时同步到对外内存以及本地磁盘。本地底盘因为空间充裕，所以本地磁盘数据是最全的。而且EhCache要求空间大小必须disk > off-heap > heap。

在组合情况下读取，因为性能原型，肯定是先找heap查询数据，没有数据去off-heap查询数据，off-heap没有数据再去disk中读取数据，同时读取数据之后，可以将数据一次同步到off-heap、heap

通过API实现组合存储方式：

```java
@Test
public void test(){
    //0. 声明存储位置
    String path = "D:\\ehcache";
    //1. 初始化好CacheManager
    CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder()
            // 设置disk存储的位置
            .with(CacheManagerBuilder.persistence(path))
            .withCache(
                    "singleDog",
                    CacheConfigurationBuilder.newCacheConfigurationBuilder(
                            String.class,
                            String.class,
                            ResourcePoolsBuilder.newResourcePoolsBuilder()
                                    .heap(10)
                                    // 堆外内存
                                    .offheap(10, MemoryUnit.MB)
                                    // 磁盘存储,记得添加true，才能正常的持久化，并且序列化以及反序列化
                                    .disk(11,MemoryUnit.MB, true)
                                    .build()
                    ).build()
            ).build(true);

    //2. 基于CacheManager回去到Cache对象
    Cache<String, String> cache = cacheManager.getCache("singleDog", String.class, String.class);

    //3. 存
//        cache.put("singleDog","29个单身狗！！");

    //4. 取
    System.out.println(cache.get("singleDog"));

    //5. 保证数据正常持久化不丢失，记得cacheManager.close();
    cacheManager.close();
}
```

本地磁盘存储的方式，一共有三个文件

* mata：元数据存储，记录这当前cache的key类型和value类型
* data：存储具体数据的位置，将数据序列化成字节存储
* index：类似索引，帮助查看数据的。

### 3.2 数据生存时间

因为数据如果一致存放在内存当中，可能会出现内存泄漏等问题，数据在内存，一致不用，还占着空间

EhCache提供了对数据设置生存时间的机制

提供了三种机制：

* noExpiration：不设置生存时间
* timeToLiveExpiration：从数据落到缓存计算生存时间
* timeToIdleExpiration：从最后一个get计算生存时间

```java
@Test
public void test() throws InterruptedException {
    //1. 初始化好CacheManager
    CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder()
            .withCache(
                    "singleDog",
                    CacheConfigurationBuilder.newCacheConfigurationBuilder(
                            String.class,
                            Object.class,
                            ResourcePoolsBuilder.newResourcePoolsBuilder().heap(10).build())
                            // 三选一。
                            // 不设置生存时间
//                                .withExpiry(ExpiryPolicy.NO_EXPIRY)
                            // 设置生存时间，从存储开始计算
//                                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMillis(1000)))
                            // 设置生存时间，每次获取数据后，重置生存时间
                            .withExpiry(ExpiryPolicyBuilder.timeToIdleExpiration(Duration.ofMillis(1000)))
                            .build()
            ).build(true);

    Cache<String, Object> cache = cacheManager.getCache("singleDog", String.class, Object.class);

    cache.put("ehcache","24个单身狗！！");
    System.out.println(cache.get("ehcache"));
    Thread.sleep(500);
    cache.get("ehcache");
    Thread.sleep(500);
    System.out.println(cache.get("ehcache"));
}
```

## 四、SpringBoot整合EhCache

SpringBoot默认情况下是整合了EhCache的，但是SPringBoot整合的EhCache的2.x版本。

这里依然整合EhCache的3.x版本。

### 4.1 构建SpringBoot工程

阿巴阿巴

### 4.2 导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.ehcache</groupId>
        <artifactId>ehcache</artifactId>
        <version>3.8.1</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
</dependencies>
```

### 4.3 准备EhCache的配置项

```yml
# 准备EhCache基础配置项
ehcache:
  heap: 1000           # 堆内内存缓存个数
  off-heap: 10         # 对外内存存储大小 MB
  disk: 20             # 磁盘存储数据大小  MB
  diskDir: D:/data/    # 磁盘存储路径
  cacheNames:          # 基于CacheManager构建多少个缓存
    - user
    - item
    - card
```

引入配置文件中的配置项

```java
@Component
@ConfigurationProperties(prefix = "ehcache")
public class EhCacheProps {

    private int heap;

    private int offheap;

    private int disk;

    private String diskDir;

    private Set<String> cacheNames;

}
```

### 4.4 配置CachaManager

```java
@Configuration
@EnableCaching
public class EhCacheConfig {

    @Autowired
    private EhCacheProps ehCacheProps;

    @Bean
    public CacheManager ehCacheManager(){
        //1. 缓存名称
        Set<String> cacheNames = ehCacheProps.getCacheNames();

        //2. 设置内存存储位置和数量大小
        ResourcePools resourcePools = ResourcePoolsBuilder.newResourcePoolsBuilder()
                .heap(ehCacheProps.getHeap())
                .offheap(ehCacheProps.getOffheap(), MemoryUnit.MB)
                .disk(ehCacheProps.getDisk(),MemoryUnit.MB)
                .build();

        //3. 设置生存时间
        ExpiryPolicy expiry = ExpiryPolicyBuilder.noExpiration();

        //4. 设置CacheConfiguration
  		// baseObject是一个POJO类实现了序列化接口
        CacheConfiguration cacheConfiguration = CacheConfigurationBuilder
                .newCacheConfigurationBuilder(String.class, BaseObject.class, resourcePools)
                .withExpiry(expiry)
                .build();

        //5. 设置磁盘存储的位置
        CacheManagerBuilder<PersistentCacheManager> cacheManagerBuilder =
                CacheManagerBuilder.newCacheManagerBuilder().with(CacheManagerBuilder.persistence(ehCacheProps.getDiskDir()));

        //6. 缓存名称设置好。
        for (String cacheName : cacheNames) {
            cacheManagerBuilder.withCache(cacheName,cacheConfiguration);
        }

        //7. 构建
        return cacheManagerBuilder.build();
    }
}
```

## 五、Cache注解使用

Cache注解是JSR规范中的，Spring支持这种注解。前面配置好关于CacheManager之后，就可以在Service层添加Cache注解，实现缓存使用，缓存更新，缓存清除。

### 5.1 @Cacheable

#### 5.1.1 基本使用

这个是查询缓存的注解，**可以加载方法上**，也可以加在类上（不要添加在类上，这样很多细粒度配置就无法实现，比如@Transactional），可以在执行当前方法前，根据注解查看方法的返回内容是否已经被缓存，如果已经缓存，不需要执行业务代码，直接返回数据。如果没有命中缓存，正常执行业务代码，在执行完毕后，会将返回结果作为缓存，存储起来。

直接在Service层的方法上添加@Cacheable，注意，必须填写@Cacheable中的**value或者cacheName属性**

默认情况下，每次查询会基于Key（默认是方法的参数）去查看是否命中缓存

* 如果命中缓存，直接返回
* 如果未命中缓存，正常执行业务代码，基于方法返回结果做缓存

#### 5.1.2 key的声明方式

key的声明方式有两种，一种是基于Spring的Expression Language去实现，另一种是基于编写类的方式动态的生成key

##### 5.1.2.1 Spel表达式语言实现

```java
@Override
@Cacheable(cacheNames = {"item"},key = "#id")    // 123
public String echo(String id,String... args) {
    System.out.println("查询数据库~");
    // itemMapper.findById(id);
    return id;
}
```

这种方式要基于Spel实现，但是Spel用的不过，单独为了这种操作熟悉Spel成本蛮高的，而且功能并不丰富，所以更推荐第二种方式，编写类的方式设置key的生成策略

##### 5.1.2.2 KeyGenerator实现

这种方式需要在Spring容器中构建KeyGenerator实现类，基于注解配置进去即可

设置key的生成策略。

```java
@Configuration
public class CacheKeyGenerator {

    @Bean(name = "itemKeyGenerator")
    public KeyGenerator itemKeyGenerator(){
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... params) {
                return method.getName() + params[0];
            }
        };
    }
}

```

设置bean name到keyGenerator中

```java
@Override
@Cacheable(cacheNames = {"item"},keyGenerator = "itemKeyGenerator")   
public String echo(String id,String... args) {
    System.out.println("查询数据库~");
    // itemMapper.findById(id);
    return id;
}
```

#### 5.1.3 缓存条件

在执行方法前后，判断当前数据是否需要缓存，所以一般基础参数的判断。

* 条件为true代表缓存（condition）
* 条件为false代表缓存（unless）

都可以基于Spel编写条件表达式

##### 5.1.3.1 condition

在执行方法前，决定是否需要缓存

可以在condition中编写Spel，只要条件为true，既代表当前数据可以缓存

```java
@Override
@Cacheable(cacheNames = {"item"},condition = "#id.equals(\"123\")")
public String echo(String id) {
    System.out.println("查询数据库~");
    // itemMapper.findById(id);
    return id;
}
```

##### 5.1.3.2 unless

执行方法之后，决定是否需要缓存

unless也可以编写Spel，条件为false时，代表数据可以缓存，如果为true，代表数据不需要缓存

```java
@Override
@Cacheable(cacheNames = {"item"},unless = "#result.equals(\"123\")")
public String echo(String id) {
    System.out.println("查询数据库~");
    // itemMapper.findById(id);
    return id;
}
```

更多的其实还是在执行查询前，来判断数据是否需要缓存。如果真的需要做，也是避免诡异的操作。

比如Service在出现异常结果时，返回-1，那么这种-1，就不需要缓存。

##### 5.1.3.3 condition&unless的优先级

condition和unless都是代表是都需要缓存数据。

如果同时设置condition和unless。

* condition，unless
* true，false：都代表缓存，那就缓存喽。
* true，true：unless代表不缓存，那就不缓存
* false，false：condition代表不缓存数据，那就不缓存
* false，true：都不让缓存， 那就不缓存

condition和unless没有优先级之分，他的优先级在于，不缓存的优先级高于缓存。

#### 5.2.4 sync

缓存击穿问题。

当多个线程并发访问一个Service方法时，发现当前方法没有缓存数据，此时会让一个线程去执行业务代码查询数据，扔到缓存中，后面线程再查询缓存

可以设置sync属性为true，代表当执行Service方法时，发现缓存没数据，那么就需要去竞争锁资源去执行业务代码，后续线程等待前置线程执行完，再去直接查询缓存即可

```java
@Override
@Cacheable(cacheNames = {"item"},sync = true)
public String echo(String id) {
    System.out.println("查询数据库~");
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return id;
}
```

### 5.2 @CachePut

@CachePut注解巨简单，是在写数据之后，更新缓存的数据

在增删改的操作上追加@CachePut注解，会根据key去重置指定的缓存。

细节点就在于对标上查询方法的key

```java
@Override
@CachePut(cacheNames = "item",key = "#item.id")
public String write(Item item) {
    // 写id为123的数据
    System.out.println("123被改成456");
    return "456";
}
```

@Cacheable其他的属性，和@Cacheable一模一样~~~

### 5.3 @CacheEvict

@CacheEvict是用来清楚缓存的，可以根据注解里的cacheNames和key来清除指定缓存，也可以清除整个cacheNames中的全部缓存

清除指定缓存

```java
@Override
@CacheEvict(value = "item")
public void clear(String id) {
    System.out.println("清除缓存成功！");
}
```

清除全部缓存

```java
@Override
@CacheEvict(value = "item",allEntries = true)
public void clearAll() {
    System.out.println("清除item中的全部缓存~！");
}
```

如果执行清除缓存过程中，业务代码出现异常，会导致无法正常清除缓存，可以设置一个属性来保证在方法业务执行之前，就将缓存正常清除beforeInvocation设置为true

```java
@Override
@CacheEvict(value = "item",allEntries = true,beforeInvocation = true)
public void clearAll() {
    int i = 1 / 0;
    System.out.println("方法执行前，清除item中的全部缓存~！");
}
```

### 5.4 @Caching

没啥说的，一个组合数据，可以基于Caching实现@Cacheable，@CachePut以及@CacheEvict三个注解

以上是本文[【EhCache缓存】](http://localhost:8080/framework/EhCache.html)的全部内容，最新更新会第一时间同步在公众号，推荐关注！

![YouthYnf官方公众号](https://s2.loli.net/2024/07/02/xGYtNbnS4UE5dsl.png)