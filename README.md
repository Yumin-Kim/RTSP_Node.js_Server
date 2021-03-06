# 설계 및 구현[시도]

- **안드로이드 운영체제 환경에서 실시간으로 얼굴 인식및 판별 어플리케이션 개발**
- 진행 기간 : 2021.02.17 ~ 진행중

* **얼굴 인식 및 판별**

  - Python_Face_recogniton 소스를 활용하여 얼굴 인식및 판별까지 하는 라이브러리 활용

  * WebCam(python_opencv)을 활용하여 실시간으로 인식 및 판별 가능하나 노트북 성능이 좋지 않아 성능 최악
  * <a href="https://github.com/Yumin-Kim/Tutorial_MachineLearning/tree/master/FaceRecoginition">링크</a>를 참고하면 테스트를 해볼수 있다.

* 구현

1. 안드로이드 + OpenCV의 연동하여 openCV에 찍힌 영상(얼굴 인식)을 Frame단위로 buffer로 서버 전송 및 서버 얼굴 인식

   - OpenCV를 통한 CameraSurfaceView의 영상 데이터를 실시간으로 서버 전송

   * OpenCV의 내부에 구현되어 있는 얼굴 인식 로직을 활용하여 진행하였다
   * 서버 python- Flask
     - HTTP 프로토콜을 활용하여 진행
     * 인식 및 판별후 json데이터로 클라이언트로 전송

   - 문제점
     - 녹화한 영상을 실시간으로 전송하는 코드는 찾아볼수 있었으나 녹화가 아닌 영상은 실시간으로 서버로 전송하는 코드 찾지 못함
     - 다른 방법으로 캡쳐해서 이미지를 전송하였으나 서버에서 처리하는 속도가 느렸고 에러가 나는 확률이 높았다.

2. 안드로이드 <a href="https://github.com/pedroSG94/rtmp-rtsp-stream-client-java">RTSP 예제</a> 진행
   - 서버 Node.js(Typescript) - <a href="https://github.com/Yumin-Kim/RTSP_Node.js_Server">rtsp-stream-server라이브러리 수정후 사용</a>
     - RTSP 프로토콜 활용
   - 서버 go - <a href="https://github.com/aler9/rtsp-simple-server">sample server</a>
3. Google PlayStore의 RTSP Camera server 앱 과 VLC 미디어 플레이어 활용
   - RTSP Camera server앱에서 RTSP 및 HTTP 서버가 동작하게되고 VLC 미디어 플레이어에서 RTSP주소를 연결해주면 VLC 미디어 플레이어에서 실시간으로 영상을 확인할 수 있는 구조
   - CCTV와 같이 휴대폰에 찍히는 영상을 실시간으로 모니터링 가능
   - 문제점
     - 부가적인 수정할 수 없음

---

# TODO List

- **2021 03 04**

* Connection후 전달되는 데이터확인
* WebSocket을 사용할 수 있게끔 구현
* 웹페이지에 실시간 정보 제공
* 여러대 통신을 이룰수 있는지 확인

- **2021 03 06**

* 재설계를 해야할것 같음 , 잘못된 방식으로 구현됨

---

# Challenges in implementation

- **2021 03 04**

* 통신을 통해서 연결까지는 성공하였지만 송신되는 데이터 확인이 불가능 - 수정 요함
* WebSocket을 따로 구현되지 않아 웹으로 전달이 불가능하다.
* 기존의 모듈을 수정하여서 구현되었기 때문에 다시 한번 더 확인후 구현

- **2021 03 06**

* GooglePlayStore의 RTSP Camera Server 와 VLC 연동을 통해 잘못되 설계를 했다는 것을 알게 되었다. EX) CCTV를 연상하게 한다.
* 총 3번의 설계를 했지만 다 실패 및 구현을 어떻게 해야할지 방도 못찾음 , 유사 앱을 찾을려고 했지만

---

# 수정 사항

- node_moudles/rtsp-stream/incoming-message.js 모듈 수정
- rtsp-stream-server/PublishSever.ts 수정 tcp관련 코드 주석
- rtsp-stream-server/Mounts.ts getMount수정 정규표현식을 통해서 문자열 거름

---

# 필요한 상식

- 소켓 사용방법
- RTSP 프로토콜
