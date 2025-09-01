<template>
  <div class="sre">
    <div class="header">
      <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
      <div class="tit">{{ title }}</div>
      <div style="width: 22px;"></div>
    </div>
    <div class="sreach-c">
      <van-search v-model="val" placeholder="搜索图片文字视频" style="margin-right: 10px;background-color: #333333;" />
      <div class="ons" @click="onSreach()">搜索</div>
    </div>
    <div class="srelist" ref="scrollContainer" @scroll="onScroll">
      <div v-for="(item, index) in list" :class="['cartoon-item', { 'full-width': index === 0 }]">
        <div v-show="!loadedMap[item.cartoonCode]" :class="['skeleton-item', { 'full-width': index === 0 }]">
          <div class="skeleton-img">
            <van-loading type="spinner" />
          </div>
            <div class="skeleton-text">{{ item.cartoonName }}</div>
        </div>
        <CartoonItem v-show="loadedMap[item.cartoonCode]" @goVideo="handleGoVideo" :key="index" :item="item" title=""
          :index="index" :cartoon-name="item.cartoonName" @error="onImgError" @imgLoaded="handleImgLoaded" />
      </div>
      <van-back-top bottom="10vh" :style="{ backgroundColor: '#FF960C', borderRadius: '50%' }" />


      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="noMore" class="no-more">没有更多数据</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref,reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import CartoonItem from "@/components/CartoonItem.vue"
const router = useRouter()
const route = useRoute()
const title = ref<any>('')
const val = ref<any>('')
const list = ref<any>([])
const currentPage = ref<any>(1)
const loading = ref(false)
const noMore = ref(false)
const cartoonSonType = ref<any>('')
const cartoonType = ref<any>('')
const scrollContainer = ref<HTMLElement | null>(null)
const onBack = () => {
  router.back()
}
// 滚动事件
const onScroll = () => {
  if (!scrollContainer.value || loading.value || noMore.value) return
  const scrollEl = scrollContainer.value
  const scrollBottom = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
  if (scrollBottom < 100) { // 距离底部50px时加载下一页
    onGetData()
  }
}
const onSreach = async () => {
  currentPage.value = 1
  list.value = []
  await onGetData()
}
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
  loadedMap[id] = true
}
const onGetData = async (reset = false) => {
  if (loading.value) return
  loading.value = true

  if (reset) {
    currentPage.value = 1
    list.value = []
    noMore.value = false
  }

  const res = await post('/app-api/cartoon/listPagingBySearch', {
    cartoonSonType: cartoonSonType.value,
    cartoonType: cartoonType.value,
    currentPage: currentPage.value,
    prop: "cartoon_score",
    searchKey: val.value,
    title: title.value
  })

  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
          console.log(data, "分类返回3333333333333333");

    if (data.length < 10) {
      noMore.value = true
    }
    if (reset) {
      list.value = data
    } else {
      list.value.push(...data)
    }
    currentPage.value++
  }

  loading.value = false
}
const handleGoVideo = (item: any) => {
  console.log('即将跳转', item.cartoonCode)
  router.push({
    path: '/videoinfo',
    query: { id: item.cartoonCode }
  }).catch(err => console.warn(err))
}

const onImgError = () => {

}
const isIphoneX = () => {
  const ua = navigator.userAgent
  const isIOS = /iP(hone|od|ad)/.test(ua)
  const { width, height } = window.screen
  // iPhone X/XS: 375 x 812
  // iPhone XR/XS Max: 414 x 896
  // iPhone 12/13/14 mini/pro/max 等同 XR/XS 系列尺寸
  const iphoneXLike =
    (width === 375 && height === 812) ||
    (width === 812 && height === 375) ||
    (width === 414 && height === 896) ||
    (width === 896 && height === 414)

  return isIOS && iphoneXLike
}
onMounted(async () => {
  title.value = route.query.title
  val.value = route.query.searchStr
  if (route.query.sonType) {
    cartoonSonType.value = route.query.sonType
    cartoonType.value = route.query.type
  }
  await onGetData()
  if (isIphoneX()) {
    const header = document.querySelector('.sre') as HTMLElement
    if (header) header.style.paddingTop = '90px'
  }
})
</script>
<style lang="less" scoped>
.sre {
  height: 100vh;
  padding: 10px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;

    .tit {
      font-weight: bold;
    }
  }

  .sreach-c {
    display: flex;
    align-items: center;

    .ons {
      background: linear-gradient(180deg, #FFBE00 0%, #FF960C 100%);
      color: var(--text-color);
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      font-size: 14px;
      padding: 2px 8px;
    }
  }

  .srelist {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-height: calc(100vh - 100px);
    min-height: 200px;
    overflow: auto;
  }

}

/deep/ .van-search {
  width: 100%;
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

.loading,
.no-more {
  text-align: center;
  padding: 10px 0;
  color: var(--primary-color);
  width: 100%;
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
    background-image: url("/Image/pl.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
.cartoon-item {
    width: 48%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .img-wrapper {
    height: 100px;
    background-image: url("/Image/pl.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
 
</style>