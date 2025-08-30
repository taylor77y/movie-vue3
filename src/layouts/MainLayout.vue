<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { post } from './../utils/request'
import { v4 as uuidv4 } from 'uuid'

import { ref, onMounted, computed, KeepAlive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHomeStore } from '@/store/home'
const timer = ref<any>(null)
const router = useRouter()
const active = ref("/")
const route = useRoute()
const memberInfo = ref<any>({})
// 计算属性判断是否显示 Tabbar
const show = ref<any>(false)
const onCreateUUid = () => {
  const uuid = uuidv4()
  return uuid
}
const onGetUserInfo = async () => {
  const res = await post('/renren-api/api/auto-register', {
    deviceType: 0,
    uuid: onCreateUUid()
  })
  console.log("生成用户", res);
  if (res.code === 0) {
    memberInfo.value = res.data
    localStorage.setItem('memberInfo', JSON.stringify(res.data))
    localStorage.setItem('token', res.data.token)
  }
}
const onRfUserInfo = async () => {
  const res = await post('/app-api/member/getEntityByCode', {
    memberCode: memberInfo.value.memberCode
  });

  if (res.code === 0) {
    memberInfo.value = res.data
    localStorage.setItem('memberInfo', JSON.stringify(res.data))
  }
}
const onGo = (path: any) => {
  show.value = false
  active.value = '/'
  router.push({
    path: path
  })
}
const onPush = (path: any) => {
  router.push({
    path: path
  })
}

watch(
  () => route.path,
  (val) => {
    if (val === '/publish') {
      if (memberInfo.value.memberVip === 3) {
        show.value = false
      } else {
        show.value = true
      }
    }
  },
  { immediate: true } // 页面初次加载也执行一次
)
const test = () => {
  const data = {
    androidUuid
      :
      null,
    balance
      :
      0,
    createTime
      :
      "2025-08-24 19:14:07",
    h5Uuid
      :
      "27944f23-c238-4cbb-954b-4ff23936b6f7",
    hasAccount
      :
      null,
    iosUuid
      :
      null,
    memberAvatar
      :
      null,
    memberCion
      :
      0,
    memberCode
      :
      "98210",
    memberName
      :
      "28117039104",
    memberNichen
      :
      "28117039104",
    memberPwdTemp
      :
      "1234567",
    memberSignature
      :
      null,
    memberVip
      :
      0,
    memberViptime
      :
      0,
    mobile
      :
      null,
    pid
      :
      "98999",
    token
      :
      '69b156667a1f4b10ac2a87a8757973d1',
    vipDate
      :
      "2025-08-24 19:14:07",
    vipPeriod
      :
      0,
    wxOpenid
      :
      null,
    wxUnionid
      :
      null
  }
  localStorage.setItem('token', '69b156667a1f4b10ac2a87a8757973d1')
  localStorage.setItem('memberInfo', JSON.stringify(data))
}

