<template>
    <div class="tixian">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">提现</div>
            <div style="width: 36px;"></div>
        </div>
      
       </div>
</template>
<script setup lang="ts">
import { ref ,onMounted} from "vue"
import O1 from "./../../assets/setting/01.svg"
import O2 from "./../../assets/setting/02.svg"
import { useRouter } from "vue-router";
const router = useRouter()
const totalSize= ref<any>(0)

const onBack = () => {
    router.back()
}

onMounted(()=>{
})
</script>
<style lang="less" scoped>
.tixian {
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