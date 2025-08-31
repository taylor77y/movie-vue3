<script setup lang="ts">
import { onMounted, nextTick, onActivated, ref, onBeforeMount, reactive, onUpdated } from 'vue'
import { useHomeStore } from '@/store/home'
import CartoonItem from "@/components/CartoonItem.vue"
import CartoonItemO from "@/components/CartoonItemO.vue"
import AD from "@/components/Ad.vue"
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import { useRoute, useRouter } from 'vue-router'
const pl = '/Image/pl.png';
const route = useRoute()
const router = useRouter()
const store = useHomeStore()
const loadingIndex = ref<any>(false)
const scrollContainer = ref<HTMLElement | null>(null)
const tagWrapper = ref<HTMLElement | null>(null)
const tagList = ref<HTMLElement | null>(null)
const imgloadingTime = ref<any>(0)
// 图片错误占位
const onImgError = (event: any) => {
  event.target.src = pl
}
// 标签点击
const selectTag = async (id: number, index: number) => {
  store.activeTag = id
  
  store.currentPage = 1
  store.noMore = false
  store.loading = false

  // 标签居中
  nextTick(() => {
    const wrapper = tagWrapper.value
    const tagEl = tagList.value?.children[index]
    if (tagEl && wrapper) {
      const tagLeft = tagEl.offsetLeft
      const tagWidth = tagEl.offsetWidth
      const wrapperWidth = wrapper.offsetWidth
      wrapper.scrollLeft = tagLeft - (wrapperWidth - tagWidth) / 2
    }
  })
  // 请求数据
  if (store.activeTag === 0) {
    await store.getLikeData()
  } else {
    const res = await post('/app-api/cartoon/listPaging', {
      currentPage: store.currentPage,
      type: '全部',
      typeCode: store.activeTag
    })
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      store.likeList =  store.insertAdsOther(data.list, store.randomad)
      nextTick(() => {
        if (scrollContainer.value) {
          scrollContainer.value.scrollTop = 0
          store.scrollTop = 0
        }
      })
    }
    // 这里可以写 store 内的方法处理返回
  }
}


const handleGoVideo = (item: any) => {
  console.log('即将跳转', item.cartoonCode)
  router.push({
    path: '/videoinfo',
    query: { id: item.cartoonCode }
  }).catch(err => console.warn(err))
}

const onGo = (path: any) => {
  router.push({
    path: path,
  })
}
const onGoMore = (type: any, title: any) => {
  router.push({
    path: '/sreinfo',
    query: {
      type: type,
      sonType: '',
      searchStr: '',
      title: title
    }
  })
}

// 滚动加载
const handleScroll = (e: Event) => {
  const container = e.target as HTMLElement
  store.scrollTop = container.scrollTop

  const threshold = 100 // 距离底部多少触发
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - threshold) {
    store.loadMore()
  }
}



// 页面打开
const onOpen = async (item: any) => {
  const res = await post('/app-api/member/swiperAdClickCount', {
    id: item.id
  })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
  }
  window.open(item.h5Url, '_blank')
}
let startTime = 0
// 页面开始渲染前记录时间
onBeforeMount(() => {
  startTime = performance.now()
})

const onRef = async () => {
  loadingIndex.value = true
  const res = await post('/app-api/cartoon/listIndex', {
  })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    store.rankList = store.insertAds(data.rankList, store.randomad)
    store.typelist = store.insertAds(data.typeList.flatMap((item: any) => item.cartoonInfoList), store.randomad)
  }
  loadingIndex.value = false
}
const imageStats = ref<{ index: number; time: number }[]>([])
const loadedMap = reactive<any>({
})
// 初始化
const handleImgLoaded = ({
  title,
  index,
  time,
  id
}: {
  title: string
  index: number
  time: number,
  id: any
}) => {
  imageStats.value.push({ index, time })
  loadedMap[id] = true
  console.log(loadedMap, "loadedMap");
  if (time > 0) { // 排除加载失败（-1）
    imgloadingTime.value += time
  }
  // console.log(`${title} 第 ${index} 张图片加载完成，耗时: ${time.toFixed(2)} ms`)
  console.log(`当前总耗时: ${imgloadingTime.value.toFixed(2)} ms`)
}

// 

const onBindCode = async (parentId: any) => {
  const res = await post('/renren-api/api/member/bindInviteCode', {
    parentId: parentId
  })
  if (res.code = !0) {
    // showFailToast(res.msg)
  }
}
const onFocus = () => {
  console.log("获取焦点");
  router.push({
    path: '/sreach'
  })
}

