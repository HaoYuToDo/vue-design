/*
 * @Author: yhy
 * @Date: 2022-03-13 00:41:49
 * @LastEditTime: 2022-03-13 10:29:35
 * @LastEditors: yhy
 * @Description:
 */

//组件为函数
let MyComponent = () => {
  return {
    tag: "div",
    props: {
      onClick: (e) => {
        alert("hello函数");
      },
    },
    children: "click me",
  };
};

//虚拟dom
let vnodeData = {
  tag: MyComponent,
};

// 渲染器
let renderer = (vnode, container) => {
  if (typeof vnode.tag === "string") {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === "function") {
    mountComponent(vnode, container);
  }
};

// 标签元素
let mountElement = (vnode, container) => {
  let el = document.createElement(vnode.tag);

  for (let key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase(), vnode.props[key]);
    }
  }

  if (typeof vnode.children === "string") {
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      renderer(child, el);
    });
  }

  container.appendChild(el);
};

// 组件
let mountComponent = (vnode, container) => {
  // 调用函数返回虚拟dom
  let subtree = vnode.tag();
  renderer(subtree, container);
};

renderer(vnodeData, document.getElementById("app"));
