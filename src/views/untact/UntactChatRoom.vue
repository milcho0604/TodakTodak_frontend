<template>
  <div class="text-center">
    <v-container class="custom-container">
      <div>
        
      </div>
      <v-row justify="center" class="mt-4" style="width: 900px; margin: 0 auto;">
        <v-col cols="4" class="text-center">
          <v-row justify="center" class="inter-bold dark-blue subtitle">진료자</v-row>
          <v-row justify="center" class="mt-6">
            <v-col class="text-center" cols="5">
              <v-avatar size="60">
                <v-img
                  :src="doctor.profileImg ? doctor.profileImg : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'"
                  alt="doctor image" />
              </v-avatar>
            </v-col>
            <v-col class="text-center mt-3" cols="7">
              <v-row class="inter-bold big-font">{{ doctor.doctorName }} 의사</v-row>
              <v-row class="inter-bold small-font">{{ doctor.hospitalName }}</v-row>
              <v-row class="inter-normal small-font-black">
                <v-icon class="star-icon">mdi-star</v-icon>
                {{ doctor.reviewPoint }} ({{ doctor.reviewCount }})</v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-row justify="center" class="inter-bold dark-blue subtitle">진료대상</v-row>
          <v-row justify="center" class="mt-4">
            <div class="child">
              <v-row justify="center">
                <v-col class="text-center" cols="5">
                  <v-avatar size="60">
                    <v-img :src="child.imageUrl" alt="doctor image" />
                  </v-avatar>
                </v-col>
                <v-col class="text-center" cols="7" style="margin: 15px auto;">
                  <v-row class="inter-bold big-font">{{ child.name }}</v-row>
                  <v-row class="inter-normal small-font">{{ child.ssn }}</v-row>
                </v-col>
              </v-row>
            </div>
          </v-row>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-row justify="center" class="inter-bold dark-blue subtitle">진료항목</v-row>
          <v-row justify="center" class="mt-6">
            <div class="round inter-normal dark-blue">일반진료</div>
          </v-row>
        </v-col>
      </v-row>
      <div class="video-container mt-10">
        <video class="local_video" :class="{ small: isRemoteVideoVisible }" ref="localVideo" autoplay playsinline
          style="transform: scaleX(-1);"></video>
        <video class="remote_video" :class="{ tiny: !isRemoteVideoVisible }" ref="remoteVideo" autoplay playsinline
          style="transform: scaleX(-1);"></video>
      </div>
      <div id="buttons">
        <button type="button" class="button inter-bold" @click="exitRoom">
          진료 종료
        </button>
      </div>

      <!-- 리뷰 모달 -->
      <ReviewComponent v-model="reviewModal" :reservationId=this.sid @update:dialog="reviewModal = $event;"
        @openPayModal="openPayModal" />

      <!-- 결제 모달 -->
      <SinglePaymentComponent v-model:showPaymentModal="payModal" :reservationId="sid" />
      <!-- 리뷰 모달 닫으면서 payModal true로 바뀌게 해뒀습니다 -->
    </v-container>
  </div>
</template>

<script>
import ReviewComponent from '@/components/ReviewComponent.vue';
import SinglePaymentComponent from '@/components/pay/SinglePaymentComponent.vue'; // PaymentComponent 추가
import axios from 'axios';

