<template>
    <div class="cateInfo">
         <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left"  color="white" size="22"/></div>
            <div class="tit">专题列表</div>
            <div ></div>
        </div>
        <div class="list" ref="scrollContainer" @scroll="onScroll">
            <div style="width: 100%;height: 165px;position: relative;">
                <img :src="path" style="width: 100%;height: 165px;"/>
                <div  class="rtitle">{{ title }}</div>
            </div>
            <div class="list-con">
                <CateInfoItem @goVideo="handleGoVideo" v-for="item in list" :key="item.id" :item="item"  title="专题"
          @error="onImgError" >
                </CateInfoItem>
            </div>
               <van-back-top bottom="10vh" :style="{ backgroundColor: '#FF960C', borderRadius: '50%' }" />
              <div v-if="loading" class="loading">加载中...</div>
      <div v-if="noMore" class="no-more">没有更多了</div>
        </div>
        
    </div>
</template>
<script setup lang="ts">
import { useRouter,useRoute } from "vue-router";
import { onMounted,ref } from "vue"
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import CateInfoItem from "@/components/CateInfoItem.vue"
const router = useRouter()
const route = useRoute()
const onBack =()=>{
    router.back()
}
const scrollContainer= ref<any>(null)
const list = ref<any>([])
const sonTypeCode = ref<any>(0)
const code = ref<any>(0)
const title = ref<any>('')
const currentPage = ref<any>(1)
const path = ref<any>('')
const loading= ref<any>(false)
const noMore = ref<any>(false)
const handleGoVideo= ()=>{

}
const onImgError= ()=>{
    
}
// 滚动事件
const onScroll = () => {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  // 滚动到底部 100px 时触发
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
    onGetData()
  }
}
const onGetData = async () => {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const res = await post('/app-api/cartoon/selectSubjectMovies', {
      currentPage: currentPage.value,
      sonTypeCode: sonTypeCode.value,
      typeCode: code.value
    })
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      if (data.length != 10) noMore.value = true
      list.value = [...list.value, ...data]
      currentPage.value++
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
onMounted(async()=>{
    const itemStr = route.query.item as string
    if (itemStr) {
        const itemObj = JSON.parse(decodeURIComponent(itemStr))
        console.log(itemObj)
          path.value = itemObj.path
          sonTypeCode.value = itemObj.sonTypeCode
            code.value =  itemObj.code
            title.value = itemObj.title
           await onGetData()
    }
})
</script>
<style lang="less" scoped>
.cateInfo {
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
    .list {
        
        height: calc(100vh - 50px);
        overflow: auto;
        display: flex;
        flex-direction: column;
        .rtitle{
            position: absolute;bottom: 0px;left: 20px;
            color: var(--text-color);
            font-size: 24px;
            font-weight: bold;
        }
          
        .list-con{
            display: flex;
            flex-wrap: wrap;
              justify-content: space-between;
              margin-top: 20px;
        }
    }
}
.loading,
.no-more {
  text-align: center;
  padding: 10px 0;
  color: var(--primary-color);
}
</style>