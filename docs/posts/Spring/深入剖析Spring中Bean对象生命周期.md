---
title: 深入剖析Spring中Bean对象生命周期
cover: /assets/images/cover2.jpg
icon: creative
date: 2025-07-11
category:
  - Spring
description: 作为Java开发者最熟悉的框架，Spring的核心就是Bean的管理。但你真的了解一个Bean从创建到销毁的完整生命周期吗？本文将带你深入Spring内部，完整解析Bean生命周期的每个关键阶段！
star: true
sticky: false
breadcrumb: false
head:
  - - meta
    - name: keywords
      content: Spring, Bean
---

# 深入剖析Spring Bean生命周期：从诞生到消亡的全过程

作为Java开发者最熟悉的框架，Spring的核心就是Bean的管理。但你真的了解一个Bean从创建到销毁的完整生命周期吗？本文将带你深入Spring内部，完整解析Bean生命周期的每个关键阶段！

## 一、容器启动阶段：Bean的"孕育期"

### 1. Bean定义加载
Spring容器启动时，会读取所有配置源，获取Bean的定义信息，为Bean信息的注册做准备：
```java
// 配置来源示例
@Configuration
public class AppConfig {
    @Bean(initMethod = "init", destroyMethod = "cleanup")
    public MyBean myBean() {
        return new MyBean();
    }
}
```
- 支持XML/注解/Java配置三种方式定义Bean对象
- 最终都会解析为BeanDefinition对象

### 2. BeanDefinitionRegistryPostProcessor干预
BeanDefinitionRegistryPostProcessor是Spring框架中比BeanFactoryPostProcessor更强大的扩展点，允许在标准Bean定义加载后、但在Bean实例化前对Bean定义注册表进行更底层的操作。
```java
@Component
public class MyRegistryPostProcessor implements
BeanDefinitionRegistryPostProcessor, PriorityOrdered {
    @Override
    public void postProcessBeanDefinitionRegistry(
            BeanDefinitionRegistry registry) {
        // 动态注册新Bean（如MyBatis的Mapper扫描）
        registry.registerBeanDefinition("dynamicBean", 
            new RootBeanDefinition(DynamicBean.class));
    }
    
    @Override
    public int getOrder() {
        return 0; // 最高优先级
    }
}
```

**典型应用场景：**
- MyBatis的MapperScannerConfigurer，实现自动扫描和注册MyBatis的Mapper接口
- Spring Boot的条件装配（@Conditional），实现自动装配
- 动态注册Bean

**三种控制方式（优先级由高到低）：**
- PriorityOrdered接口：最高优先级
```java
public class MyProcessor implements BeanDefinitionRegistryPostProcessor, PriorityOrdered {
    @Override
    public int getOrder() { return 0; }
}
```
- Ordered接口：中等优先级
```java
public class MyProcessor implements BeanDefinitionRegistryPostProcessor, Ordered {
    @Override
    public int getOrder() { return 100; }
}
```
- 无顺序接口：自然顺序（不保证确定顺序）

### 3. BeanFactoryPostProcessor干预
BeanFactoryPostProcessor是Spring框架中用于在Bean工厂初始化后、Bean实例化前对Bean定义进行修改的扩展点。理解其执行顺序对于解决复杂的Spring配置问题非常重要。
```java
@Component
public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(
            ConfigurableListableBeanFactory beanFactory) {
        BeanDefinition bd = beanFactory.getBeanDefinition("myBean");
        bd.setScope(ConfigurableBeanFactory.SCOPE_PROTOTYPE);
        bd.setLazyInit(true);
    }
}
```
**注意执行顺序：**
1. 实现PriorityOrdered接口的处理器，优先级最高
2. 实现Ordered接口的处理器，优先级次之
3. 常规处理器，最后执行

对于同级别处理器按 getOrder()返回值排序（值越小优先级越高），当未指定顺序时，执行顺序不确定。

## 二、实例化阶段：Bean的"出生"

### 4. InstantiationAwareBeanPostProcessor前置处理
InstantiationAwareBeanPostProcessor是Spring容器中功能强大的扩展接口，允许在Bean实例化前后进行拦截和处理。其前置处理能力为开发者提供了在Bean生命周期早期介入的机会。
```java
@Component
public class MyInstantiationProcessor implements
InstantiationAwareBeanPostProcessor {

    @Override
    public Object postProcessBeforeInstantiation(
            Class<?> beanClass, String beanName) {
        if ("myService".equals(beanName)) {
            return Proxy.newProxyInstance(...); // 返回代理对象
        }
        return null; // 继续默认实例化
    }
}
```

