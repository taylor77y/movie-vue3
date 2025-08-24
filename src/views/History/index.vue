<template>
    <div class="collent">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left"  color="white" size="22"/></div>
            <div class="tit">历史记录</div>
            <div @click="onClear()"><van-icon name="delete-o" size="22"  /></div>
        </div>
        <Empty v-if="videoHistory.length === 0" description="暂无收藏" />
        <div v-else class="list">
            <CartoonItem @goVideo="handleGoVideo" v-for="item in videoHistory" :key="item.id" :item="item"
                @error="onImgError" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import CartoonItem from "./../../components/CartoonItem.vue"
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { Empty ,showConfirmDialog,showToast} from 'vant';
const router = useRouter()
const videoHistory = ref<any>([])
const onGetHisList = () => {
    const data = localStorage.getItem('videoHistory')
    if (data) {
        try {
            videoHistory.value = JSON.parse(data)
            // videoHistory.value = [...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value,...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value,...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value,...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value,...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value,...videoHistory.value, ...videoHistory.value, ...videoHistory.value, ...videoHistory.value,]
            console.log('收藏列表', videoHistory.value)
        } catch (err) {
            console.error('解析收藏列表失败', err)
            videoHistory.value = []
        }
    } else {
        videoHistory.value = []
    }
}
const onBack =()=>{
    router.back()
}
const handleGoVideo = () => {

}
const onImgError = () => {

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
      videoHistory.value = []
      localStorage.removeItem('history')
      showToast('历史记录清除成功')
    })
    .catch(() => {
         showToast('取消')
      // 用户取消，不做任何操作
    })
}
onMounted(() => {
    onGetHisList()
})
</script>
<style lang="less" scoped>
.collent {
    height: calc(100vh - 50px);
    overflow: hidden;
    color: var(--text-color);
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
        min-height: 120px;
        max-height: calc(100vh - 100px);
        overflow-y: auto;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    
    
}

</style>
<style lang="less">
.isdialog{
    background-color: var( --br-color) !important;
    .van-dialog__header{
         color: var(--text-color);
    }
}

.isdialog .van-button--default{
  background-color: var(--br-color) !important;
   color: var(--text-color);
}
</style>