<template>
    <div class="tag">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit"></div>
            <div ></div>
        </div>
        <div class="flex">     <van-search v-model="value" placeholder="搜索" 
        style="margin-right: 10px;background-color: #333333;width: 85%;"  /> <div class="ons">搜索</div> </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { post } from '@/utils/request'
import { onMounted,ref } from "vue";
const value= ref<any>('')
const router = useRouter()

const onBack = () => {
    router.back()
}
const onGetTag =async()=>{
     const res = await post('/app-api/cartoon/listLeftType', {
        dictCode: "",dictLevel: 1
    })
    if (res.code === 0) {
      console.log(res.data,"data");
    }
}
onMounted(async()=>{
    await onGetTag()
})
</script>
<style lang="less" scoped>
.tag {
    height: 100vh;
    padding: 10px;
    overflow: hidden;
     .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;

        .tit {
            font-weight: bold;
        }
    }
    .flex{
        display: flex;
        align-items: center;
         .ons{
            background: linear-gradient(180deg, #FFBE00 0%, #FF960C 100%);
            color: black;
            width: 15%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            font-size: 14px;
            padding: 2px 8px;
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
</style>