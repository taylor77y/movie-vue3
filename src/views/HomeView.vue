

<script setup lang="ts">
import { onMounted, nextTick, onActivated, ref } from 'vue'
import { useHomeStore } from '@/store/home'
import CartoonItem from "./../components/CartoonItem.vue"
import CartoonItemO from "./../components/CartoonItemO.vue"
import placeholder from "@/assets/Image/pl.png"
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'

const store = useHomeStore()

const scrollContainer = ref<HTMLElement | null>(null)
const tagWrapper = ref<HTMLElement | null>(null)
const tagList = ref<HTMLElement | null>(null)

// 图片错误占位
const onImgError = (event: any) => {
  event.target.src = placeholder
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
  console.log(store.activeTag ,"store.activeTag ");
  
  // 请求数据
  if (store.activeTag === 0) {
    await store.getLikeData()
  } else {
    const res = await post('/app-api/cartoon/listPaging', {
      currentPage: store.currentPage,
      type: '全部',
      typeCode: store.activeTag
    })
    if(res.code===0){
        const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      store.likeList = data.list
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
const onOpen = (url: string) => window.open(url, '_blank')

// 初始化
onMounted(async () => {
  await store.initHome()
  nextTick(() => {
    if (scrollContainer.value) scrollContainer.value.scrollTop = store.scrollTop
  })
})

onActivated(() => {
  nextTick(() => {
    if (scrollContainer.value) scrollContainer.value.scrollTop = store.scrollTop
  })
})
</script>



<template>
  <div class="home" >
    <div class="home-header">
      <img src="./../assets/Image/logo.png" style="width: 64px;height: 16px; margin-right: 10px;" />
      <van-search v-model="store.value" placeholder="影视搜索" @click-input="store.onSearch" style="margin-right: 10px;background-color: #333333;"  />

      <img src="./../assets/home/fuli.png" style="width: 46px;height: 32px; margin-right: 10px;" />
      <img src="./../assets/home/Clock.png" style="width: 24px;height: 24px; " />
    </div>
    <div class="wrapper">
      <div class="tag-wrapper" ref="tagWrapper">
        <div class="tag-list" ref="tagList">
          <div  v-for="(tag,index) in store.tags" :key="tag.dictCode" class="tag-item"
            :class="{ 'active': store.activeTag === tag.dictCode }" @click="selectTag(tag.dictCode,index)">
            {{ tag.dictName }}
          </div>
        </div>
      </div>
      <div class="img">
        <img src="./../assets/home/menu.png" style="width: 16px;height: 13px;" />
      </div>
    </div>
    <div>
      <van-notice-bar left-icon="volume-o" background="#333333" color="#FFFFFF" :text="store.nottitle" />
    </div>
    <div ref="scrollContainer" class="scroll-container" @scroll="handleScroll" >
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" style="margin-bottom: 10px;">
        <van-swipe-item v-for="(item,index) in store.banner" :key="index" @click="onOpen(item.h5Url)">
          <img :src="item.image" style="height: 125px;width: 100%;border-radius: 5px;object-fit: cover;" />
        </van-swipe-item>
      </van-swipe>
      <div v-if="store.activeTag === 0" class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">精选视频</div>
        </div>
        <div class="right">
          <div class="r-text">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div v-if="store.activeTag === 0" class="ranklist">
        <CartoonItemO v-for="(item, index) in store.typelist" :key="item.id" :item="item" :index="index"
          @error="onImgError" />
      </div>

      <div v-if="store.activeTag === 0" class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">排行榜</div>
        </div>
        <div class="right">
          <div class="r-text">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div v-if="store.activeTag === 0" class="ranklist">
            <CartoonItemO v-for="(item, index) in store.rankList" :key="item.id" :item="item" :index="index"
          @error="onImgError" />
      </div>
      <div v-if="store.activeTag === 0" class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">最新更新</div>
        </div>
        <div class="right">
          <div class="r-text">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div class="ranklist">
        <CartoonItem v-for="item in store.likeList" :key="item.id" :item="item" :cartoon-name="item.cartoonName"
          @error="onImgError" />
      </div>
      <div style="display: flex;align-items: center;justify-content: center;">
        <van-loading v-if="store.loading" size="24px" color="#FF960C">加载中...</van-loading>
      </div>
         <div style="display: flex;align-items: center;justify-content: center;">
            <van-loading v-if="store.noMore" size="24px" color="#FF960C">没有更多了</van-loading>
         </div>
      <van-back-top  bottom="10vh"  :style="{ backgroundColor: '#FF960C', borderRadius: '50%' }"/>
      
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

  .title-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    height: 25px;

    .left {
      color: rgb(255, 150, 12);
      display: flex;
      align-items: center;
      line-height: 25px;

      .line {
        width: 3px;
        height: 16px;
        background-color: var(--primary-color);
        margin-right: 5px;
        border-radius: 3px;
      }

      .text {
        color: var(--primary-color);
        font-size: 16px;
        font-weight: bold;
      }
    }

    .right {
      color: white;
      font-size: 13px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 25px;

      .r-text {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 25px;
      }
    }
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
    justify-content: end;
    width: 30px;
  }
}
</style>
<style scoped>
.scroll-container {
 height: calc(100dvh - 200px);
  overflow-y: auto;
}

</style>