## bind函数

　　bind函数最常见的用法是绑定函数的上下文，比如在setTimeout中的this一般都是指向window，如果我们想改变上下文，这里可以使用bind函数来实现。