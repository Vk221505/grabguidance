import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as AgoraRTC from 'agora-rtc-sdk';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-screen-share',
  templateUrl: './screen-share.component.html',
  styleUrls: ['./screen-share.component.css']
})



export class ScreenShareComponent implements OnInit {
  localStream: Stream
  remoteCalls: any = [];
  uid: any;
  shareStream: Stream
  shareLog: any
  shareStart: any;
  newChannelId: any;
  sessionId: any;
  muli: any;
  isVideoOn: boolean = true;
  isAudioOn: boolean = true;
  agoraObj: any;
  joiningList: { name: string; profession: string; pic: any }[] = [];


  constructor(
    private agoraService: AngularAgoraRtcService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.agoraService.createClient();

  }
  ngOnInit() {
    this.screenShare()
    //  this.activatedRoute.queryParams.subscribe( data => {
    //     this.getChannelID(data.sessionId, data.multi);
    //  })
    //  this.agoraObj = JSON.parse(sessionStorage.getItem('agoraObj'));
    //  this.joiningList[0] = { name: this.agoraObj.userName, profession: "You", pic: this.agoraObj.user_pic }
    //  this.joiningList[1] = { name: this.agoraObj.expertName, profession: 'expert', pic: this.agoraObj.expert_pic }
    //  this.joiningList[2] = { name: this.agoraObj.supervisor, profession: 'A supervisor from the company may join the room for quality & traning purposes', pic: null }
  }

  // getChannelID(sessionId: any, multi: any) {
  //   this.apiService.getChannelId(sessionId, multi)
  //   .subscribe( data => {
  //     if(!data.id_channel) {
  //       this.newChannelId = Math.floor(100000 + Math.random() * 900000);
  //       this.saveNewChannelId(sessionId, multi);
  //     } else {
  //       this.newChannelId = data.id_channel;
  //       this.start(data.id_channel);
  //     }
  //   })
  // }

  // saveNewChannelId(sessionId: any, multi: any) {
  //    this.apiService.saveChannelId(this.newChannelId, sessionId, multi)
  //       .subscribe( data => {
  //          console.log(data);
  //          this.start(this.newChannelId);
  //       })
  // }


  // private start(channelId: any) {
  //   this.agoraService.client.join(null, '1000', null, (uid) => {
  //     this.uid = channelId;
  //     this.localStream = this.agoraService.createStream(123456, true, null, null, true, false);
  //     this.localStream.setVideoProfile('720p_3');
  //     this.subscribeToStreams();
  //   });
  // }

  // private subscribeToStreams() {
  //   this.localStream.on("accessAllowed", () => {
  //     // console.log("accessAllowed");
  //   });
  //   // The user has denied access to the camera and mic.
  //   this.localStream.on("accessDenied", () => {
  //     // console.log("accessDenied");
  //   });

  //   this.localStream.init(() => {
  //     // console.log("getUserMedia successfully");
  //     this.localStream.play('agora_local');
  //     this.agoraService.client.publish(this.localStream, function (err) {
  //       // console.log("Publish local stream error: " + err);
  //     });
  //     this.agoraService.client.on('stream-published', function (evt) {
  //       // console.log("Publish local stream successfully");
  //     });
  //   }, function (err) {
  //     // console.log("getUserMedia failed", err);
  //   });

  //   this.agoraService.client.on('error', (err) => {
  //     console.log("Got error msg:", err.reason);
  //     if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
  //       this.agoraService.client.renewChannelKey("", () => {
  //         // console.log("Renew channel key successfully");
  //       }, (err) => {
  //         // console.log("Renew channel key failed: ", err);
  //       });
  //     }
  //   });

  //   this.agoraService.client.on('stream-added', (evt) => {
  //     const stream = evt.stream;
  //     this.agoraService.client.subscribe(stream, (err) => {
  //       // console.log("Subscribe stream failed", err);
  //     });
  //   });

  //   this.agoraService.client.on('stream-subscribed', (evt) => {
  //     const stream = evt.stream;
  //     console.log('sream' ,stream)
  //     console.log('isVideoOn', stream.isVideoOn())
  //     console.log(evt);
  //     if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
  //     setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
  //   });

  //   this.agoraService.client.on('stream-removed', (evt) => {
  //     const stream = evt.stream;
  //     stream.stop();
  //     this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
  //   });

  //   this.agoraService.client.on('mute-video', (evt) => {

  //     // const stream = evt.stream;
  //     // console.log("isVideoOn",stream.isVideoOn);
  //     // stream.stop();
  //     // this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
  //     // console.log(`Remote stream is removed ${stream.getId()}`);
  //   });

