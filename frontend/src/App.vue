<script setup>
import SparksFooter from './components/SparksFooter.vue';

const components = {
  SparksFooter
};
</script>

<template>
    <router-view />
    <components.SparksFooter />
</template>

<style scoped></style>