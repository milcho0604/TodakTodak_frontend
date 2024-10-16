<template>
    <v-container>
      <v-row class="member-header" justify="center" align="center">
        <v-col cols="auto" class="d-flex align-center">
          <div class="header-title">회원 목록</div>
        </v-col>
      </v-row>
  
      <v-row v-for="(member, index) in members" :key="index" class="member-container">
        <v-col cols="12" md="8" offset-md="2">
          <v-card class="member-box" variant="flat">
            <v-card-text>
              <div class="member-content d-flex">
                <v-avatar size="60" class="mr-4">
                  <v-img :src="member.profileImgUrl" />
                </v-avatar>
                <div>
                  <v-card-title class="member-title">{{ member.name }}</v-card-title>
                  <p class="member-info">
                    이메일: {{ member.memberEmail }} | 전화번호: {{ member.phone }}
                  </p>
                  <p class="member-info">
                    주소: {{ member.address.city }}, {{ member.address.street }} ({{ member.address.zipcode }})
                  </p>
                  <v-chip :color="member.verified ? 'green' : 'red'" dark>
                    {{ member.verified ? '인증 회원' : '미인증 회원' }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        members: [],
      };
    },
    methods: {
      fetchMembers() {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/list`)
          .then((response) => {
            this.members = response.data.result.content;
          })
          .catch((error) => {
            console.error('Error fetching members:', error);
          });
      },
    },
    mounted() {
      this.fetchMembers(); 
    },
  };
  </script>
  
  <style scoped>
  .member-container {
    margin-bottom: 20px;
  }
  
  .member-box {
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #dbdbdb;
    height: 250px;
    cursor: pointer;
  }
  
  .member-box:hover {
    background-color: #f9f9f9;
  }
  
  .member-title {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #000000;
  }
  
  .member-info {
    font-family: 'ABeeZee', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
    margin-top: 10px;
  }
  
  .member-header {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .header-title {
    font: bold;
    font-family: 'Inter';
    font-weight: 700;
    font-size: 30px;
    color: #000000;
    text-align: center;
    margin-bottom: 10px;
  }
  </style>