onMounted(async () => {
  if (route.query.id) {
    onBindCode(route.query.id)
  }
  // 等接口加载完成
  // 等 DOM 渲染完成

  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = store.scrollTop
  }
  // 等图片加载完成
  const images = Array.from(document.images || [])
  let loaded = 0
  const total = images.length

  const finish = () => {
    const endTime = performance.now()
    const loadTime = endTime - startTime
    console.log(`首页完全加载时间: ${loadTime.toFixed(2)}ms`)
  }


  if (total === 0) {
    finish()
  } else {
    images.forEach(img => {
      if (img.complete) {
        loaded++
        if (loaded === total) finish()
      } else {
        img.addEventListener('load', () => {
          loaded++
          if (loaded === total) finish()
        })
        img.addEventListener('error', () => {
          loaded++
          if (loaded === total) finish()
        })
      }
    })
  }

  await store.getConfig()

})

onActivated(() => {
  nextTick(() => {
    if (scrollContainer.value) scrollContainer.value.scrollTop = store.scrollTop
  })
})
</script>



<template>
  <div class="home">
    <div class="home-header">
      <img src="/Image/logo.png" style="width: 64px;height: 16px; margin-right: 10px;" />
      <van-search v-model="store.value" placeholder="影视搜索" @focus="onFocus()"
        style="margin-right: 10px;background-color: #333333;" />
      <img src="/Image/fuli.png" style="width: 46px;height: 32px; margin-right: 10px;" @click="onGo('/sign')" />
      <img src="/Image/Clock.png" style="width: 24px;height: 24px; " @click="onGo('/history')" />
    </div>
    <div class="wrapper">
      <div class="tag-wrapper" ref="tagWrapper">
        <div class="tag-list" ref="tagList">
          <div v-for="(tag, index) in store.tags" :key="tag.dictCode" class="tag-item"
            :class="{ 'active': store.activeTag === tag.dictCode }" @click="selectTag(tag.dictCode, index)">
            {{ tag.dictName }}
          </div>
        </div>
      </div>
      <div class="img" @click="onGo('/taglist')">
        <img src="/menu.png" style="width: 16px;height: 13px;" />
      </div>
    </div>
    <div>
      <van-notice-bar left-icon="volume-o" background="#333333" color="#FFFFFF" :text="store.nottitle" />
    </div>

    <div ref="scrollContainer" class="scroll-container" @scroll="handleScroll">

      <van-swipe   v-if="store.showPlayAd" class="my-swipe" :autoplay="3000" indicator-color="white" style="margin-bottom: 10px;">
        <van-swipe-item v-for="(item, index) in store.banner" :key="index" @click="onOpen(item)">
          <img :src="item.image" style="height: 125px;width: 100%;border-radius: 5px;object-fit: fill;" />
        </van-swipe-item>
      </van-swipe>
      <div></div>
      <AD v-if="store.showAd" :list="store.play"></AD>
      <div v-if="store.activeTag === 0" class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">精选视频</div>
        </div>
        <div class="right">
          <div class="r-text" @click="onGoMore(15, '精选视频')">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div v-if="store.activeTag === 0" class="ranklist">
        <div v-for="(item, index) in store.typelist" :class="['cartoon-item', { 'full-width': index === 0 }]">
          <!-- 骨架屏 -->
          <div v-show="!loadedMap[item.cartoonCode]" :class="['skeleton-item', { 'full-width': index === 0 }]">
            <div class="skeleton-img">
              <van-loading type="spinner" />
            </div>
            <div class="skeleton-text">{{ item.cartoonName }}</div>
          </div>
          <CartoonItemO v-show="loadedMap[item.cartoonCode]" @goVideo="handleGoVideo" :key="index" :item="item"
            :id="item.id" title="精选视频" :index="index" @error="onImgError" @imgLoaded="handleImgLoaded" />
        </div>

      </div>
      <div class="change-bt" v-if="store.activeTag === 0">
        <div class="c-left" @click="onGoMore(15, '精选视频')">查看更多</div>
        <div class="c-right" @click="onRef()"><van-icon name="replay" :class="{ spinning: loadingIndex }" /> 换一批</div>
      </div>
      <div v-if="store.activeTag === 0" class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">排行榜</div>
        </div>
        <div class="right">
          <div class="r-text" @click="onGoMore(15, '排行榜')">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div v-if="store.activeTag === 0" class="ranklist">
        <div v-for="(item, index) in store.rankList" :class="['cartoon-item', { 'full-width': index === 0 }]">
          <div v-show="!loadedMap[item.cartoonCode]" :class="['skeleton-item', { 'full-width': index === 0 }]">
            <div class="skeleton-img">
              <van-loading type="spinner" />
            </div>
            <div class="skeleton-text">{{ item.cartoonName }}</div>
          </div>
          <CartoonItemO v-show="loadedMap[item.cartoonCode]" @goVideo="handleGoVideo" :key="index" :item="item"
            title="排行榜" :index="index" @error="onImgError" @imgLoaded="handleImgLoaded" />
        </div>
      </div>

      <div v-if="store.activeTag === 0" class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">最新更新</div>
        </div>
        <div class="right">
          <div class="r-text" @click="onGoMore(0, '最新更新')">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div class="ranklist">
        <div v-for="(item, index) in store.likeList" :class="['cartoon-item', { 'full-width': index === 0 }]">
          <div v-show="!loadedMap[item.cartoonCode]" :class="['skeleton-item', { 'full-width': index === 0 }]">
            <div class="skeleton-img">
              <van-loading type="spinner" />
            </div>
            <div class="skeleton-text">{{ item.cartoonName }}</div>
          </div>
          <CartoonItem v-show="loadedMap[item.cartoonCode]" @goVideo="handleGoVideo" :key="index" :item="item"
            title="最新更新" :index="index" :cartoon-name="item.cartoonName" @error="onImgError"
            @imgLoaded="handleImgLoaded" />
        </div>
      </div>
      <div style="display: flex;align-items: center;justify-content: center;">
        <van-loading v-if="store.loading" size="24px" color="#FF960C">加载中...</van-loading>
      </div>
      <div style="display: flex;align-items: center;justify-content: center;">
        <van-loading v-if="store.noMore" size="24px" color="#FF960C">没有更多了</van-loading>
      </div>
      <van-back-top bottom="10vh" :style="{ backgroundColor: '#FF960C', borderRadius: '50%' }" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.home {
  max-width: 480px;
  /* 或者 640px / 1080px 等 */
  margin: 0 auto;
  padding: 10px;
  background-color: var(--background-color);
  color: var(--text-color);
  height: 100dvh;
  overflow: hidden;

  .home-header {
    display: flex;
    align-items: center;
  }

  /* 居中 */
  .ranklist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }


}

