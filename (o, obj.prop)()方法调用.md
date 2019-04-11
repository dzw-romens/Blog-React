# Why is (0, obj.prop)() not a method call? 

这篇博客主要探讨了引用，这是用于解释以下两个表达式之间的差异的ECMAScript语言规范机制。
...javascript
obj.prop()
(0, obj.prop)()
...javascript
Method calls versus function callThis blog post explores references, a mechanism used by the ECMAScript language specification to explain the difference between the following two expressions:

obj.prop()
(0, obj.prop)()
Method calls versus function calls  
Consider the following object:

var obj = {
    getThis: function () {
        "use strict";
        return this;
    },
};
If you call obj.getThis, you have a method call (this points to the object in which the method is stored):

> obj.getThis() === obj
true
If you store obj.getThis in a variable and then call it, you are making a function call:

> var func = obj.getThis;
> func()
undefined
The effect is the same if you use the comma operator. Quick recap – the comma operator works like this:

(expr1, expr2) === expr2
That is, both expressions are evaluated, the result of the whole expression is expr2.

If you apply the comma operator to obj.getThis before calling it, you are also making a function call:

> (0,obj.getThis)()
undefined
What the first operand is doesn’t matter at all, here, I use 0, because its short. I’d expect many JavaScript engines to optimize and eliminate the evaluation of the first operand.

However, only using parentheses does not change anything:

> (obj.getThis)() === obj
true
So what is going on? The answer has to do with references.

References, a data structure of the ECMAScript spec  
References are a data structure that is used internally by the ECMAScript language specification. A reference has three components:

Base value: is either undefined, a primitive value, an object or an environment record. undefined means that a variable name could not be resolved. Accessed via GetBase(V) (given a reference V).
Referenced name: is a string or a symbol. Accessed via GetReferencedName(V) (given a reference V).
Strict reference: flag indicating whether or not the reference was created in strict mode. Accessed via IsStrictReference(V) (given a reference V).
Examples of JavaScript expressions that produce references:

Property reference: Evaluating obj.prop in strict mode produces the reference (obj, 'prop', true).
Identifier reference: Evaluating foo in strict mode produces the reference (env, 'foo', true). env is the environment record where the variable foo is stored.
The flag for strict mode is necessary, because some operations cause an exception in strict mode, but fail silently in sloppy mode. For example: setting an unresolved variable in sloppy mode creates a global variable, setting it in strict mode throws a ReferenceError.

These are two operations (of several) for references:

GetValue(V) if V is a value, the result is V. If V is a reference, the result is the value pointed to by the reference. This conversion from reference to referenced value is called dereferencing.
PutValue (V, W) writes the value W to the reference V.
GetThisValue(V) is only called if V is a property reference. For normal references, it returns the base value. For references created via super, it returns the additional component thisValue that they have (which is needed for super property references).
References in the example  
We are now ready to understand the examples we looked at earlier.

The following expression produces a reference:

obj.getThis
If you function-call this reference ref then this is set to GetThisValue(ref).

If you wrap obj.getThis in parentheses, nothing changes, parentheses only syntactically group things, but the don’t influence how something is evaluated. That is, the result of the following expression is still a reference:

(obj.getThis)
If, however, you assign the reference returned by obj.getThis to a variable, the reference is dereferenced:

var func = obj.getThis;
In other words: what is stored in func is a function, not a reference. In the language spec, assignment operators use GetValue() to turn references into values.

The comma operator also dereferences its operands. Consider this expression:

(0, obj.getThis)
The comma operator uses GetValue() to ensure that the result of each operand is dereferenced if it is a reference.

References and bind()  
References only being temporary is also the reason why you need to use bind if you want to turn a method into a callback (first line):

var log = console.log.bind(console);
log('hello');
If you simply did:

var log = console.log;
Then the receiver (this) would get lost, because console.log is dereferenced before it is stored in log.

References in real-world code  
Babel uses the comma operator to avoid function calls being transpiled to method calls.

Consider, for example, this ES6 module:

import {func} from 'some_module';

func();
Babel compiles it to this ES5 code:

'use strict';

var _some_module = require('some_module');

(0, _some_module.func)(); // (A)
The comma operator trick in line A means there will be a function call, not a method call (this will not be _some_module).

Why does the ECMAScript language specification use references?  
JavaScript engines, which are implementations of the ECMAScript language specification, don’t actually use references. That means that they are a device that helps with writing the spec. To see why, consider that they represent storage locations. Then consider that all of the following operations work with storage locations:

Reading a value:

x
obj.prop
super.prop
obj["prop"]    
Calling a function or a method:

x()
obj.prop()
super.prop()
obj["prop"]()
Assigning a value:

x = 123
obj.prop = 123
super.prop = 123
obj["prop"] = 123    
Compound assignment operators. For example, the addition assignment operator (+=):

x += 5
obj.prop += 5
super.prop += 5
obj["prop"] += 5
typeof:

typeof x
typeof obj.prop
typeof super.prop
typeof obj["prop"]    
delete:

delete x
delete obj.prop
delete super.prop
delete obj["prop"]
Because each storage location is represented by the same construct, a reference, the specification only needs to describe a single version of each operation instead of several versions (e.g.: delete for a variable, delete for a property with a fixed key, delete for a property with a dynamically computed key, etc.).

