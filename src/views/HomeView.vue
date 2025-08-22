<script setup lang="ts">
import { post } from '@/utils/request'
import AES from "@/utils/aes1.js"
import { onMounted, ref } from 'vue';
import placeholder from "@/assets/Image/pl.png"
const rankList = ref([])
const typelist = ref([])
const likeList = ref([])
const value = ref('')
const onImgError = (event) => {
  event.target.src = placeholder
}

const onSearch = (val) => {

}
const onCancel = () => {
}
const onGetData = async () => {
  try {
    const res = await post('/app-api/cartoon/listIndex', {
    })
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      rankList.value = data.rankList
      typelist.value = data.typeList.flatMap(item => item.cartoonInfoList)
      console.log(typelist.value, "data");
    }
  } catch (err) {
    console.error('登录失败:', err)
  }
}
const onGetLikeData = async () => {
  try {
    const res = await post('/app-api/cartoon/listIndexLike', {
      currentPage: 1
    })
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      //  rankList.value = data.rankList
      likeList.value = data.distinctNameList

    }
  } catch (err) {
    console.error('登录失败:', err)
  }
}
onMounted(async () => {
  await onGetData()
  await onGetLikeData()
})
</script>

<template>
  <div class="home">
    <div class="home-header">
      <img src="./../assets/Image/logo.png" style="width: 64px;height: 16px; margin-bottom: 10px;" />
      <!-- <van-search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" /> -->
    </div>
    <div class="title-header">
      <div class="left">
        <div class="line"></div>
        <div class="text">排行榜</div>
      </div>
      <div class="right">
        <div class="r-text">查看更多</div><van-icon name="arrow" />
      </div>
    </div>
    <div class="ranklist">
      <div v-for="(item, index) in rankList" class="item">
        <img :src="item.cartoonImage" class="img" @error="onImgError" />
        <div class="name">{{ item.cartoonName }}</div>
      </div>
    </div>
    <div class="title-header">
      <div class="left">
        <div class="line"></div>
        <div class="text">精选视频</div>
      </div>
      <div class="right">
        <div class="r-text">查看更多</div><van-icon name="arrow" />
      </div>
    </div>
    <div class="ranklist">
      <div v-for="(item, index) in rankList" class="item">
        <img :src="item.cartoonImage" class="img" @error="onImgError" />
        <div class="name">{{ item.cartoonName }}</div>
      </div>
    </div>
    <div class="title-header">
      <div class="left">
        <div class="line"></div>
        <div class="text">最新更新</div>
      </div>
      <div class="right">
        <div class="r-text">查看更多</div><van-icon name="arrow" />
      </div>
    </div>
    <div class="ranklist">
      <div v-for="(item, index) in likeList" class="item">
        <img :src="item.cartoonImage" class="img" @error="onImgError" />
        <div class="name">{{ item.cartoonName }}</div>
      </div>
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
  .home-header{
    display: flex;
    align-items: center;
  }

  /* 居中 */
  .ranklist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 48%;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;

      .img {
        border-radius: 5px;
      }

      .name {
        margin-top: 5px;
        font-size: 12px;
        color: var(--text-color);
        line-height: 1.2;
        display: -webkit-box;
        /* 创建伸缩盒子模型 */
        -webkit-line-clamp: 2;
        /* 限制最多显示 2 行 */
        -webkit-box-orient: vertical;
        /* 垂直排列子元素 */
        overflow: hidden;
        /* 超出隐藏 */
        text-overflow: ellipsis;
        /* 显示省略号 */
      }
    }
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
</style>