<template>
    <div class="collent">
        <div class="header">
            <div></div>
            <div class="tit">收藏</div>
            <div><van-icon name="delete-o" size="22" v-if="savedVideos.length > 0" @click="onClear()" /></div>
        </div>
        <Empty v-if="savedVideos.length === 0" description="暂无收藏" />
        <div v-else class="list">
             <div v-for="(item, index) in savedVideos" :class="['cartoon-item']">
            <CartoonItem @goVideo="handleGoVideo"  :key="item.id" :item="item"
                :index="index" @error="onImgError" />
                </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import CartoonItem from "./../components/CartoonItem.vue"
import { onMounted, ref } from 'vue';
import { Empty, showConfirmDialog, showToast } from 'vant';
import router from "@/router";
const savedVideos = ref<any>([])
const onGetSaveList = () => {
    const data = localStorage.getItem('savedVideos')
    if (data) {
        try {
            savedVideos.value = JSON.parse(data)
            // savedVideos.value = [...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value,...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value,...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value,...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value,...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value,...savedVideos.value, ...savedVideos.value, ...savedVideos.value, ...savedVideos.value,]
            console.log('收藏列表', savedVideos.value)
        } catch (err) {
            console.error('解析收藏列表失败', err)
            savedVideos.value = []
        }
    } else {
        savedVideos.value = []
    }
}
const handleGoVideo = (item:any) => {
  console.log('即将跳转', item.cartoonCode)
  router.push({
    path: '/videoinfo',
    query: { id: item.cartoonCode }
  }).catch(err => console.warn(err))
}

const onImgError = () => {

}
const onClear = () => {
    showConfirmDialog({
        title: '确认清空',
        message: '确定要清空所有收藏吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonColor: "#FF960C",
        className: 'isdialog'
    })
        .then(() => {
            // 用户确认清空
            savedVideos.value = []
            localStorage.removeItem('savedVideos')
            showToast('清除成功')
        })
        .catch(() => {
            showToast('取消')
            // 用户取消，不做任何操作
        })
}
onMounted(() => {
    onGetSaveList()
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
        height: 50px;

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
.isdialog {
    background-color: var(--br-color) !important;

    .van-dialog__header {
        color: var(--text-color);
    }
}

.isdialog .van-button--default {
    background-color: var(--br-color) !important;
    color: var(--text-color);
}
</style>