Conclusion  
You don’t actually see references when you use JavaScript. But there are languages (e.g. Common Lisp) where references are first class values. That enables intriguing applications. You can, for example, implement functions that perform an assignment for you.s  
Consider the following object:

var obj = {
    getThis: function () {
        "use strict";
        return this;
    },
};
If you call obj.getThis, you have a method call (this points to the object in which the method is stored):

> obj.getThis() === obj
true
If you store obj.getThis in a variable and then call it, you are making a function call:

> var func = obj.getThis;
> func()
undefined
The effect is the same if you use the comma operator. Quick recap – the comma operator works like this:

(expr1, expr2) === expr2
That is, both expressions are evaluated, the result of the whole expression is expr2.

If you apply the comma operator to obj.getThis before calling it, you are also making a function call:

> (0,obj.getThis)()
undefined
What the first operand is doesn’t matter at all, here, I use 0, because its short. I’d expect many JavaScript engines to optimize and eliminate the evaluation of the first operand.

However, only using parentheses does not change anything:

> (obj.getThis)() === obj
true
So what is going on? The answer has to do with references.

References, a data structure of the ECMAScript spec  
References are a data structure that is used internally by the ECMAScript language specification. A reference has three components:

Base value: is either undefined, a primitive value, an object or an environment record. undefined means that a variable name could not be resolved. Accessed via GetBase(V) (given a reference V).
Referenced name: is a string or a symbol. Accessed via GetReferencedName(V) (given a reference V).
Strict reference: flag indicating whether or not the reference was created in strict mode. Accessed via IsStrictReference(V) (given a reference V).
Examples of JavaScript expressions that produce references:

Property reference: Evaluating obj.prop in strict mode produces the reference (obj, 'prop', true).
Identifier reference: Evaluating foo in strict mode produces the reference (env, 'foo', true). env is the environment record where the variable foo is stored.
The flag for strict mode is necessary, because some operations cause an exception in strict mode, but fail silently in sloppy mode. For example: setting an unresolved variable in sloppy mode creates a global variable, setting it in strict mode throws a ReferenceError.

These are two operations (of several) for references:

GetValue(V) if V is a value, the result is V. If V is a reference, the result is the value pointed to by the reference. This conversion from reference to referenced value is called dereferencing.
PutValue (V, W) writes the value W to the reference V.
GetThisValue(V) is only called if V is a property reference. For normal references, it returns the base value. For references created via super, it returns the additional component thisValue that they have (which is needed for super property references).
References in the example  
We are now ready to understand the examples we looked at earlier.

The following expression produces a reference:

obj.getThis
If you function-call this reference ref then this is set to GetThisValue(ref).

If you wrap obj.getThis in parentheses, nothing changes, parentheses only syntactically group things, but the don’t influence how something is evaluated. That is, the result of the following expression is still a reference:

(obj.getThis)
If, however, you assign the reference returned by obj.getThis to a variable, the reference is dereferenced:

var func = obj.getThis;
In other words: what is stored in func is a function, not a reference. In the language spec, assignment operators use GetValue() to turn references into values.

The comma operator also dereferences its operands. Consider this expression:

(0, obj.getThis)
The comma operator uses GetValue() to ensure that the result of each operand is dereferenced if it is a reference.

References and bind()  
References only being temporary is also the reason why you need to use bind if you want to turn a method into a callback (first line):

var log = console.log.bind(console);
log('hello');
If you simply did:

var log = console.log;
Then the receiver (this) would get lost, because console.log is dereferenced before it is stored in log.

References in real-world code  
Babel uses the comma operator to avoid function calls being transpiled to method calls.

Consider, for example, this ES6 module:

import {func} from 'some_module';

func();
Babel compiles it to this ES5 code:

'use strict';

var _some_module = require('some_module');

(0, _some_module.func)(); // (A)
The comma operator trick in line A means there will be a function call, not a method call (this will not be _some_module).

Why does the ECMAScript language specification use references?  
JavaScript engines, which are implementations of the ECMAScript language specification, don’t actually use references. That means that they are a device that helps with writing the spec. To see why, consider that they represent storage locations. Then consider that all of the following operations work with storage locations:

Reading a value:

x
obj.prop
super.prop
obj["prop"]    
Calling a function or a method:

x()
obj.prop()
super.prop()
obj["prop"]()
Assigning a value:

x = 123
obj.prop = 123
super.prop = 123
obj["prop"] = 123    
Compound assignment operators. For example, the addition assignment operator (+=):

x += 5
obj.prop += 5
super.prop += 5
obj["prop"] += 5
typeof:

typeof x
typeof obj.prop
typeof super.prop
typeof obj["prop"]    
delete:

delete x
delete obj.prop
delete super.prop
delete obj["prop"]
Because each storage location is represented by the same construct, a reference, the specification only needs to describe a single version of each operation instead of several versions (e.g.: delete for a variable, delete for a property with a fixed key, delete for a property with a dynamically computed key, etc.).

Conclusion  
You don’t actually see references when you use JavaScript. But there are languages (e.g. Common Lisp) where references are first class values. That enables intriguing applications. You can, for example, implement functions that perform an assignment for you.