onMounted(async () => {
  active.value = route.path
  // 只在开发环境执行 test
  if (import.meta.env.MODE === 'development') {
    test()
  } else {
    if (localStorage.getItem('memberInfo') === null) {
      await onGetUserInfo()
    } else {
      const userData: any = localStorage.getItem('memberInfo')
      memberInfo.value = JSON.parse(userData)
      // 
      timer.value = setInterval(onRfUserInfo, 10000)
    }
  }
if(memberInfo.value.h5Uuid){
  // 动态创建 Aplus 脚本
  (function (w, d, s, q, i) {
    w[q] = w[q] || [];
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    j.async = true;
    j.id = "beacon-aplus";
    j.src = "https://d.alicdn.com/alilog/mlog/aplus/" + i + ".js";
    f.parentNode!.insertBefore(j, f);
  })(window, document, "script", "aplus_queue", "203467608");

  // 设置 appKey
  window.aplus_queue.push({
    action: "aplus.setMetaInfo",
    arguments: ["appKey", "68a1c9fbe563686f427f6968"],
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

  // 设置 uuid
  window.aplus_queue.push({
    action: "aplus.setMetaInfo",
    arguments: ["aplus-idtype", memberInfo.value.h5Uuid],
  });
  window.aplus_queue.push({
    action: "aplus.sendPV",
    arguments: [
      {
        is_auto: false,       // 表示手动上报 PV，不是自动上报
      },
      {
        page_path: "进入首页", // 页面路径或名称
        user_id: memberInfo.value.h5Uuid      // 用户 ID，可用于埋点区分用户
      },
    ],
  });
}
})
</script>

<template>
  <!-- 开启顶部安全区适配 -->
  <RouterView :key="route.fullPath">
  </RouterView>
  <div class="custom-tabbar"  v-if="route.meta.showTabbar !== false">
    <van-tabbar v-model="active">
      <van-tabbar-item name="/" @click="onPush('/')">
        <template #icon="{ active: isActive }">
          <img :src="!isActive ? '/tabbar/01.svg' : '/tabbar/001.svg'" :class="{ 'icon-active': isActive }" />
        </template>
        <span :class="{ 'text-active': active === 'home' }">首页</span>
      </van-tabbar-item>

      <van-tabbar-item name="/category" @click="onPush('/category')">
        <template #icon="{ active: isActive }">
          <img :src="!isActive ? '/tabbar/02.svg' : '/tabbar/002.svg'"  :class="{ 'icon-active': isActive }" />
        </template>
        <span :class="{ 'text-active': active === 'category' }">专题</span>
      </van-tabbar-item>

      <!-- 中间凸起按钮 -->
      <van-tabbar-item name="/publish" @click="onPush('/publish')">
        <template #icon="{ active: isActive }">
          <div class="center-btn">
            <img :src="!isActive ? '/tabbar/05.svg' : '/tabbar/005.svg'" class="" style="width: 32px;height: 32px;   -webkit-user-drag: none; 
        user-select: none;
        pointer-events: none; " />
            <span class="center-text" :class="{ 'text-active': active === 'publish' }">暗网</span>
          </div>
        </template>
      </van-tabbar-item>

      <van-tabbar-item name="/collengt" @click="onPush('/collengt')">
        <template #icon="{ active: isActive }">
          <img :src="!isActive ? '/tabbar/03.svg' : '/tabbar/003.svg'" :class="{ 'icon-active': isActive }" />
        </template>
        <span :class="{ 'text-active': active === 'collengt' }">收藏</span>
      </van-tabbar-item>

      <van-tabbar-item name="/my" @click="onPush('/my')">
        <template #icon="{ active: isActive }">
          <img :src="!isActive ? '/tabbar/04.svg' : '/tabbar/004.svg'" :class="{ 'icon-active': isActive }" />
        </template>
        <span :class="{ 'text-active': active === 'my' }">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>

  <van-overlay :show="show">
    <div class="g-wrapper aw">
      <div class="block">
        <div class="conta">
          <img src="/pub/1.svg" style="width: 160px;height: 160px;" />
          <div class="pd5">此板块都是暗网禁片真实解密的内容，</div>
          <div class="pd5">只对少量需求用户开放，</div>
          <div class="pd5">无承受能力者勿入！！</div>
          <div class="ac">开通VIP</div>
          <div class="ac">解锁进入暗网</div>
          <div class="govip" @click="onGo('/vip')">会员解锁</div>
          <div class="pd5" style="font-size: 10px;margin-bottom: 20px;margin-top: 10px;">开通者，严禁分享传播！</div>
          <div class="live" @click="onGo('/')">点击离开</div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

</style>
<style lang="less" scoped>
.custom-tabbar {
  position: relative;
}

/* 凸起按钮覆盖在 tabbar 上 */
.center-btn {
  position: fixed;
  left: 50%;
  bottom: 5px;
  /* 让它“压”在 tabbar 上 */
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  display: flex;
  flex-direction: column;

  .center-text {
    font-size: 12px;
    padding-top: 8px;
    color: var(--text-color);
  }
}

.van-tabbar--fixed {
  background-color: var(--br-color);

}

.van-tabbar-item {
  .van-tabbar-item__text {
    >span {
      color: var(--text-color);
    }


  }
}


.van-tabbar-item--active {
  color: var(--primary-color);
  background-color: var(--br-color);

  .van-tabbar-item__text {
    >span {
      color: var(--primary-color);
    }
  }

  .center-btn {
    .center-text {
      color: var(--primary-color);
    }
  }
}

.text-active {
  color: var(--primary-color) !important;
}
</style>
<style lang="less" scoped>
.g-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .block {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;

    .conta {
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 16px;
      font-weight: bold;

      .govip {
        background: linear-gradient(180deg, #FFBE00 0%, #FF960C 104.01%);
        color: black;
        font-weight: bold;
        width: 130px;
        height: 35px;
        border-radius: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
      }

      .live {}

      .ac {
        font-size: 18px;
        color: var(--primary-color);
      }

      .pd5 {
        padding-bottom: 5px;
      }

      .pd {
        padding: 20px 0;
      }
    }

    .top {}

    .cont {
      width: 70%;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 10px;
      color: #000000;
      text-align: center;
      position: relative;

      .posicon {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .cont-title {
        padding: 50px 0;
      }

      .cont-bottom {
        width: 100%;
        height: 60px;
        background-color: rgb(238, 238, 238);
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: black;
        border-top: 1px solid rgb(204, 204, 204);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        .l {
          color: var(--primary-color);
        }
      }
    }
  }
}

.aw {
  background: #00000073;
}

.outer-content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: end;

  .inner-overlay {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column-reverse;

    .custom-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #000000;
    }
  }
}
</style>