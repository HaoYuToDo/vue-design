/*
 * @Author: yhy
 * @Date: 2022-03-13 00:41:49
 * @LastEditTime: 2022-03-13 01:33:26
 * @LastEditors: yhy
 * @Description:
 */

//虚拟dom
let vnodeData = {
  tag: "div",
  props: {
    onClick: (e) => {
      alert("hello");
    },
  },
  children: "click me",
  // children: [
  //   {
  //     tag: "span",
  //     children: "子元素",
  //   },
  // ],
};

// 渲染器
let renderer = (vnode, container) => {
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
renderer(vnodeData, document.getElementById("app"));
