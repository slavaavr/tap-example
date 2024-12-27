<script setup lang="ts">
function tap(): void {
  alert("ok");
}
</script>

<template>
  <!--    <div class="">-->
  <!--        <p>Tap The Hamster</p>-->
  <img @click="tap" src="/hamster.png" alt="hamster" class="rounded-full cursor-pointer img-size">
  <!--    </div>-->
</template>

<style scoped>
.img-size {
  width: 50%;
  height: 50%;
}

@media (min-width: 1024px) {
  .img-size {
    width: 20%;
    height: 20%;
  }
}
</style>
