# 설계 및 구현[시도]

- 제목 : **안드로이드 운영체제 환경에서 실시간으로 얼굴 인식및 판별 어플리케이션 개발**

- 개발 기간
  - 진행 기간 : 2021.02.17 ~ 진행중
  - 예상 마감 기간 : 2021.08.01(여름방학전)
  - 중간 정리 기간: 2021.03.06

## 구현

- **얼굴 인식 및 판별**
  - <a href="https://github.com/Yumin-Kim/Tutorial_MachineLearning/tree/master/FaceRecoginition">링크</a>를 참고하면 테스트를 해볼수 있다.
  - Python_Face_recogniton 소스를 활용하여 얼굴 인식및 판별까지 하는 라이브러리 활용
  - WebCam(python_opencv)을 활용하여 실시간으로 인식 및 판별 가능하나 노트북 성능이 좋지 않아 성능 최악
  - 이슈(face_recognition github사이트 참고하면 확인가능하며 수정 또한 가능)
    - 인식하기 위한 학습은 서양인으로 되어 있어서 동양인은 인식률(정확성)에서 문제가 있다고 함
    - 정확성을 높히기 위한 방법은 비교대상의 정보를 두개이상 할수 있도록 수정 , 매개변수를 model="CNN" , tolerance등 수정하면 정확성 높아지면 결과 산출하는 부분에 있어 많은 시간 소모

1.  안드로이드 + OpenCV의 연동하여 openCV에 찍힌 영상(얼굴 인식)을 Frame단위로 buffer로 서버 전송 및 서버 얼굴 인식

    - OpenCV를 통한 CameraSurfaceView의 영상 데이터를 실시간으로 서버 전송
    - 얼굴 인식은 OpenCV의 내부에 구현되어 있는 얼굴 인식 로직을 활용하여 진행하였다

    - 서버 python- Flask
      - HTTP 프로토콜을 활용하여 진행
      * 인식 및 판별후 json데이터로 클라이언트로 전송

    * 문제점
      - 녹화한 영상을 실시간으로 전송하는 코드는 찾아볼 수 있었으나 녹화가 아닌 영상은 실시간으로 서버로 전송하는 코드 찾지 못함(C++로 구현)
      * 다른 방법으로 캡쳐해서 이미지를 전송하였으나 서버에서 처리하는 속도가 느렸고 에러가 나는 확률이 높았다.

