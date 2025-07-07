---
title: MyBatis缓存全揭秘
cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2025-06-20
category:
  - MyBatis
star: true
sticky: true
breadcrumb: false
head:
  - - meta
    - name: keywords
      content: MyBatis, Cache
---

你是否曾经有过这样的困惑：同样的代码、同样的数据库，为什么你的 MyBatis 查询速度却比别人慢了整整 3 倍？明明没有对数据进行修改，为何第二次查询时仍然要苦苦请求数据库？线上环境中偶尔出现的“幽灵数据”究竟从何而来？其实，这些问题的答案都隐藏在 MyBatis 那个容易被忽视的 `<cache/>` 标签之中！今天，就让我们深入探究缓存的核心奥秘，破解性能背后的玄学谜题。

## MyBatis缓存架构总览
MyBatis 为了显著提升数据库查询性能，打造了一套极为强大的缓存机制。它采用的是二级缓存架构，有点类似于计算机中的 L1/L2 缓存体系。在我们深入剖析分层缓存的具体细节之前，先从宏观角度了解一下 MyBatis 的二级缓存架构：
![image.png](https://s2.loli.net/2025/07/07/1qcufFkrC6W5EZj.png)

## 一级缓存机制原理
当我们使用 MyBatis 开启一次与数据库的会话时，会通过创建一个 SqlSession 对象来表示。如果在同一个 SqlSession 会话中反复执行完全相同的查询语句，而没有采取任何额外措施，那么每一次查询都将直接对数据库发起访问。然而，在短时间内重复执行完全相同的查询，得到的结果极有可能完全一致。由于查询数据库的代价相当大，这无疑会造成巨大的资源浪费。为了解决这一问题，减少不必要的资源消耗，MyBatis 实现了一级缓存机制，如下：
![image.png](https://s2.loli.net/2025/07/07/Y8vZAiTSF5DzxLJ.png)

如图所示，一个 SqlSession 对象内部会创建一个本地缓存（local cache）。对于每一次查询，系统都会尝试根据查询条件在本地缓存中查找是否存在相应的结果，如果在缓存中找到了，就会直接从缓存中取出数据并返回给用户；反之，如果缓存中没有，则从数据库读取数据，将查询结果存入缓存后再返回给用户。

实际上，SqlSession 仅仅是 MyBatis 对外提供的一个接口，它将具体的工作交给了 Executor 执行器来完成，而 Executor 负责执行对数据库的各种操作。当创建了一个 SqlSession 对象时，MyBatis 会为这个 SqlSession 对象创建一个新的 Executor 执行器，缓存信息正是在这个 Executor 执行器中得以维护。MyBatis 将缓存以及与缓存相关的操作封装成了 Cache 接口。SqlSession、Executor、Cache 之间的关系如下列类图所示：
![image.png](https://s2.loli.net/2025/07/07/ulqmBri5teECOcY.png)

从关系图中可以看出，Executor 接口的实现类 BaseExecutor 中包含了一个 Cache 接口的实现类 PerpetualCache。对于 BaseExecutor 对象而言，它会利用 PerpetualCache 对象来维护缓存。而 PerpetualCache 的实现原理其实非常简单，它通过内部维护一个普通的 HashMap<k, v> 来实现，没有任何其他限制。

当会话结束时，SqlSession 对象及其内部的 Executor 对象以及 PerpetualCache 对象都会被一并释放掉。此外，还有SqlSession也提供了一些方法执行缓存清理操作：

- close() ：会释放掉一级缓存 PerpetualCache 对象，一级缓存将不再可用；
- clearCache() ：会清空 PerpetualCache 对象中的数据，但该对象仍然可以继续使用； 
- update 操作（如 update()、delete()、insert()）：会清空 PerpetualCache 对象的数据，不过该对象依然可以继续使用。

我们知道，Cache 最核心的实现就是一个 Map，它将本次查询使用的特征值作为 key，将查询结果作为 value 存储到 Map 中。现在，最关键的问题来了：如何确定相同查询的特征值呢？MyBatis 认为，对于两次查询，如果以下条件都完全一致，那么就认为它们是完全相同的两次查询：
- 传入的 statementId
- 查询时要求的结果集中的结果范围（结果范围通过 rowBounds.offset 和 rowBounds.limit 表示） 
- 这次查询所产生的最终要传递给 JDBC java.sql.PreparedStatement 的 Sql 语句字符串（boundSql.getSql()） 
- 传递给 java.sql.Statement 要设置的参数值

以上就是 MyBatis 一级缓存的一些基本实现机制。接下来，我们来探讨二级缓存。

## 二级缓存机制原理

通过前文的介绍，我们了解到 MyBatis 一级缓存是基于 SqlSession 级别的。而 MyBatis 的二级缓存则是跨 SqlSession 共享的全局缓存，可以视为 Application 级别的缓存。它能够显著提高对数据库查询的效率，进而提升应用的整体性能。

如果用户在全局 XML 配置文件中配置了“cacheEnabled=true”，那么 MyBatis 在为 SqlSession 对象创建 Executor 对象时，会对 Executor 对象添加一个装饰者：CachingExecutor。此时，SqlSession 会使用 CachingExecutor 对象来完成操作请求。CachingExecutor 对于查询请求，会先判断该查询请求在 Application 级别的二级缓存中是否有缓存结果。如果有查询结果，则直接返回缓存结果；如果缓存中没有，再交给真正的 Executor 对象来完成查询操作。之后，CachingExecutor 会将真正 Executor 返回的查询结果放置到缓存中，然后再返回给用户。

![image.png](https://s2.loli.net/2025/07/07/aZfeknHxSvbsDzV.png)

CachingExecutor 是 Executor 的装饰者，它通过增强 Executor 的功能，使其具备缓存查询的能力。这里巧妙地运用了设计模式中的装饰者模式。

MyBatis 并不是简单地为整个 Application 只设置一个 Cache 缓存对象，而是将缓存划分得更为细致，即按照 Mapper 级别进行划分。也就是说，每一个 Mapper 都可以拥有一个 Cache 对象。它支持为每一个 Mapper 分配一个 Cache 缓存对象（通过 `<cache>` 节点配置），同时也支持多个 Mapper 共用一个 Cache 缓存对象（通过 `<cache-ref>` 节点配置）。

![image.png](https://s2.loli.net/2025/07/07/2tNCahIJYPG9mKX.png)

MyBatis 对二级缓存的支持粒度非常精细，它能够指定某一条查询语句是否使用二级缓存。尽管在 Mapper 中配置了 `<cache>`，并且为此 Mapper 分配了 Cache 对象，但还必须指定 Mapper 中的某条 select 语句是否支持缓存。具体来说，需要在 `<select>` 节点中配置 useCache="true"，Mapper 才会对这条 Select 的查询支持缓存特性。否则，这条 Select 查询不会经过 Cache 缓存。因此，二级缓存生效的条件包括：

- MyBatis 支持二级缓存的总开关：全局配置变量参数 cacheEnabled=true 
- 该 select 语句所在的 Mapper，配置了 `<cache>` 或 `<cached-ref>` 节点，并且配置有效
- 该 select 语句的参数 useCache=true

如果你的 MyBatis 使用了二级缓存，并且你的 Mapper 和 select 语句也配置了使用二级缓存，那么在执行 select 查询的时候，MyBatis 会先从二级缓存中查找数据，其次才是一级缓存，即 MyBatis 查询数据的顺序是：二级缓存 → 一级缓存 → 数据库。

MyBatis 对二级缓存的设计极为灵活。它自身内部实现了一系列的 Cache 缓存实现类，并且提供了各种缓存刷新策略，如 LRU、FIFO 等等。除此之外，MyBatis 还允许用户自定义 Cache 接口实现。用户只需实现 org.apache.ibatis.cache.Cache 接口，然后将 Cache 实现类配置在 `<cache type="">` 节点的 type 属性上即可。此外，MyBatis 还支持与第三方内存缓存库（如 Memcached）进行集成。总的来说，使用 MyBatis 的二级缓存有以下三种选择：
- 使用 MyBatis 自身提供的缓存实现； 
- 使用用户自定义的 Cache 接口实现； 
- 与第三方内存缓存库进行集成。
  ![image.png](https://s2.loli.net/2025/07/07/IAaSHf5YxUgCG31.png)

这里有个容易忽略的点，就是一个 Mapper 中定义的增删改查操作只能影响到自己关联的 Cache 对象。对于其他 Mapper 来说，如果它们存在join连表查询时，并且开启了二级缓存，那么当当前 Mapper 对表进行更新（如 update、delete、insert）操作后，其他 Mapper 可能拿到的仍然是缓存中的数据，而并非最新数据。最理想的解决方式是：对于某些表执行了更新操作后，去清空与这些指定表有关联的查询语句所造成的缓存。这样，就可以以非常细的粒度来管理 MyBatis 内部的缓存，从而大大提高缓存的使用率和准确率。

到此，MyBatis二级缓存的机制原理也介绍的差不多了。

## 总结

最后，当我们再次回顾MyBatis二级缓存架构设计时，是否已会有几分熟悉感。
![image.png](https://s2.loli.net/2025/07/07/1qcufFkrC6W5EZj.png)
MyBatis 缓存架构的精妙之处在于其分层设计，这种设计形成了高效的查询屏障。它不仅支持多种缓存实现，还支持针对不同场景进行精细化的定制策略。

希望通过本文对MyBatis二级缓存的解析，能帮助大家更好地理解其运作机制。如果内容对您有所启发，或者发现任何需要修正的地方，都欢迎留言讨论～。