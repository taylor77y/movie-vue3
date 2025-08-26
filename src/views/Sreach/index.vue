<template>
  
    <div class="sreach">
         <div class="header">
            <div @click="onBack()" style="margin-right: 5px;"><van-icon name="arrow-left"  color="white" size="22"/></div>
           <van-search v-model="val" placeholder="搜索图片文字视频"  style="margin-right: 10px;background-color: #333333;"  />
            <div @click="onGoSearch()">搜索</div>
        </div>
         <div class="hot-section">
            <div class="section-title">
                <div style="display: flex;align-items: center;"><van-icon name="underway" size="20" /><div style="margin-left:5px;">历史记录</div></div>
                <div><van-icon name="delete-o" color="white" size="20" @click="onClear()" /></div>
            </div>
            <div class="taglist" v-if="history.length > 0">
                <div v-for="(item) in history" class="tag hot" @click="onSearch(item)">{{ item }}</div>
            </div>
        </div>
        <div class="hot-section">
            <div class="section-title">
                <div>热搜词</div>
            </div>
            <div class="taglist">
                <div v-for="(item) in list" class="tag hot" @click="onAddSearch(item)">{{ item }}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref,onBeforeUnmount } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter()
const val = ref<any>('')
const history = ref<any>([])
const list = ref([
    '学生','自慰','乱伦','姐姐','老师','妈妈','黑丝','强奸','妹妹','萝莉','巨乳','调教','按摩','内射','COS'
])

import { showConfirmDialog,showToast} from 'vant';
const onBack =()=>{
    router.back()
}
const onGoSearch= ()=>{
     onSearch(val.value)
}
const onAddSearch=(item:any)=>{
    onSearch(item)
}
const onClear = () => {
  showConfirmDialog({
    title: '确认清空',
    message: '确定要清空历史记录吗？',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonColor:"#FF960C",
    className:'isdialog'
  })
    .then(() => {
      // 用户确认清空
      history.value = []
      localStorage.removeItem('searchHistory')
      showToast('历史记录清除成功')
    })
    .catch(() => {
         showToast('取消')
      // 用户取消，不做任何操作
    })
}
// 点击搜索
const onSearch = (keyword:any) => {
  if (!keyword) return
  // 去重
  history.value = [keyword, ...history.value.filter((item:any) => item !== keyword)]
  router.push({
        path:'/sreinfo',
        query:{
            searchStr:keyword,
            title:'搜索',
            sonType:'',
            type:''
        }
   })
  // 保留最多10条
  if (history.value.length > 10) history.value = history.value.slice(0, 10)
  localStorage.setItem('searchHistory', JSON.stringify(history.value))
   
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
// 加载本地历史
onMounted(() => {
  const local = localStorage.getItem('searchHistory')
  if (local) history.value = JSON.parse(local)
    if (isIphoneX()) {
    const header = document.querySelector('.sreach') as HTMLElement
    if (header) header.style.paddingTop = '90px'
    }
})


</script>

<style lang="less" scoped>
.sreach{
    height: 100vh;
    padding:0 10px;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
    }
    .hot-section{
        .section-title{
            font-size: 14px;
            margin: 10px 0;
            display: flex;
            justify-content: space-between
        }
        .taglist{
            display: flex;
            flex-wrap: wrap;
            .tag{
                background-color: #555;
                padding: 5px 10px;
                border-radius: 4px;
                margin: 5px 9px 0 0;
            }
            .tag.hot{
                background-color: #777;
            }
        }
    }
}
/deep/ .van-search {
  padding: 0px;
  background: #333333;
  border-radius: 6px;
  flex: 6.3;

  .van-search__content {
    background: #333333 !important;
  }

  .van-field__control {
    color: var(--text-color);
  }
}
</style>