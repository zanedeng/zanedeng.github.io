　　在 TypeScript 中我们会使用泛型来对函数的相关类型进行约束。这里的函数，同时包含 class 的构造函数，因此，一个类的声明部分，也可以使用泛型。那么，究竟什么是泛型？如果通俗的理解泛型呢？

## 什么是泛型

> 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。


　　通俗的解释，泛型是类型系统中的“参数”，主要作用是为了类型的重用。从上面定义可以看出，它只会用在函数、接口和类中。它和 js 程序中的函数参数是两个层面的事物（虽然意义是相同的），因为 typescript 是静态类型系统，是在 js 进行编译时进行类型检查的系统，因此，泛型这种参数，实际上是在编译过程中的运行时使用。之所以称它为“参数”，是因为它具备和函数参数一模一样的特性。
  
```javascript
function increse(param) {
  // ...
}
```

　　而类型系统中，我们如此使用泛型：
  
```javascript
function increase<T>(param: T): T {
  //...
}
```

　　当 param 为一个类型时，T 被赋值为这个类型，在返回值中，T 即为该类型从而进行类型检查。
  
## 编译系统

　　要知道 typescript 本身的类型系统也需要编程，只不过它的编程方式很奇怪，你需要在它的程序代码中穿插 js 代码（在 ts 代码中穿插 js 代码这个说法很怪，因为我们直观的感觉是在 js 代码中夹杂了 ts 代码）。
  
　　编程中，最重要的一种形式就是函数。在 typescript 的类型编程中，你看到函数了吗？没有。这是因为，有泛型的地方就有函数，只是函数的形式被 js 代码给割裂了。typescript 需要进行编译后得到最终产物。编译过程中要做两件事，一是在内存中运行类型编程的代码，从而形成类型检查体系，也就是说，我们能够对 js 代码进行类型检查，首先是 typescript 编译器运行 ts 编程代码后得到了一个运行时的检查系统，运行这个系统，从而对穿插在其中的 js 代码进行类型断言；二是输出 js，输出过程中，编译系统已经运行完了类型编程的代码，就像 php 代码中 echo js 代码一样，php 代码已经运行了，显示出来的是 js 代码。
  
　　从这个角度看 typescript，你或许更能理解为什么说它是 JavaScript 的超集，为什么它的编译结果是 js（为什么不可以将 ts 编译为其他语言呢？）。
  
## 通俗的理解泛型

　　既然我们理解了 ts 编译系统的逻辑，那么我们就可以把类型的编程和 js 本身的业务编程在情感上区分开。我们所讲的“泛型”，只存在于类型编程的部分，这部分代码是 ts 的编译运行时代码。
  
　　我们来看下一个简单的例子：
  
```javascript
function increase<T>(param: T): T {
  //...
}
```

　　这段代码，如果我们把 js 代码区分开，然后用类型描述文本来表示会是怎样？

```javascript
// 声明函数 @type，参数为 T，返回结果为 (T): T
@type = T => (T): T

// 运行函数得到一个类型 F，即类型为 (number): number
@F = @type(number)

// 要求 increase 这个函数符合 F 这种类型，也就是参数为 number，返回值也为 number
@@F
function increase(param) {
  // ...
}
@@end
```

　　实际上没有 @@F 这种语法，是我编造出来的，目的是让你可以从另一个角度去看类型系统。
  
　　当我们理解泛型是一种“参数”之后，我们可能会问：类型系统的函数在哪里？对于 js 函数而言，你可以很容易指出函数声明语句和参数，但是 ts 中，这个部分是隐藏起来的。不过，我们可以在一些特定结构中，比较容易看到类型函数的影子：

```javascript
// 声明一个泛型接口，这个写法，像极了声明一个函数，我们用描述语言来形容 @type = T => (T): T
interface GenericIdentityFn<T> {
    (arg: T): T;
}

// 这个写法，有点像一个闭包函数，在声明函数后，立即运行这个函数，描述语言：@@[T => (T): T](any)
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型接口，像极了调用一个函数，我们用描述语言来形容 @type(number)
let myIdentity: GenericIdentityFn<number> = identity;
```

