<template>
    <v-btn v-if="!type" class="rounded-xl text-body-1 font-weight-bold"
        :style="{ color: color ? color : '#00499E', background: background ? background : '#C2D7FF' }">
        {{ content }}
    </v-btn>

</template>

<script>
export default {
    name: 'ButtonComponent',
    props: ['content', 'color', 'background', 'type'],
}
</script>