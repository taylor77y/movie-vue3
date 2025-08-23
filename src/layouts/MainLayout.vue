<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { post } from './../utils/request'
import { v4 as uuidv4 } from 'uuid'
import { useRoute } from 'vue-router'
const route = useRoute()
import O1 from "./../assets/tabbar/01.svg"
import O2 from "./../assets/tabbar/02.svg"
import O3 from "./../assets/tabbar/03.svg"
import O4 from "./../assets/tabbar/04.svg"
import O5 from "./../assets/tabbar/darknet_activew.svg"
import OO1 from "./../assets/tabbar/001.svg"
import OO2 from "./../assets/tabbar/002.svg"
import OO3 from "./../assets/tabbar/003.svg"
import OO4 from "./../assets/tabbar/004.svg"
import OO5 from "./../assets/tabbar/darknet_active.svg"
import { ref, onMounted,computed, KeepAlive } from 'vue'

const active = ref("home")
// 计算属性判断是否显示 Tabbar
// 根据路由 meta 判断是否显示 Tabbar
const showTabbar = computed(() => route.meta.showTabbar !== false)
const goPublish = () => {
  console.log('点击发布')
}
const onCreateUUid = () => {
  const uuid = uuidv4()
  return uuid
}
const onGetUserInfo = async () => {
  const res = await post('/renren-api/api/auto-register', {
    deviceType: 0,
    uuid: onCreateUUid()
  })
  console.log("生成用户",res);
  
  if (res.code === 0) {
    localStorage.setItem('memberInfo', JSON.stringify(res.data))
    localStorage.setItem('token', res.data.token)
  }
}
onMounted(async () => {
  // if(localStorage.getItem('memberInfo') === null){
  //   const res:any = {
  //     data:{
  //       memberCode: "91796",
  //       memberAvatar: null,
  //       memberNichen: "27979233280",
  //       memberCion: 0,
  //       balance: 0,
  //       memberVip: 0,
  //       vipPeriod: 0,
  //       memberViptime: 0,
  //       vipDate: "2025-08-23 05:51:11",
  //       memberName: "27979233280",
  //       memberSignature: null,
  //       pid: null,
  //       createTime: "2025-08-23 05:51:11",
  //       token: 'be1f2ce9e5064874b791b1e1d992602d',
  //       hasAccount: null,
  //       mobile: null,
  //       wxOpenid: null,
  //       wxUnionid: null,
  //       memberPwdTemp: "xgHH1b",
  //       h5Uuid: "e5f71e91-ecae-4898-bf6c-f55675e1a70c",
  //       androidUuid: null,
  //       iosUuid: null
  // }
  //   }
  //   localStorage.setItem('memberInfo', JSON.stringify(res.data))
  //  localStorage.setItem('token',res.data.token)
  // }

  //   await onGetUserInfo()
  if (localStorage.getItem('memberInfo') === null) {
    await onGetUserInfo()
  }
})
</script>

<template>
  <router-view v-slot="{ Component }">
  <KeepAlive include="HomeView">
    <component :is="Component" />
  </KeepAlive>
</router-view>

  <div class="custom-tabbar" v-if="showTabbar">
   <van-tabbar v-model="active">
  <van-tabbar-item name="home" @click="$router.push('/')">
    <template #icon="{ active: isActive }">
      <img :src="!isActive ? O1 : OO1" :class="{ 'icon-active': isActive }" />
    </template>
    <span :class="{ 'text-active': active === 'home' }">首页</span>
  </van-tabbar-item>

  <van-tabbar-item name="category" @click="$router.push('/category')">
    <template #icon="{ active: isActive }">
      <img :src="!isActive ? O2 : OO2" :class="{ 'icon-active': isActive }" />
    </template>
    <span :class="{ 'text-active': active === 'category' }">专题</span>
  </van-tabbar-item>

  <!-- 中间凸起按钮 -->
  <van-tabbar-item name="publish" @click="$router.push('/publish')">
    <template #icon="{ active: isActive }">
      <div class="center-btn">
        <img :src="!isActive ? O5 : OO5" />
        <span :class="{ 'text-active': active === 'publish' }">暗网</span>
      </div>
    </template>
  </van-tabbar-item>

  <van-tabbar-item name="collengt" @click="$router.push('/collengt')">
    <template #icon="{ active: isActive }">
      <img :src="!isActive ? O3 : OO3" :class="{ 'icon-active': isActive }" />
    </template>
    <span :class="{ 'text-active': active === 'collengt' }">收藏</span>
  </van-tabbar-item>

  <van-tabbar-item name="my" @click="$router.push('/my')">
    <template #icon="{ active: isActive }">
      <img :src="!isActive ? O4 : OO4" :class="{ 'icon-active': isActive }" />
    </template>
    <span :class="{ 'text-active': active === 'my' }">我的</span>
  </van-tabbar-item>
</van-tabbar>


  </div>
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
  bottom: 0px;
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
}

.text-active {
  color: var(--primary-color) !important;
}
</style>