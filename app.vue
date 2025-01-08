<script setup lang="ts">

import {init, useLaunchParams} from "@telegram-apps/sdk-vue";
import {type LaunchParams as TgLaunchParams} from "@telegram-apps/types";

let tgParams: TgLaunchParams;
let username = 'Username';

try {
    init();
    tgParams = useLaunchParams();
    username = tgParams.initData!!.user!!.firstName || 'Empty';
} catch (err) {
    console.log(err);
}

let balance = ref(0);
let taps = ref(0);

onBeforeMount(async () => {
    try {
        await $fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({initData: tgParams.initData}),
        })
    } catch (error) {
        alert('Authentication error: '+ error);
        return;
    }

    try {
        const data = await $fetch('/api/users', {
            method: 'GET',
        });

        if (typeof data === 'number') {
            balance.value = data;
        }
    } catch (error) {
        alert('Getting user\'s data');
    }
});

onBeforeUnmount(async () => {
    if (taps.value > 0) {
        await sendTaps(taps.value);
    }
});

async function sendTaps(value: number): Promise<number> {
    try {
        const data = await $fetch('/api/taps', {
            method: 'POST',
            body: {taps: value}
        });

        if (typeof data === 'number') {
            return data;
        }
    } catch (error) {
        alert('Sending taps to the server error: ' + error);
    }

    return 0;
}

let timeout: number;

function resetTimer() {
    clearTimeout(timeout);
    timeout = window.setTimeout(async () => {
        let newBalance = await sendTaps(taps.value);
        if (newBalance > 0) {
            balance.value = newBalance;
            taps.value = 0;
        }
    }, 1000);
}

function tapHandler(): void {
    taps.value++;
    resetTimer();
}
</script>

<template>
    <main class="min-h-screen mx-auto max-w-md flex flex-col justify-center items-center border border-solid border-slate-300">
        <div class="flex justify-evenly w-full mb-10">
            <div class="font-medium">{{ username }}</div>
            <div class="font-bold"> {{ balance + taps }} <span>Coins</span></div>
        </div>
        <img @click="tapHandler" src="/hamster.png" alt="hamster" class="rounded-full cursor-pointer img-size">
    </main>
</template>

<style>
.img-size {
    width: 70%;
    height: auto;
}

body {
    background: white;
}

img {
    touch-action: manipulation;
}

</style>