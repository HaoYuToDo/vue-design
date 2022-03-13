/*
 * @Author: yhy
 * @Date: 2022-03-13 10:23:29
 * @LastEditTime: 2022-03-13 11:32:44
 * @LastEditors: yhy
 * @Description:
 */
// 全局变量来存储被注册的副作用函数
let activeEffect;

// 副作用函数
let effect = (fn) => {
  activeEffect = fn;
  fn();
};

// 存放副作用函数的桶
let bucket = new WeakMap();

// 原始数据
let data = { text: "hello world" };

// 原始数据的代理
let obj = new Proxy(data, {
  // 数据结构
  // {
  //   target1:{
  //     key1:[effect,effect],
  //     key2:[effect,effect],
  //   },
  //   target2:{
  //     key:[effect,effect]
  //   }
  // }
  get(target, key) {
    if (!activeEffect) {
      return;
    }

    let depsMap = bucket.get(target);

    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);

    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    // 将副作用添加到桶中
    deps.add(activeEffect);

    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;

    let depMap = bucket.get(target);
    if (!depMap) {
      return;
    }

    let effects = depMap.get(key);

    // 触发桶中副作用函数
    effects &&
      effects.forEach((fn) => {
        fn();
      });
    return true;
  },
});

// 触发读取操作
effect(() => {
  console.log("副作用触发");
  document.body.innerText = obj.text;
});

setTimeout(() => {
  obj.text = "vue3";
  // obj.noExist = "vue3";
}, 1000);
