<template>
<v-chip :color=color closable size="large">
  {{ title }}
</v-chip>
</template>
<script>
export default{
    props: {
        title: String,
        color: String
    },
}
</script>