**典型应用：**
- Spring AOP的AbstractAutoProxyCreator，实现自动代理创建的核心抽象类，为 Spring 的声明式事务管理、缓存、安全等 AOP 功能提供了基础支持
- 跳过特定Bean的实例化

### 5. 真正的实例化过程
通过以下方式创建实例：
- 构造函数反射（最常见）
- 静态工厂方法
- 实例工厂方法

此时得到的只是"裸实例"，所有依赖都未注入！

## 三、依赖注入阶段：Bean的"成长"

### 6. InstantiationAwareBeanPostProcessor属性处理
InstantiationAwareBeanPostProcessor在Spring属性处理阶段扮演着关键角色，提供了对依赖注入过程的精细控制。其中postProcessAfterInstantiation后实例化拦截阶段，在对象实例化后（构造函数执行完成），属性注入前执行；而postProcessProperties则是属性值应用前最后修改机会（Spring 5.1+推荐）。
```java
@Override
public boolean postProcessAfterInstantiation(Object bean, String beanName) {
    if (bean instanceof SpecialBean) {
        // 手动设置属性，跳过Spring自动注入
        ((SpecialBean) bean).setSpecialProperty("manual");
        return false; // 阻止后续属性注入
    }
    return true; // 允许正常注入
}

@Override
public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) {
    if (bean instanceof ConfigurableBean) {
        MutablePropertyValues mpvs = (MutablePropertyValues) pvs;
        mpvs.add("timeout", 5000); // 覆盖配置值
    }
    return pvs;
}
```

**典型使用场景：**
- 实现动态属性注入
```java
@Override
public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) {
    if (bean instanceof EnvironmentAwareBean) {
        MutablePropertyValues values = new MutablePropertyValues(pvs);
        values.add("environment", determineRuntimeEnvironment());
        return values;
    }
    return pvs;
}
```
- 属性值的转换
```java
@Override
public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) {
    if (bean instanceof DateFormatBean) {
        MutablePropertyValues mpvs = new MutablePropertyValues(pvs);
        if (mpvs.contains("datePattern")) {
            String pattern = (String) mpvs.get("datePattern");
            mpvs.add("formatter", new SimpleDateFormat(pattern));
        }
        return mpvs;
    }
    return pvs;
}
```
- 条件属性的注入
```java
@Override
public boolean postProcessAfterInstantiation(Object bean, String beanName) {
    if (bean instanceof FeatureToggleBean) {
        // 根据特性开关决定是否注入
        return featureManager.isEnabled("dynamic_injection");
    }
    return true;
}
```

### 7. 依赖注入的完整流程
```java
public class ExampleService {
@Autowired
private UserRepository repository;

    @Value("${app.timeout}")
    private int timeout;
}
```

**注入顺序（优先级从高到低）：**
1. @Autowired字段注入，最先注入
2. @Autowired方法注入，其次注入
3. @Resource注入，随后注入
4. @Value("${app.timeout}")，最后执行的值注入

## 四、Aware接口回调：获取容器"超能力"
Spring 框架中的 Aware 接口是一组特殊的回调接口，允许 Bean 获取容器的基础设施对象。这些回调在 Bean 生命周期的特定阶段执行，为 Bean 提供了与容器交互的能力。
### 完整的Aware接口调用顺序
```java
@Component
public class AllAwareBean implements BeanNameAware, BeanClassLoaderAware,
BeanFactoryAware, EnvironmentAware, ResourceLoaderAware, ApplicationEventPublisherAware, MessageSourceAware, ApplicationContextAware {

    // 按以下顺序调用：
    @Override public void setBeanName(String name) {}
    @Override public void setBeanClassLoader(ClassLoader cl) {}
    @Override public void setBeanFactory(BeanFactory bf) {}
    @Override public void setEnvironment(Environment env) {}
    @Override public void setResourceLoader(ResourceLoader rl) {}
    @Override public void setApplicationEventPublisher(ApplicationEventPublisher aep) {}
    @Override public void setMessageSource(MessageSource ms) {}
    @Override public void setApplicationContext(ApplicationContext ctx) {}
}
```

## 五、初始化阶段：Bean的"成人礼"

### 初始化流程详解
Spring容器中Bean的初始化方法执行可以分为三个层次，依次为@PostConstruct注解方法、实现InitializingBean接口并重写afterPropertiesSet方法、XML中指定自定义的init-method。
```java
@Component
public class InitBean {
    // 1. @PostConstruct（最先执行）
    @PostConstruct
    public void postConstruct() {
        System.out.println("@PostConstruct");
    }

    // 2. InitializingBean接口
    @Override
    public void afterPropertiesSet() {
        System.out.println("InitializingBean");
    }
    
    // 3. 自定义init方法
    public void customInit() {
        System.out.println("custom init");
    }
}
```