  //   this.agoraService.client.on('peer-leave', (evt) => {
  //     const stream = evt.stream;
  //     if (stream) {
  //       stream.stop();
  //       this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
  //       // console.log(`${evt.uid} left from this channel`);
  //     }
  //   });
  // }



  // onOff() {
  //   if (this.localStream.isVideoOn()) {
  //     this.localStream.disableVideo()
  //     this.isVideoOn = false;
  //   } else {
  //     this.localStream.enableVideo();
  //     this.isVideoOn = true;
  //   }
  // }
  // audioOff() {
  //   if(this.localStream.isAudioOn()) {
  //     this.localStream.muteAudio()
  //     this,this.isAudioOn = false;
  //   } else {
  //     this.localStream.unmuteAudio();
  //     this.isAudioOn = true;
  //   }
  // }

  // createImageUrl(data: any) {
  //   if (data) {
  //     return data;
  //   }
  //   return "../../assets/images/image.png";
  // }


  // shareScreen() {
  //   var id=this.newChannelId

  //   var screenClient = AgoraRTC.createClient({
  //     mode: 'rtc',
  //     codec: 'vp8'
  //   });
  //   screenClient.init('b6ea4d853ef74df2aa1a5b6757fc82d6', function () {
  //     screenClient.join(null, '1000', null, function () {
  //       // Create the stream for screen sharing.
  //       const streamSpec = {
  //         streamID: id,
  //         audio: false,
  //         video: false,
  //         screen: true,
  //       }
  //       let screenStream = AgoraRTC.createStream(streamSpec);
  //       // Initialize the stream.
  //       screenStream.init(function () {
  //         // Play the stream.
  //         screenStream.play('video_local');
  //         // Publish the stream.
  //         screenClient.publish(screenStream);
  //       }, function (err) {
  //         console.log(err);
  //       });
  //     }, function (err) {
  //       console.log(err);
  //     })
  //   });

  // }

  private screenShare() {
    var screenClient = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8'
    });
    screenClient.init('b6ea4d853ef74df2aa1a5b6757fc82d6', function () {
      screenClient.join(null, '1000', null, function (uid) {
        // Create the stream for screen sharing.
        const streamSpec = {
          streamID: uid,
          audio: false,
          video: false,
          screen: true,
        }

        // Set relevant
        // Note that you need to implement isFirefox and isCompatibleChrome.
        // streamSpec.extensionId = 'minllpmhdgpndnkomcoccfekfegnlikg';
        let screenStream = AgoraRTC.createStream(streamSpec);
        // Initialize the stream.
        screenStream.init(function () {
          // Play the stream.
          screenStream.play('share');
          // Publish the stream.
          screenClient.publish(screenStream);
        }, function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      })
    });
  }

  shareEnd() {
    this.agoraService.client.unpublish(this.shareStream);
    this.shareStream && this.shareStream.close();
    this.agoraService.client &&
      this.agoraService.client.leave(
        () => {
          this.shareLog("Share client succeed to leave.");
        },
        () => {
          this.shareLog("Share client failed to leave.");
        }
      );


  }


  // startShare() {
  //   var screenClient = AgoraRTC.createClient({
  //     mode: 'rtc',
  //     codec: 'vp8'
  //   });
  //   screenClient.init('b6ea4d853ef74df2aa1a5b6757fc82d6', function () {
  //     screenClient.join(null, '1000', null, function (uid) {
  //       // Create the stream for screen sharing.
  //       const streamSpec = {
  //         streamID: 123456,
  //         audio: false,
  //         video: true,
  //         screen: true,
  //         extensionId :'minllpmhdgpndnkomcoccfekfegnlikg'
  //       }

  //       // Set relevant
  //       // Note that you need to implement isFirefox and isCompatibleChrome.
  //       // streamSpec.extensionId = 'minllpmhdgpndnkomcoccfekfegnlikg';
  //       let screenStream = AgoraRTC.createStream(streamSpec);
  //       // Initialize the stream.
  //       screenStream.init(function () {
  //         // Play the stream.
  //         screenStream.play('video_local');
  //         // Publish the stream.
  //         screenClient.publish(screenStream);
  //       }, function (err) {
  //         console.log(err);
  //       });
  //     }, function (err) {
  //       console.log(err);
  //     })
  //   });


  // }

  leave() {
    this.agoraService.client.unpublish(this.localStream);
    this.localStream.close();
    this.agoraService.client.leave(() => {
    this.router.navigate(['/review-rating'])

    console.log("Leavel channel successfully");

    }, (err: any) => {
       console.log("Leave channel failed", err);
    })
  }

}