export default {
  props: ['sid'],
  components: {
    ReviewComponent,
    SinglePaymentComponent
  },
  data() {
    return {
      localStream: null,
      localVideoTracks: null,
      myPeerConnection: null,
      localRoom: this.sid,
      localUserName: localStorage.getItem("token"),
      socket: null,
      isRemoteVideoVisible: false, // 상대방 화면 여부 체크
      doctor: { imageUrl: "https://todak-file.s3.amazonaws.com/9227db48-1e3a-4559-9ff9-fad2db9cd68b_스크린샷 2024-10-08 오후 2.08.28.png" },
      child: { imageUrl: "https://todak-file.s3.amazonaws.com/9227db48-1e3a-4559-9ff9-fad2db9cd68b_스크린샷 2024-10-08 오후 2.08.28.png" },
      medicalChartId: null,
      chartCreated: false,
      reviewModal: false,
      payModal: false
    };
  },
  created() {
    this.fetchReservation();
  },
  mounted() {
    this.startWebSocketConnection();
  },
  methods: {
    async fetchReservation() {
      try {
        // 예약 정보를 가져옴
        const reservationResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/get/${this.sid}`);
        const reservationData = reservationResponse.data.result;
        console.log("Reservation Data:", reservationData);

        // doctorEmail로 의사 정보를 가져옴
        const doctorResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor/${reservationData.doctorEmail}`);
        this.doctor = doctorResponse.data.result;
        console.log("Doctor Data:", this.doctor);

        // 자녀 ID로 자녀 정보를 가져옴
        const childResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/detail/${reservationData.childId}`);
        this.child = childResponse.data;
        console.log("Child Data:", this.child);

        // 이후 로직 (예: state에 저장 등)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    startWebSocketConnection() {
      // this.socket = new WebSocket(`wss://server.todak.site/reservation-service/signal`);
      this.socket = new WebSocket(`ws://localhost:8080/reservation-service/signal`);

      this.socket.onopen = () => {
        console.log(`WebSocket connection opened to Room: #${this.localRoom}`);
        this.sendToServer({
          from: this.localUserName,
          type: 'join',
          data: this.localRoom
        });
      }
      this.socket.onclose = () => {
        console.log('Socket has been closed');
        this.reconnectWebSocket();
      };

      this.socket.onerror = (message) => {
        this.handleErrorMessage(`Error: ${message}`);
      };
      this.socket.onmessage = (msg) => {
        let message = JSON.parse(msg.data);
        console.log(message);
        switch (message.type) {
          case "text":
            console.log(`Text message from ${message.from} received: ${message.data}`);
            break;
          case "offer":
            console.log('Signal OFFER received');
            this.handleOfferMessage(message);
            break;
          case "answer":
            console.log('Signal ANSWER received');
            this.handleAnswerMessage(message);
            break;
          case "ice":
            console.log('Signal ICE Candidate received');
            this.handleNewICECandidateMessage(message);
            break;
          case "join":
            console.log('Client is starting to ' + (message.data === "true)" ? 'negotiate' : 'wait for a peer'));
            this.handlePeerConnection(message);
            break;
          case "leave":
            console.log(`User ${message.from} has left the room`);
            this.handlePeerLeave(message);
            break;
          default:
            this.handleErrorMessage('Wrong type message received from server');
        }
      };
    },
    reconnectWebSocket() {
      console.log('Attempting to reconnect WebSocket...');
      setTimeout(() => {
        this.startWebSocketConnection();  // 5초 후 재연결 시도
      }, 5000);
    },
    handleOfferMessage(message) {
      console.log('Accepting Offer Message');
      let desc = new RTCSessionDescription(message.sdp);
      if (desc && message.sdp) {
        console.log('RTC Signalling state: ' + this.myPeerConnection.signalingState);
        this.myPeerConnection.setRemoteDescription(desc)
          .then(() => navigator.mediaDevices.getUserMedia({ audio: true, video: true }))
          .then(stream => {
            this.localStream = stream;
            this.$refs.localVideo.srcObject = stream;  // localVideo에 stream 연결
            this.localStream.getTracks().forEach(track => this.myPeerConnection.addTrack(track, this.localStream));
          })
          .then(() => this.myPeerConnection.createAnswer())  // answer 생성
          .then(answer => this.myPeerConnection.setLocalDescription(answer))
          .then(() => this.sendToServer({
            from: this.localUserName,
            type: 'answer',
            sdp: this.myPeerConnection.localDescription,
            data: this.localRoom
          }))
          .catch(this.handleErrorMessage);
      }
    },
    handlePeerConnection(message) {
      this.createPeerConnection();
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          this.localStream = stream;
          this.$refs.localVideo.srcObject = stream;
          stream.getTracks().forEach(track => this.myPeerConnection.addTrack(track, this.localStream));
        });
      if (message.data && !this.chartCreated) {
        // 차트가 아직 생성되지 않았을 때만 API 요청
        this.createMedicalChart();
        this.chartCreated = true; // 차트 생성 상태 업데이트
      }
      if (message.data) {
        this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
      }
    },
    handleNegotiationNeededEvent() {
      this.myPeerConnection.createOffer()
        .then(offer => {
          return this.myPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          this.sendToServer({
            from: this.localUserName,
            type: 'offer',
            sdp: this.myPeerConnection.localDescription,
            data: this.localRoom
          });
          console.log('Negotiation Needed Event: SDP offer sent');
        })
        .catch(reason => {
          // an error occurred, so handle the failure to connect
          console.log(reason);
        });
    },
    createPeerConnection() {
      const peerConnectionConfig = {
        iceServers: [
          { urls: 'stun:stun.stunprotocol.org:3478' },
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
      this.myPeerConnection = new RTCPeerConnection(peerConnectionConfig);
      this.myPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendToServer({
            from: this.localUserName,
            type: 'ice',
            candidate: event.candidate,
            data: this.localRoom
          });
        }
      };
      this.myPeerConnection.ontrack = (event) => {
        this.$refs.remoteVideo.srcObject = event.streams[0];
        this.isRemoteVideoVisible = true;  // 상대방 화면이 있음을 표시
      };
    },
    handleAnswerMessage(message) {
      console.log("The peer has accepted the request");
      this.myPeerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp)).catch(this.handleErrorMessage);
    },
    handleNewICECandidateMessage(message) {
      let candidate = new RTCIceCandidate(message.candidate);
      console.log(`Adding received ICE candidate: ${JSON.stringify(candidate)}`);
      this.myPeerConnection.addIceCandidate(candidate).catch(this.handleErrorMessage);
    },

    sendToServer(msg) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(msg));
      } else {
        console.warn('WebSocket is not open. Current state:', this.socket.readyState);
      }
    },

    exitRoom() {
      // WebRTC 연결 종료 및 방 나가기 로직 추가
      console.log("Exiting the room...");

      // 서버에 'leave' 메시지 보내기
      this.sendToServer({
        from: this.localUserName,
        type: 'leave',
        data: this.localRoom
      });

      // WebRTC 연결 종료
      if (this.myPeerConnection) {
        console.log('Closing RTCPeerConnection');

        // 모든 이벤트 리스너 제거
        this.myPeerConnection.onicecandidate = null;
        this.myPeerConnection.ontrack = null;
        this.myPeerConnection.onnegotiationneeded = null;
        this.myPeerConnection.oniceconnectionstatechange = null;
        this.myPeerConnection.onsignalingstatechange = null;
        this.myPeerConnection.onicegatheringstatechange = null;
        this.myPeerConnection.onnotificationneeded = null;
        this.myPeerConnection.onremovetrack = null;

        // 비디오 스트림 중지
        if (this.$refs.remoteVideo.srcObject) {
          this.$refs.remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        }
        if (this.$refs.localVideo.srcObject) {
          this.$refs.localVideo.srcObject.getTracks().forEach(track => track.stop());
        }

        // 비디오 요소 초기화
        this.$refs.remoteVideo.srcObject = null;
        this.$refs.localVideo.srcObject = null;

        // RTCPeerConnection 닫기
        this.myPeerConnection.close();
        this.myPeerConnection = null;
      }

      // WebSocket 연결 종료
      if (this.socket) {
        console.log('Closing the WebSocket connection');
        this.socket.close();
      }

      this.updateStatus('Completed');

      console.log("Room exited successfully");
      // Role이 Member인 경우에만 alert 메시지 띄우기 & 리뷰 & 결제
      if (localStorage.getItem('role') === 'Member') {
        alert("진료가 종료되었습니다.");
        this.reviewModal = true;
      } else if (localStorage.getItem('role') === 'Doctor') {
        window.location.href = '/doctor/untact/reservation';
      }
    },
    handlePeerLeave(message) {
      console.log(`${message.from} has left the room`);

      // 상대방 비디오 스트림을 종료하고 화면에서 제거
      if (this.$refs.remoteVideo.srcObject) {
        this.$refs.remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        this.$refs.remoteVideo.srcObject = null;
        // 상대방이 나가면 내 화면을 다시 크게 표시
        this.isRemoteVideoVisible = false;
      }

      // 연결 종료 처리 (필요 시)
      // if (this.myPeerConnection) {
      //   this.myPeerConnection.close();
      //   this.myPeerConnection = null;
      // }
      this.exitRoom();

      console.log('Peer connection closed for user:', message.from);


      // 진료 끝 api 보내야 함 !!!!!!! medical chart 상태 변경
      // 리뷰 모달 떠야함
      // 결제 모달 떠야함
    },
    handleErrorMessage(message) {
      console.error(message);
    },
    async createMedicalChart() {
      // 메디차트 생성
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/medical-chart/create`, { reservationId: this.sid })
        .then(response => {
          this.medicalChartId = response.data.result.id;
          console.log('Medical chart created successfully', response.data);
        })
        .catch(error => {
          console.error('Error creating medical chart:', error);
        });
    },
    // 진료 종료시 예약 상태 & 진료 내역 상태 진료완료로 업데이트
    async updateStatus(data) {
      console.log(" 진료 완료처리 하려는데 ...")
      try {
        const req = {
          id: this.sid,
          status: data
        }
        console.log(req);
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/untact/update`,
          req
        )
      } catch (e) {
        console.log(e)
      }
    },
    openPayModal() {
      console.log("이제 결제할게");
      this.payModal = true;
    }
  },
};
</script>

