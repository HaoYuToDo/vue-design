/*
 * @Author: yhy
 * @Date: 2022-03-13 10:23:29
 * @LastEditTime: 2022-03-13 10:59:35
 * @LastEditors: yhy
 * @Description:
 */

// 副作用函数
let effect = () => {
  document.body.innerText = obj.text;
};

// 存放副作用函数的桶
let bucket = new Set();

// 原始数据
let data = { text: "hello world" };

// 原始数据的代理
let obj = new Proxy(data, {
  get(target, key) {
    // 收集副作用函数到桶中
    bucket.add(effect);

    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    // 触发桶中副作用函数
    bucket.forEach((fn) => {
      fn();
    });
    return true;
  },
});

// 触发读取操作
effect();

setTimeout(() => {
  obj.text = "vue3";
}, 1000);
