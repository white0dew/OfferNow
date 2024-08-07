---
title: 第2章：Go工具箱 - 基础语法全接触
urlname: yvlmw16u6dg0bnyb
date: '2024-05-22 19:41:38'
updated: '2024-08-06 19:08:43'
description: 本章将全方位接触Go的基础语法，从数据类型、变量与常量的声明与初始化，到运算符与表达式的应用，为你绘制出Go语言的基本脉络。处理信号 - 数据类型的运用与转换在Go语言的行星上，正确地处理数据类型和进行类型转换就像是在浩瀚的宇宙中发送和接收信号一样重要。基本数据类型Go语言提供了丰富的数据类型...
---
本章将全方位接触Go的基础语法，从数据类型、变量与常量的声明与初始化，到运算符与表达式的应用，为你绘制出Go语言的基本脉络。

#### 处理信号 - 数据类型的运用与转换

在Go语言的行星上，正确地处理数据类型和进行类型转换就像是在**浩瀚的宇宙中发送和接收信号一样重要**。

##### 基本数据类型

Go语言提供了丰富的数据类型，包括：

- 整型（`int`、`int8`、`int32`、`int64`）
- 浮点型（`float32`、`float64`）
- 布尔型（`bool`）
- 字符串（`string`）

```go
var i int = 42
var f float64 = 42.0
var b bool = true
var s string = "Go星球"
```

##### 类型转换

在Go中，类型之间的转换需要显式声明，这样做的目的是保证类型安全。

```go
var i int = 42
var f float64 = float64(i) // 将int转换为float64
var u uint = uint(f) // 将float64转换为uint
```

类型转换的基本语法为：`T(v)`，其中`T`是要转换成的类型，而`v`是要转换的值。

#### 设置变量 - 变量与常量的声明与初始化

在Go的宇宙中，变量是存储值的容器，而常量是不变的值。

了解如何声明和初始化变量和常量，就像是装备你的飞船，为探索未知做好准备。

##### 变量

使用`var`关键字声明变量。Go语言支持在声明变量时进行初始化。

```go
var name string = "Go探险者"
var age int = 30
```

Go也支持类型推断，允许你在声明变量时忽略类型。

```go
var name = "Go探险者"
var age = 30
```

##### 常量

使用`const`关键字声明常量。

```go
const Pi = 3.14
```

常量可以是字符、字符串、布尔或数值类型，声明后其值不可更改。

#### 连接器搭建 - 运算符与表达式

在Go的语法宇宙中，运算符是构建逻辑和数学表达式的连接器。

通过运算符，我们可以对变量执行各种操作，**这如同在宇宙中搭建连接器，将不同的星系连接起来**。

##### 算术运算符

包括加(`+`)、减(`-`)、乘(`*`)、除(`/`)、取模(`%`)等。

```go
sum := 10 + 5 // 加
difference := 10 - 5 // 减
product := 10 * 5 // 乘
quotient := 10 / 5 // 除
remainder := 10 % 5 // 取模
```

##### 比较运算符

包括等于(`==`)、不等于(`!=`)、小于(`<`)、大于(`>`)、小于等于(`<=`)、大于等于(`>=`)等。

```go
equal := (10 == 5) // 等于
notEqual := (10 != 5) // 不等于
lessThan := (10 < 5) // 小于
greaterThan := (10 > 5) // 大于
```

##### 逻辑运算符

包括与(`&&`)、或(`||`)、非(`!`)。

```go
and := (true && false) // 与
or := (true || false) // 或
not := !(true) // 非
```

通过掌握Go的基本语法和这些基础概念，你已经为进一步探索Go的世界做好了准备。