2.  안드로이드 <a href="https://github.com/pedroSG94/rtmp-rtsp-stream-client-java">RTSP 예제</a> 진행

    - RTSP프로토콜을 사용하는 안드로이드 예제를 활용하여 서버 또한 RTSP프로토콜을 사용하여 실시간으로 데이터를 전송하게끔 구현하려함

    * 서버 Node.js(TypeScript) - <a href="https://github.com/Yumin-Kim/RTSP_Node.js_Server">rtsp-stream-server라이브러리 수정후</a> 사용

      - RTSP 프로토콜 활용

      * 안드로이드와 서버간의 Connection은 이루어졌지만 안드로이드로부터 오는 영상 데이터(Buffer)를 확인할 수 없음

      ```
      //관련 로그
      1. OPTIONS 통신
      rtsp-streaming-server:PublishServer Options request from ::ffff:172.20.10.6 with headers { cseq: '1' } +16s
      2.  ANNOUNCE 통신
      rtsp-streaming-server:PublishServer ::ffff:172.20.10.6:55458 - Announce request with headers { cseq: '2', 'content-length': '438', 'content-type': 'application/sdp' } +41ms
      Mounts.addmount 호출
      Mount 생성자 함수 호출
      :ffff:172.20.10.6:55458 - Set session to 56b230a9-487c-437c-9aee-d6a5e402590c +12ms
      rtsp-streaming-server:Mounts Adding mount with path rtsp://192.168.219.179:5554/web/app and SDP 'v=0\r\n' +
        rtsp-streaming-server:Mounts   'o=- 0 0 IN IP4 127.0.0.1\r\n' +
        rtsp-streaming-server:Mounts   's=Unnamed\r\n' +
        rtsp-streaming-server:Mounts   'i=N/A\r\n' +
        rtsp-streaming-server:Mounts   'c=IN IP4 192.168.219.179\r\n' +
        rtsp-streaming-server:Mounts   't=0 0\r\n' +
        rtsp-streaming-server:Mounts   'a=recvonly\r\n' +
        rtsp-streaming-server:Mounts   'm=video 0 RTP/AVP 96\r\n' +
        rtsp-streaming-server:Mounts   'a=rtpmap:96 H264/90000\r\n' +
        rtsp-streaming-server:Mounts   'a=fmtp:96 packetization-mode=1; sprop-parameter-sets=Z0IAHtoHgUaAeLF1,aM4NiA==;\r\n' +
        rtsp-streaming-server:Mounts   'a=control:trackID=0\r\n' +
        rtsp-streaming-server:Mounts   'm=audio 0 RTP/AVP 97\r\n' +
        rtsp-streaming-server:Mounts   'a=rtpmap:97 MPEG4-GENERIC/32000/2\r\n' +
        rtsp-streaming-server:Mounts   'a=fmtp:97 streamtype=5; profile-level-id=15; mode=AAC-hbr; config=1290; SizeLength=13; IndexLength=3; IndexDeltaLength=3;\n' +
        rtsp-streaming-server:Mounts   'a=control:trackID=1\r\n' +0ms
        rtsp-streaming-server:Mount Set up mount at path /web/app +0ms
        rtsp-streaming-server:PublishServer ::ffff:192.168.219.165:55628 - Set session to d4626ba0-7a0b-45fe-9139-be4aa9179ba6 +9ms

      3. SETUP 통신 - 2번 실행
      rtsp-streaming-server:Mounts 4999 rtp ports remaining +84ms
        rtsp-streaming-server:Mount Setting up stream -1 on path /web/app/trackID=0 +81ms
      mounts: {
          '/web/app': Mount {
            id: 'd4626ba0-7a0b-45fe-9139-be4aa9179ba6',
            mounts: [Circular *1],
            path: '/web/app',
            streams: {},
            hooks: [Object],
            sdp: 'v=0\r\n' +
              'o=- 0 0 IN IP4 127.0.0.1\r\n' +
              's=Unnamed\r\n' +
              'i=N/A\r\n' +
              'c=IN IP4 192.168.219.179\r\n' +
              't=0 0\r\n' +
              'a=recvonly\r\n' +
              'm=video 0 RTP/AVP 96\r\n' +
              'a=rtpmap:96 H264/90000\r\n' +
              'a=fmtp:96 packetization-mode=1; sprop-parameter-sets=Z0IAHtoHgUaAeLF1,aM4NiA==;\r\n' +
              'a=control:trackID=0\r\n' +
              'm=audio 0 RTP/AVP 97\r\n' +
              'a=rtpmap:97 MPEG4-GENERIC/32000/2\r\n' +
              'a=fmtp:97 streamtype=5; profile-level-id=15; mode=AAC-hbr; config=1290; SizeLength=13; IndexLength=3; IndexDeltaLength=3;\n' +
              'a=control:trackID=1\r\n'
          }
        },
        rtpPorts: [
          10000, 10002, 10004, 10006, 10008, 10010, 10012, 10014,
          10016, 10018, 10020, 10022, 10024, 10026, 10028, 10030,
          10032, 10034, 10036, 10038, 10040, 10042, 10044, 10046,
          10048, 10050, 10052, 10054, 10056, 10058, 10060, 10062,
          10064, 10066, 10068, 10070, 10072, 10074, 10076, 10078,
          10080, 10082, 10084, 10086, 10088, 10090, 10092, 10094,
          10096, 10098, 10100, 10102, 10104, 10106, 10108, 10110,
          10112, 10114, 10116, 10118, 10120, 10122, 10124, 10126,
          10128, 10130, 10132, 10134, 10136, 10138, 10140, 10142,
          10144, 10146, 10148, 10150, 10152, 10154, 10156, 10158,
          10160, 10162, 10164, 10166, 10168, 10170, 10172, 10174,
          10176, 10178, 10180, 10182, 10184, 10186, 10188, 10190,
          10192, 10194, 10196, 10198,
          ... 4900 more items
        ]
      }

      4.RECORD
      rtsp-streaming-server:RtpUdp Opened RTP listener for stream -1 on path /web/app +0ms
      ```

    * 서버 Go - <a href="https://github.com/aler9/rtsp-simple-server">sample server</a>사용
      - RTSP 프로토콜 활용
      * sample server로 실행파일만 제공되며 Go언어로 개발되어서 언어 미숙으로 오랜 기간 소모
    * 서버 Python - Gstreamer

      - Ubuntu 환경에서 진행
      - 라즈베리파의 웹캡와 USB port에 연결된 영상 관리 모듈을 활용하여 진행하는 방식밖에 찾지못함

    * 문제점
      - RTSP 안드로이드 예제가 복잡하게 구현되어 있어서 영상 데이터를 전송하는지 확인이 불가능하며 안드로이드 에디터에서 전송관련 log밖에 확인만 가능(Go , Node.js연결 성공 / Python 연결 실패)
      * 여러 언어로 서버 개발을 해보았으나 클라이언트로 부터 받은 데이터를 확인가능도 불가능하고

