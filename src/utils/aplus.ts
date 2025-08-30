// src/plugins/aplus.ts
import type { App } from "vue";
import { useRouter } from "vue-router";

declare global {
  interface Window {
    aplus_queue: any[];
  }
}

function loadAplusScript(appKey: string, fileId: string) {
  (function (w, d, s, q, i) {
    w[q] = w[q] || [];
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    j.async = true;
    j.id = "beacon-aplus";
    j.src = "https://d.alicdn.com/alilog/mlog/aplus/" + i + ".js";
    f.parentNode!.insertBefore(j, f);
  })(window, document, "script", "aplus_queue", fileId);

  // 设置 appKey
  window.aplus_queue.push({
    action: "aplus.setMetaInfo",
    arguments: ["appKey", appKey],
  });

  // 单页应用手动 PV
  window.aplus_queue.push({
    action: "aplus.setMetaInfo",
    arguments: ["aplus-waiting", "MAN"],
  });

  // 开启调试
  window.aplus_queue.push({
    action: "aplus.setMetaInfo",
    arguments: ["DEBUG", true],
  });
}

function setUUID(uuid: string) {
  window.aplus_queue.push({
    action: "aplus.setMetaInfo",
    arguments: ["aplus-idtype", uuid],
  });
  console.log("Aplus 已更新 uuid:", uuid);
}

export default {
  install(app: App, options: { appKey: string; fileId: string }) {
    loadAplusScript(options.appKey, options.fileId);

    const router = useRouter();

    // 路由变化时上报 PV
    router.afterEach((to) => {
      window.aplus_queue.push({
        action: "aplus.sendPV",
        arguments: [
          {
            is_auto: false,
            url: window.location.href,
            title: to.meta?.title || document.title,
          },
        ],
      });
      console.log("Aplus PV 上报:", to.fullPath);
    });

    // 给全局挂一个方法，方便在 MainLayout.vue 调用
    app.config.globalProperties.$aplusSetUUID = setUUID;
  },
};

// 也导出一个独立方法，setup里可以用
export { setUUID };