### BeanPostProcessor的处理
BeanPostProcessor 是 Spring 框架中最核心的扩展接口之一，为开发者提供了在 Bean 初始化前后进行自定义处理的强大能力。
```java
@Component
public class MyBeanPostProcessor implements BeanPostProcessor, Ordered {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        if (bean instanceof MyBean) {
            System.out.println("BeforeInit: " + beanName);
        }
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        if (bean instanceof MyBean) {
            System.out.println("AfterInit: " + beanName);
            // AOP代理通常在此生成
            return Enhancer.create(...);
        }
        return bean;
    }
    
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
```
**前置处理的典型应用场景：**
- 注解处理（如 @PostConstruct）
- 元数据准备
- 代理预处理

**后置处理的典型应用场景：**
- AOP代理创建
- 包装对象生成
- 最终检查

## 六、使用阶段：Bean的"黄金时期"

此时Bean已经完全初始化：
- 可以通过ApplicationContext.getBean()获取
- 可以被其他Bean正常依赖
- 所有代理都已经生成

## 七、销毁阶段：Bean的"临终关怀"

### 销毁方法执行顺序
Spring 容器中 Bean 的销毁过程是一个与初始化相对应的反向流程，同样遵循严格的执行顺序。优先级从高到低：
1. DestructionAwareBeanPostProcessor 前置处理
```java
public interface DestructionAwareBeanPostProcessor extends BeanPostProcessor {
    void postProcessBeforeDestruction(Object bean, String beanName);
}
```

2. @PreDestroy注解方法（JSR-250标准）
- 最先执行的销毁逻辑
- 适用于任何Spring管理的Bean
- 方法可见性不限（private也可）
```java
@Service
public class OrderService {
    @PreDestroy
    private void cleanup() {
        System.out.println("1. @PreDestroy方法执行");
    }
}
```

3. DisposableBean接口实现
- Spring 原生接口
- 允许抛出检查异常
- 在 @PreDestroy之后执行
```java
public interface DisposableBean {
    void destroy() throws Exception;
}
```

4. 自定义destroy-method

配置方式：
```xml
<bean class="com.example.DataSource" destroy-method="shutdown"/>
```
或
```java
@Bean(destroyMethod = "cleanup")
    public DataSource dataSource() {
    return new HikariDataSource();
}
```

**执行特点：**
- 最后执行的销毁逻辑
- 方法名自由定义
- 适用于 XML 和 Java 配置

### 何时触发销毁？
- 对于单例Bean：在ApplicationContext.close()时
- 对于原型Bean：需要手动调用destroy方法
- 对于request/session作用域：在作用域结束时

## 八、特殊场景处理

### 1. 循环依赖的三级缓存
Spring通过三级缓存解决循环依赖：
1. singletonFactories（三级）
2. earlySingletonObjects（二级）
3. singletonObjects（一级）

我们可以通过时序图来详细了解Spring解决循环依赖的详细过程：
![Spring循环依赖问题解决.png](https://s2.loli.net/2025/07/11/YRMSJEwpKGDqTLi.png)

### 2. FactoryBean的特殊处理
```java
@Component
public class MyFactoryBean implements FactoryBean<MyProduct> {

    @Override
    public MyProduct getObject() {
        return new MyProduct();
    }
    
    @Override
    public Class<?> getObjectType() {
        return MyProduct.class;
    }
}
```

获取方式：
- 获取FactoryBean本身：名称前加"&"（如"&myFactoryBean"）
- 获取产品对象：直接使用bean名称

### 3. 原型Bean的特殊性
- 每次getBean()都走完整生命周期
- 容器不管理原型Bean的销毁

## 总结：完整的生命周期流程图

![SpringBean.png](https://s2.loli.net/2025/07/11/64O9RmarWycigkZ.png)

掌握Spring Bean的完整生命周期，能够帮助您：
1. 更高效地排查Bean创建问题
2. 合理使用扩展点增强框架能力
3. 编写更优雅的Spring组件
4. 深入理解Spring的设计思想

**你在实际开发中遇到过哪些Bean生命周期的"坑"？欢迎留言分享！** 🎤
![image.png](https://s2.loli.net/2024/07/11/I8ZVdbwQ1s7XBrC.png)