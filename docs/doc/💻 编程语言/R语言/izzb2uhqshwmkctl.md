---
title: '第 14 章 R语言实战项目二:市场篮分析'
urlname: izzb2uhqshwmkctl
date: '2024-06-28 11:46:42'
updated: '2024-06-28 11:59:41'
cover: 'https://cdn.nlark.com/yuque/__mermaid_v3/bae5fc0c9951f67789c6b8ce59b923af.svg'
description: 'keywords: 市场篮分析, 关联规则, apriori 算法, 数据挖掘, 销售策略在超市等零售行业,通过对顾客购物篮中商品组合的分析,可以发现商品之间有趣的关联关系,从而优化商品布局和制定销售策略。本章我们将运用 R 语言来实现市场篮分析,带你一步步掌握数据挖掘在业务中的应用。14.1...'
keywords: '市场篮分析, 关联规则, apriori 算法, 数据挖掘, 销售策略'
---
在超市等零售行业,通过对顾客购物篮中商品组合的分析,可以发现商品之间有趣的关联关系,从而优化商品布局和制定销售策略。本章我们将运用 R 语言来实现市场篮分析,带你一步步掌握数据挖掘在业务中的应用。
### 14.1 项目需求分析
#### 14.1.1 市场篮分析的背景
市场篮分析源于上世纪 90 年代初期,最早由 IBM 公司提出。它是数据挖掘领域的一个经典问题,通过分析消费者的购物清单,发现商品之间的关联规则,如"购买商品 X 的顾客有很大概率也会购买商品 Y"。
这些规则对于商家来说具有重要的商业价值:

- 合理安排商品摆放,将关联度高的商品放在一起,刺激顾客的购买欲望
- 针对性地进行捆绑销售和交叉营销,提升整体销量
- 优化库存管理,关联商品的进货量应该协调一致
#### 14.1.2 项目的目标
本项目的目标是利用 R 语言对某超市的销售数据进行关联规则挖掘,具体包括:

1. 读取销售数据并进行预处理,转换为适合挖掘的"交易-商品"数据格式
2. 使用 Apriori 算法挖掘频繁项集和关联规则
3. 评估、筛选、解释关联规则,并可视化展示
4. 基于规则提出销售策略建议,指导商品布局优化

