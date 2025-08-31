<template>
  <div class="flex-d" >
    <div class="flex">
        <div v-for="(item) in list" :key="item.id" class="flex-ad" @click="onOpen(item)">
            <img  :src="item.img" class="adimg" />
            <div class="adtitle">{{ item.title }}</div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
// 定义 props
const props = defineProps<{
  list: any
}>()
const onOpen = async(item: any) => {
  const res = await post('/app-api/member/swiperAdClickCount', {
    id:item.id
  })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
  }
  window.open(item.url, '_blank')
}
// 模板中直接用 props.list
const list = props.list
</script>
<style lang="less" scoped>
.flex-d{
    display: flex;
    justify-content: space-between;
    .flex{
        width: 100%;
        display: flex;
        align-items: start;
        justify-content: start;
        flex-wrap: wrap;
        .flex-ad{
            width: 19%;
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-bottom: 10px;
            margin-right: 1%;
             .adimg{
                width: 100%;
                height: 56px;
                border-radius: 8px;
                object-fit: cover;
            }
            .adtitle{
                padding-top: 5px;
                font-size: 12px;
                text-align: center;
                width: 56px;
            }
        }
    }
  
}
</style>
