<template>
    <v-container class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row justify="center" align="center" class="inter-bold title">
            <v-col class="d-flex align-center justify-center">
                <img src="@/assets/doctor.png" width="50px" />
                <span style="margin-left: 10px;">의사 정보</span>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="8"> 
                <v-card style="max-width: 700px; margin: auto; padding:20px"> 
                    <v-row>
                        <v-col>
                            <h4>
                                <v-avatar size="50">
                                    <v-img :src="doctorDetails?.doctorImageUrl || '@/assets/doctor.png'" />
                                </v-avatar>
                                {{ doctorDetails?.doctorName }}
                            </h4>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>{{ doctorDetails?.doctorEmail }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>{{ doctorDetails?.bio }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>리뷰 수: {{ doctorDetails?.reviewCount }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>평점: {{ doctorDetails?.reviewPoint }}</v-col>
                    </v-row>
                    <v-row>
                        <template v-if="operatingHours.length">
                            <v-col v-for="hour in operatingHours" :key="hour.id" class="my-2">
                                <div>
                                    <strong>{{ hour.dayOfWeek }}</strong>: 
                                    {{ hour.openTime }} - {{ hour.closeTime }} 
                                    <span v-if="hour.untact">(비대면 가능)</span>
                                </div>
                            </v-col>
                        </template>
                        <template v-else>
                            <v-col>운영 시간이 없습니다.</v-col>
                        </template>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['doctorEmail', 'doctorDetails']),
        operatingHours() {
            return this.doctorDetails?.operatingHours || [];
        },
    },
    watch: {
        doctorEmail(newEmail) {
            if (newEmail) {
                this.fetchDoctorDetail();
            }
        },
    },
    methods: {
        async fetchDoctorDetail() {
            if (!this.doctorDetails) {
                await this.$store.dispatch('fetchDoctorDetails', this.doctorEmail);
            }
        },
    },
    mounted() {
        if (this.doctorEmail) {
            this.fetchDoctorDetail();
        }
    },
}
</script>

<style scoped>
</style>
