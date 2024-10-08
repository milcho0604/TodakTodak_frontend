<template>
    <v-contaniner class="custom-container">
        <v-spacer :style="{height: '50px'}"></v-spacer>
        <div align=center>
            <ButtonComponent
                content="ButtonComponent"
            />
            
            <v-spacer :style="{height: '20px'}"></v-spacer>

            <PlainButtonComponent 
                content="PlainButtonComponent"
            />

            <v-spacer :style="{height: '20px'}"></v-spacer>

            <AvatarChip 
                url="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png"
                name="AvatarChip"
            />
            
            <v-spacer :style="{height: '20px'}"></v-spacer>

            <BasicChip 
                title="Basic Chip"
                color="#0075FF"
            />
            
            <v-spacer :style="{height: '20px'}"></v-spacer>
            
            <CloseableChip 
                title="CloseableChip"
                color="#0075FF"
            />
        </div>
    </v-contaniner>

</template>
  
<script>
import ButtonComponent from '@/components/button/ButtonComponent.vue';
import PlainButtonComponent from '@/components/button/PlainButtonComponent.vue';
import AvatarChip from '@/components/chip/AvatarChip.vue';
import BasicChip from '@/components/chip/BasicChip.vue';
import CloseableChip from '@/components/chip/CloseableChip.vue';

export default {
    components:{
    ButtonComponent,
    PlainButtonComponent,
    AvatarChip,
    BasicChip,
    CloseableChip
    },
    data(){
        return{

        }
    }
}

</script>

<style scoped>

</style>