/deep/ .van-search {
  padding: 0px;
  background: #333333;
  border-radius: 6px;

  .van-search__content {
    background: #333333 !important;
  }

  .van-field__control {
    color: var(--text-color);
  }
}

/deep/ .van-notice-bar {
  border-radius: 5px;
  padding: 0 8px;
  font-size: 12px;
  height: 29px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;

  .tag-wrapper {
    overflow-x: auto;
    /* 横向滚动 */
    white-space: nowrap;
    padding: 10px 0;
    width: calc(100dvw - 30px);
  }

  .tag-list {
    display: flex;
    gap: 10px;
  }

  .tag-item {
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
    font-size: 18px;
    padding-right: 5px;
  }

  .tag-item.active {
    color: var(--primary-color);
    font-weight: bold;
    text-align: left;
    font-size: 18px;
    position: relative;
  }

  /* 底部线条 */
  .tag-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 60%;
    height: 2px;
    background-color: var(--primary-color);
    border-radius: 1px;
  }

  .img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
  }
}

.change-bt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .c-left {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48%;
    height: 32px;
    border-radius: 20px;
    font-size: 16px;
    padding-left: 6px;
    background: linear-gradient(rgb(255, 190, 0) 0%, rgb(255, 150, 12) 104.01%);
    color: black;
    font-weight: bold;
  }

  .c-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48%;
    height: 32px;
    border-radius: 20px;
    font-size: 16px;
    padding-left: 6px;
    background: linear-gradient(rgb(255, 190, 0) 0%, rgb(255, 150, 12) 104.01%);
    color: black;
    font-weight: bold;
  }
}

.spinning {
  animation: spin 0.2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.cartoon-item {
  width: 48%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.full-width {
  width: 100% !important;

  .img-wrapper {
    height: 200px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
<style scoped>
.scroll-container {
  height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>