　　上面这一整段代码，我们用描述文本重写一遍：
 
```javascript
@GenericIdentityFn = T => (T): T
@@[T => (T): T](any)
function identify(arg) {
  return arg
}
@@end

@@GenericIdentityFn(number)
let myIdentity = identity
@@end
```

　　我们在类型系统中声明了两个函数，分别是 @GenericIdentityFn 和 @some（匿名函数 @[T => (T): T]）。虽然是两个函数，但是实际上，它们的是一模一样的，因为 typescript 是结构类型，也就是在类型检查的时候只判断结构上的每个节点类型是否相同，而不是必须保持类型变量本身的指针相同。 
  
　　@GenericIdentityFn 和 @some 这两个函数分别被调用，用来修饰identify和myIdentify，在调用的时候，接收的参数不同，所以导致最终的类型检查规则是不同的，identify 只要保证参数和返回值的类型相同，至于具体什么类型，any。而 myIdentify 除了保证参数返回值类型相同外，还要求类型必须是 number。
  
## 泛型类

　　除了泛型接口，class 类也可以泛型化，即“泛型类”，借助泛型类，我们来探究一下泛型的声明和使用的步骤。

```javascript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
```

　　前文泛型接口因为只是为了约束函数的类型，所以写的很像函数，实际上，我们可以用描述语言重新描述一个泛型接口和泛型类。上面的红色部分，我们用描述语言来描述：

```javascript
@GenericNumber = T => class {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

　　@GenericNumber 这个函数，以 T 为参数，返回一个 class，在函数体内多次用到了参数 T。

```javascript
@GenericIdentityFn = T => interface {
  (arg: T): T;
}
```
　　我们重新描述了前面的 interface GenericIdentityFn，这样我们就可以在接口中增加其他的方法。
  
　　可以注意到，即使 typescript 内置的基础类型，例如 Array，被声明为泛型接口、泛型类之后，这些接口和类在使用时必须通过<>传入参数，本质上，因为它们都是函数，只是返回值不同。
  
## 其他泛型使用的通俗解释

　　接下来我们要再描述一个复杂的类型：
  

```javascript
class Animal {
    numLegs: number;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}
```

　　我们姑且不去看 new() 的部分，我们看尖括号中的 extends 语法，这里应该怎么理解呢？实际上，我们面对的问题是，在编译时，<A extends Animal> 尖括号中的内容是什么时候运行的，是之前，还是之间？

```javascript
// 到底是
@type = (A extends Animal) => (new() => A): A
@type(T)
// 还是
@type = A => (new() => A): A
@type(T extends Animal)
```

　　因为 typescript 是静态类型系统，Animal 是不变的类，因此，可以推测其实在类的创建之前，尖括号的内容已经被运行了。

```javascript
@type = (A extends Animal) => (new() => A): A
```

　　也就是说，要使用 @type(T) 产生类型，首先 T 要满足 Animal 的结构，然后才能得到需要的类型，如果 T 已经不满足 Animal 类的结构了，那么编译器会直接报错，而这个报错，不是类型检查阶段，而是在类型系统的创建阶段，也就是 ts 代码的运行阶段。这种情况被称为“泛型约束”。
  
　　另外，类似 <A,B> 这样的语法其实和函数参数一致。

```javascript
@type = (A, B) => (A|B): SomeType
```

　　我们再来看 ts 内置的基础类型：Array<number>

```javascript
@Array = any => any[]
```

## 结语
　　Typescript 中的泛型，实际上就是类型的生成函数的参数。本文的内容全部为凭空想象，仅适用于对 ts 进行理解时的思路开拓，不适用于真实编程，特此声明。

---

Copyright © 2019 [zanejs.com](https://www.zanejs.com). All rights reserved.