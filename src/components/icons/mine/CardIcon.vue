<template>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M22.0004 18C22.0004 19.1046 21.1049 20 20.0004 20H4.00037C2.89589 19.9999 2.00037 19.1045 2.00037 18V10H22.0004V18ZM15.0004 16C14.4481 16 14.0004 16.4477 14.0004 17C14.0004 17.5523 14.4481 18 15.0004 18H18.0004C18.5527 18 19.0004 17.5523 19.0004 17C19.0004 16.4477 18.5527 16 18.0004 16H15.0004Z"
            :fill="color ?? '#9AA1AD'" />
        <path d="M20 4C21.1046 4 22 4.89543 22 6L22.0004 8H2.00037L2 6C2 4.89543 2.89543 4 4 4H20Z" fill="#9AA1AD" />
    </svg>

</template>

<script setup lang="ts">
defineProps(['color'])
</script>