下面这个流程图直观展示了项目的整体步骤:
![](https://oss1.aistar.cool/elog-offer-now/3e4dd4f799d735f95f6cf3dc1cd20e31.svg)### 14.2 数据的读取与预处理
#### 14.2.1 导入交易数据
假设我们从超市数据库中导出了一份销售记录表`sales.csv`,每行记录对应一个交易(Transaction),包含交易编号和购买商品条码,格式如下:
```
Transaction_ID,Product_ID
001,P001
001,P002
001,P005
002,P001
002,P003
003,P001
003,P004
...
```
使用`read.csv()`函数将其读入 R:
```r
sales <- read.csv("sales.csv", header=TRUE, stringsAsFactors = FALSE)
head(sales)
```
```
  Transaction_ID Product_ID
1            001       P001
2            001       P002
3            001       P005
4            002       P001
5            002       P003
6            003       P001
```
#### 14.2.2 数据清洗和整理
检查数据质量,看是否存在缺失值、重复记录等问题:
```r
summary(sales)
sum(duplicated(sales))  # 检查重复记录
```
如无异常,则进入下一步。
#### 14.2.3 将数据转换为交易列表
为了进行关联规则挖掘,我们需要将数据转换为"交易-商品"的稀疏矩阵格式,其中行表示交易,列表示商品,值为 TRUE/FALSE 表示该交易是否包含对应商品。
使用`reshape2`包的`dcast()`函数进行转换:
```r
library(reshape2)
trans <- dcast(sales, Transaction_ID ~ Product_ID, fun.aggregate = length, value.var = "Product_ID")
trans[is.na(trans)] <- 0
trans[trans > 0 ] <- 1
head(trans)
```
![](https://oss1.aistar.cool/elog-offer-now/8063634748c1ef409ecb47fd371dfd6b.image)
可以看到数据已经转换为我们需要的"交易-商品"01 矩阵。之后的频繁项集和关联规则挖掘将在此基础上展开。
### 14.3 关联规则挖掘
#### 14.3.1 关联规则分析概念
关联规则分析的核心概念包括:

- 项(Item):数据集中的基本单元,如一件商品
- 项集(Itemset):包含 0 个或多个项的集合
- 支持度(Support):包含某项集的交易数占总交易数的比例,反映项集的流行程度
- 置信度(Confidence):包含 X 又包含 Y 的交易占所有包含 X 的交易的比例,反映规则的可信程度
- 提升度(Lift):置信度与 Y 的支持度之比,反映 X 对 Y 购买的提升能力

关联规则的一般形式为"X→Y [support=a, confidence=b, lift=c]",表示在 a 的支持度下,X 推导出 Y 的置信度为 b,提升度为 c。
#### 14.3.2 使用 apriori 算法
Apriori 是常用的关联规则挖掘算法,通过递归搜索频繁项集并由此生成关联规则。在 R 中可以使用`arules`包的`apriori()`函数实现。
首先将 14.2 节得到的 0-1 矩阵转换为事务型数据:
```r
library(arules)
trans <- as(trans,"transactions")
```
然后调用`apriori()`进行频繁项集和规则挖掘:
```r
rules <- apriori(trans, parameter = list(support=0.005, confidence=0.5, minlen=2))
```
这里设置了最小支持度为 0.5%,最小置信度为 50%,最小规则长度为 2。
#### 14.3.3 生成关联规则
挖掘得到的规则存储在`rules`对象中,可以查看其摘要信息:
```r
summary(rules)
```
```
set of 20 rules

rule length distribution (lhs + rhs):sizes
 2
20

   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
      2       2       2       2       2       2

summary of quality measures:
    support           confidence          lift           count
 Min.   :0.00503   Min.   :0.5030   Min.   :3.412   Min.   :18.0
 1st Qu.:0.00574   1st Qu.:0.5695   1st Qu.:3.857   1st Qu.:20.5
 Median :0.00671   Median :0.6526   Median :4.414   Median :24.0
 Mean   :0.00752   Mean   :0.6656   Mean   :4.489   Mean   :26.9
 3rd Qu.:0.00865   3rd Qu.:0.7559   3rd Qu.:5.092   3rd Qu.:31.0
 Max.   :0.01370   Max.   :0.8619   Max.   :5.808   Max.   :49.0
```
可以看到挖掘出 20 条两项的关联规则,规则的支持度、置信度、提升度等分布情况一目了然。
#### 14.3.4 规则的评估和筛选
并非所有规则都有实际价值,需要根据业务经验对规则进行评估和筛选。可以对规则的支持度、置信度、提升度等指标设置阈值过滤,也可以根据规则项的具体含义判断其有效性。
例如,我们筛选出提升度大于 4、支持度大于 0.1%的规则:
```r
high_lift_rules <- subset(rules, subset = lift > 4 & support > 0.001)
inspect(high_lift_rules)
```
![](https://oss1.aistar.cool/elog-offer-now/2c7aa6ccf1678ace205cb0802b658c9a.image)
结果显示,在高提升度和支持度下,牛奶与面包、啤酒与尿布等商品的搭配购买几率很高,这为商品布局提供了新的思路。
### 14.4 结果的可视化与应用
#### 14.4.1 关联规则的可视化
为了更直观地分析和呈现规则,可以对其进行可视化展示。`arulesViz`包提供了丰富的可视化方法,如散点图、平行坐标图、关联网络图等。
例如,我们绘制规则的散点图,横轴为支持度,纵轴为置信度,点的大小代表提升度:
```r
library(arulesViz)
plot(rules, measure = c("support", "confidence"), shading = "lift")
```
![](https://oss1.aistar.cool/elog-offer-now/0e2028c082605a9eac8ed6d866dd2e6e.image)
从图中可以清晰看出不同规则在三个指标上的表现,为规则筛选提供参考。
#### 14.4.2 规则的解释和应用
市场篮分析的最终目的是指导销售决策。获得关联规则后,需要结合具体业务对其进行解释和应用,例如:

- {牛奶} => {面包} 的置信度为 86%,说明买牛奶的顾客很可能也会买面包。因此可以把面包和牛奶摆放在一起,刺激顾客一并购买。
- {啤酒} => {尿布} 的提升度高达 5.8,表明购买啤酒会大幅提升购买尿布的几率。超市可以在端午、中秋等啤酒销量高的节日提前备货尿布,并在货架上加以提示。
- 购买新鲜蔬菜的顾客常搭配买调味品,超市可以推出"买新鲜蔬菜赠送调味品"的捆绑促销。

总之,市场篮分析可以从数据中发掘商品间的隐藏关系,为零售企业优化商品布局、制定销售策略提供新的视角。
#### 14.4.3 销售策略与商品布局优化
基于以上分析,我们可以给出一些销售策略建议:

1. 经常一起购买的商品应该摆放在一起,如面包和牛奶、啤酒和尿布、蔬菜和调味品等。可以设置"组合购买区",吸引消费者多买。
2. 节假日的促销组合可以参考商品的关联性。如中秋节期间买月饼赠送红酒,端午节买啤酒赠送尿布等。
3. 对于关联性强的商品,进货计划应该协调一致。当其中一个商品有促销计划时,关联商品的库存量也要做好准备。
4. 布置货架时,可以把高利润的商品与关联度高的商品放在一起,诱导消费者顺带购买。如进口牛奶和面包放一起。
5. 推荐系统可以根据顾客已购商品,自动推荐关联度高的其他商品,提升销售机会。网店更要重视此功能。

当然,市场篮分析只是销售决策的参考之一,还需要结合商品利润、成本、保质期、季节性等多方面因素,权衡制定销售策略。但通过数据挖掘获得的商品关联洞见,无疑为销售优化提供了新的思路。
