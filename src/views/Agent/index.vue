<template>
    <div class="acount">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">资金管理</div>
            <div style="width: 36px;"></div>
        </div>
        <div v-for="(item, index) in list" :key="index" class="ac-list" @click="onGoto(index)">
            <div class="ac-list-item">
                <div style="display: flex;">
                    <img :src="item.icon" />
                    <div style="margin-left: 5px;">{{ item.title }}</div>
                </div>
                <div><van-icon name="arrow" v-if="index < 2" />
                    <div v-else>{{totalSize}}</div>
                </div>
            </div>
        </div>
       

    </div>
</template>
<script setup lang="ts">
import { ref ,onMounted} from "vue"
const O1 = '/setting/01.svg';
const O2 = '/setting/02.svg';
const O3 = '/setting/03.svg';
import { useRouter } from "vue-router";
import { showToast } from "vant";
const router = useRouter()
const totalSize= ref<any>(0)
const list = ref<any>([
    {
        title: '账单查看',
        icon: O1
    },
    {
        title: '申请提现',
        icon: O2
    },
])
const onBack = () => {
    router.back()
}
const onGoto = (index: any) => {
    console.log(index,"index");
    
    if (index === 0) {
        router.push({
            path: '/order'
        })
    }
    if (index === 1) {
        router.push({
            path: '/tx'
        })
    }
   
}

const handleClear=(index: number)=> {
  const keys = ['savedVideos', 'searchHistory', 'videoHistory', 'likedVideos']
  const key = keys[index]
  if (key) {
    localStorage.removeItem(key)
    console.log(`${key} 已清除`)
  }
}
const getLocalStorageKeysSize=(keys: string[])=>{
  return keys.reduce((total, key) => {
    const value = localStorage.getItem(key)
    if (!value) return total
    return total + new Blob([value]).size
  }, 0)
}
const formatBytes=(bytes: number)=> {
  if (bytes < 1024) return bytes + ' B'
  const kb = bytes / 1024
  if (kb < 1024) return kb.toFixed(2) + ' KB'
  const mb = kb / 1024
  if (mb < 1024) return mb.toFixed(2) + ' MB'
  const gb = mb / 1024
  return gb.toFixed(2) + ' GB'
}

// 使用示例


onMounted(()=>{
    const keys = ['savedVideos', 'searchHistory', 'videoHistory', 'likedVideos']
    totalSize.value = formatBytes(getLocalStorageKeysSize(keys) )
})
</script>
<style lang="less" scoped>
.acount {
    height: 100vh;

    .header {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--text-color);

        .tit {
            font-weight: bold;
        }
    }

    .ac-list {
        padding: 10px;
        font-size: 14px;
        display: flex;
        flex-direction: column;

        .ac-list-item {
            border-bottom: 1px solid var(--text-color);
            padding: 10px 0px;
            display: flex;
            justify-content: space-between;
        }
    }

}
</style>