<style scoped>
.video {
  width: 1200px;
}

.video-container {
  margin: 0 auto;
  position: relative;
  /* 부모 컨테이너가 기준 */
  width: 80%;
  height: auto;
}

.local_video {
  width: 80%;
  height: auto;
}

.local_video.small {
  position: absolute;
  /* remote_video 위에 위치 */
  bottom: 20px;
  right: 12%;
  width: 160px;
  /* 크기 조정 */
  height: auto;
  border: 2px solid #ccc;
  border-radius: 5px;
  z-index: 10;
  /* z-index로 remote_video 위에 표시 */
}

.remote_video {
  width: 80%;
  height: auto;
}

.remote_video.tiny {
  width: 1px;
  height: 1px;
}

.dark-blue {
  color: #00499E;
}

.subtitle {
  font-size: 20px;
}

.round {
  background-color: #C2D7FF;
  border-radius: 40px;
  padding: 3px 15px;
  font-size: 14px;
  margin: 15px auto;
}

.big-font {
  font-size: 16px;
}

.small-font {
  font-size: 13px;
  color: #888888;
}

.small-font-black {
  font-size: 12px;
}

.child {
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 290px;
  padding: 15px 10px;
}

.button {
  background-color: #C2D7FF;
  border-radius: 10px;
  padding: 5px 15px;
  margin-right: 10px;
  font-size: 14px;
}

.star-icon {
  margin-top: 2px;
  font-size: 14px;
}
</style>