<template>
    <div class="order">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">记录</div>
            <div style="width: 36px;"></div>
        </div>
        <van-tabs v-model:active="active" color="rgb(242, 145, 0)">
            <van-tab title="充值记录"></van-tab>
            <van-tab title="金币记录"></van-tab>
            <van-tab title="提现记录"></van-tab>
        </van-tabs>
        <van-empty v-if="list.length === 0" image="error" description="无记录" />
        <div v-else-if="list.length && active === 1" class="o-h">
            <div class="je" v-for="(item) in list">
                <div class="flex-c">
                    <div>订单号:{{ item.title }}</div>
                    <div>{{ item.amountSource }}</div>
                </div>
                <div class="flex-c">
                    <div style="font-size: 14px;">消费金额</div>
                    <div style="display: flex;align-items: center;">
                        <div style="color: rgb(242, 145, 0);font-size: 16px;">${{ item.price }}</div>金币
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="list.length && active === 0" class="o-h">
            <div class="je jee" v-for="(item) in list">
                <div class="flex-c">
                     <div>订单号:{{ item.title }}</div>
                     <div style="font-size: 14px;">充值金额</div>
                </div>
                <div class="flex-c">
                    <div style="font-size: 14px;"></div>
                    <div style="display: flex;align-items: center;">
                        <div style="color: rgb(242, 145, 0);font-size: 16px;">${{ item.price }}</div>金币
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import { useRouter } from "vue-router";
const router = useRouter()
const active = ref<any>(0)
const onBack = () => {
    router.back()
}
watch(active, async (newVal, oldVal) => {
    console.log('activeIndex 变了:', oldVal, '👉', newVal)
    await onGetData(newVal)
    // 这里写你要执行的逻辑
})
const list = ref<any>([])
const onGetData = async (index: any) => {
    const res = await post('/app-api/member/index', {
        index: index,
    })
    if (res.code === 0) {
        const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
        list.value = data
        console.log(list.value, "list.value");
    }
}
onMounted(async () => {
    await onGetData(0)
})
</script>
<style lang="less" scoped>
.order {
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

/deep/ .van-tabs__nav {
    background-color: var(--background-color);
}


/deep/ .van-tab--line {
    .van-tab__text {
        font-weight: bold;
        color: white;
    }
}

/deep/ .van-tab--active {

    .van-tab__text {
        color: var(--primary-color);
    }
}
.o-h{
 height: calc(100vh - 91px);
 overflow: auto;
 .je {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    padding-top: 5px;

    .flex-c {
        display: flex;
       flex-direction: column;
    }
}
}
.jee{
    align-items: end;
}

</style>