3.  Google PlayStore의 RTSP Camera server 앱 과 VLC 미디어 플레이어 활용

    - RTSP Camera server앱에서 RTSP 및 HTTP 서버가 동작하게되고 VLC 미디어 플레이어에서 RTSP주소를 연결해주면 VLC 미디어 플레이어에서 실시간으로 영상을 확인할 수 있는 구조
    - CCTV와 같이 휴대폰에 찍히는 영상을 실시간으로 모니터링 가능
    - 안드로이드 앱 자체에서 소켓을 활용하여 서버 구동 >> VLC 미디어 플레이어 앱에서 주어지는 URL로 접속하면 모니터링이 가능하다

    * 서버 Python - VLC 라이브러리 활용 (구현중)
    * VLC 미디어 플레이어(실시간 스트리밍 툴)
      - 클라이언트역할 하는것 같음
        - 앱에서 제공하는 http://{ip}:8080/playlist/m3u 또는 rtsp://{ip}:5554 접속시 VLC에서 실시간 모니터링 가능

    - 문제점
      - 부가적인 수정할 수 없음(주요 로직 추가 불가능)
      * 구현되어 있는 소스 코드 오류 발생(버전 문제 발생 - 안드로이드 및 VLC라이브러리 추가된 서버? )

---

## 중간 결과

- 하나부터 열까지 개발은 불가능
- 네트워크 상식 부족(RTSP 프로토콜을 활용해야하는지 의문)
- 클라이언트로 받은 영상 데이터 서버내에서 처리 로직 구현 미숙
- 비슷한 예제로 줌이나 Webex 등 제공해주는 SDK 활용해야하는지 의문
- 3번 테스트한 결과 누가 서버역할을 하는지 이해 불가
- **안드로이드에서 Tensorflow Lite를 활용하여 얼굴인식 및 판별이 성능이나 개발 속도가 빠를것 같음**..
- **안드로이드내에서 AI 구현해보기 시작**
  - <a href = "https://github.com/estebanuri/face_recognition">참고 자료</a>

---

# TODO List

- **2021 03 04**

  - Connection후 전달되는 데이터확인
  - WebSocket을 사용할 수 있게끔 구현
  - 웹페이지에 실시간 정보 제공
  - 여러대 통신을 이룰수 있는지 확인

- **2021 03 06**

  - 재설계를 해야할것 같음 , 잘못된 방식으로 구현됨

---

# Challenges in implementation

- **2021 03 04**

  - 통신을 통해서 연결까지는 성공하였지만 송신되는 데이터 확인이 불가능 - 수정 요함
  - WebSocket을 따로 구현되지 않아 웹으로 전달이 불가능하다.
  - 기존의 모듈을 수정하여서 구현되었기 때문에 다시 한번 더 확인후 구현

- **2021 03 06**

  - GooglePlayStore의 RTSP Camera Server 와 VLC 연동을 통해 잘못되 설계를 했다는 것을 알게 되었다. EX) CCTV를 연상하게 한다.
  - 총 3번의 설계를 했지만 다 실패 및 구현을 어떻게 해야할지 방도 못찾음 , 유사 앱을 찾을려고 했지만

---

# 수정 사항

- **2021 03 04**
  - node_moudles/rtsp-stream/incoming-message.js 모듈 수정
  - rtsp-stream-server/PublishSever.ts 수정 tcp관련 코드 주석
  - rtsp-stream-server/Mounts.ts getMount수정 정규표현식을 통해서 문자열 거름

---

# 필요한 상식

- 소켓 사용방법
- RTSP 프로토콜
