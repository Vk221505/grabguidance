import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import * as AgoraRTC from 'agora-rtc-sdk';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { ApiService } from 'src/services/api.service';
import {isPlatformBrowser} from "@angular/common";

@Component({
	selector: 'app-agora-test',
	templateUrl: './agora-test.component.html',
	styleUrls: [ './agora-test.component.css' ]
})
export class AgoraTestComponent implements OnInit, OnDestroy {
	localStream: Stream;
	remoteCalls: any = [];
	shareCalls: any = [];
	uid: any;
	shareStream: AgoraRTC.Stream;
	userType: String;
	userId: number;
	shareLog: any;
	shareStart: any;
	newChannelId: any;
	sessionId: any;
	muli: any;
	isVideoOn: boolean = true;
	isAudioOn: boolean = true;
	agoraObj: any;
	sharing: boolean = false;
	uidSharing: any;
	showSharingWindow: boolean = false;
	sharingCalls: any = [];
	joiningList: { name: string; profession: string; pic: any }[] = [];
	localUserName: string;
	localUserType: string;
	userName: string;
	expertName: string;
	adminName: string;
	localVideo: boolean = false;
	videooff: boolean = false;
	videoOffUser: string = null;
	offVideosStreamIds: any[] = [];
	isBrowser: any;

	constructor(
		private agoraService: AngularAgoraRtcService,
		private apiService: ApiService,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.isBrowser = isPlatformBrowser(platformId);
		if(isPlatformBrowser(this.platformId)){
			this.agoraService.createClient();
		}
	}
	ngOnInit() {
		if(isPlatformBrowser(this.platformId)){
			this.offVideosStreamIds = JSON.parse(localStorage.getItem('offVideosIds'));
			if (!this.offVideosStreamIds) {
				this.offVideosStreamIds = [];
			}
			this.agoraObj = JSON.parse(sessionStorage.getItem('agoraObj'));
		    this.getChannelID(this.agoraObj.sessionId, this.agoraObj.multi);
		}
		

		this.joiningList[0] = {
			name: this.agoraObj.userName,
			profession: 'User',
			pic: this.agoraObj.user_pic
		}; 
		this.joiningList[1] = {
			name: this.agoraObj.expertName,
			profession: 'Expert',
			pic: this.agoraObj.expert_pic
		};
		this.joiningList[2] = {
			name: this.agoraObj.supervisor,
			profession: 'A supervisor from the company may join the room for quality & traning purposes',
			pic: '../../assets/images/Asset_5.png'
		};

		this.userName = this.agoraObj.userName;
		this.expertName = this.agoraObj.expertName;
		this.adminName = this.agoraObj.supervisor;

		this.userType = localStorage.getItem('user_role');
		if (this.userType == 'user') {
			let user = '1' + localStorage.getItem('id_user');
			this.userId = parseInt(user);
			this.localUserName = this.agoraObj.userName;
			this.localUserType = 'User';
		}

		if (this.userType == 'expert') {
			let user = '2' + localStorage.getItem('id_expert');
			this.userId = parseInt(user);
			this.localUserName = this.agoraObj.expertName;
			this.localUserType = 'Expert';
	
		}

		if (this.userType == 'admin') {
			let user = '3' + localStorage.getItem('id_admin');
			this.userId = parseInt(user);
			this.localUserName = 'Grab Guidance';
			this.localUserType = 'Supervisor';
		}
	}

	getChannelID(sessionId: any, multi: any) {
		this.apiService.getChannelId(sessionId, multi).subscribe((data) => {
			if (!data.info.id_channel) {
				this.newChannelId = Math.floor(100000 + Math.random() * 90000);
				this.saveNewChannelId(sessionId, multi);
			} else {
				this.newChannelId = data.info.id_channel;
				this.start(data.info.id_channel);
			}
		});
	}

	saveNewChannelId(sessionId: any, multi: any) {
		this.apiService.saveChannelId(this.newChannelId, sessionId, multi).subscribe((data) => {
			this.start(this.newChannelId);
		});
	}

	private start(channelId: any) {
		this.agoraService.client.join(null, channelId, this.userId, (uid) => {
			this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
			this.localStream.setVideoProfile('720p_1');
			this.subscribeToStreams();
		});
	}

	private subscribeToStreams() {
		this.localStream.init(
			() => {
				console.log('getUserMedia successfully');
				this.localStream.play('agora_local');
				this.agoraService.client.publish(this.localStream, function(err) {
					console.log('Publish local stream error: ' + err);
				});
				this.agoraService.client.on('stream-published', function(evt) {
					console.log('Publish local stream successfully');
				});
			},
			function(err) {
				console.log('getUserMedia failed', err);
			}
		);

		this.localStream.on('accessAllowed', () => {
			// console.log("accessAllowed");
		});
		// The user has denied access to the camera and mic.
		this.localStream.on('accessDenied', () => {
			// console.log("accessDenied");
		});

		this.agoraService.client.on('error', (err) => {
			console.log('Got error msg:', err.reason);
			if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
				this.agoraService.client.renewChannelKey(
					'',
					() => {
						console.log('Renew channel key successfully');
					},
					(err) => {
						console.log('Renew channel key failed: ', err);
					}
				);
			}
		});

		this.agoraService.client.on('stream-added', (evt) => {
			const stream = evt.stream;
			this.agoraService.client.subscribe(stream, (err) => {
				console.log('Subscribe stream failed', err);
			});
		});

		this.agoraService.client.on('stream-subscribed', (evt) => {
			const stream = evt.stream;
			if (stream.getId().toString().length === 9) {
				this.sharing = true;
				if (this.uidSharing == stream.getId()) {
					this.showSharingWindow = true;
				} else {
					this.showSharingWindow = false;
					if (this.checkForExistingRemoteStream(`agora_remote${stream.getId()}`, 'sharing') == -1)
						this.shareCalls.push(`agora_remote${stream.getId()}`);
					setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
				}
			} else {
				let remoteObj = {
					streamId: `agora_remote${stream.getId()}`,
					user: this.findRemoteUserName(stream.getId())
				};
				if (this.checkForExistingRemoteStream(`agora_remote${stream.getId()}`, 'remote') == -1)
					this.remoteCalls.push(remoteObj);
				setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
			}

			if (this.offVideosStreamIds.includes(`agora_remote${stream.getId()}`)) {
				this.onMuteVideo(stream.getId());
			}
		});

		this.agoraService.client.on('mute-video', (evt) => {
			this.onMuteVideo(evt.uid);
		});

		this.agoraService.client.on('unmute-video', (evt) => {
			this.onUnMuteVideo(evt.uid);
		});

		this.agoraService.client.on('mute-audio', (evt) => {
			var uid = evt.uid;
		});

		this.agoraService.client.on('stream-removed', (evt) => {
			const stream = evt.stream;
			if (stream) {
				if (stream.getId().toString().length === 9) {
					this.sharing = false;
					stream.stop();
					this.shareCalls = this.shareCalls.filter((call) => call != `agora_remote${stream.getId()}`);
					console.log(`${evt.uid} left from this channel`);
					this.offVideoForSharing();
				} else {
					stream.stop();
					this.remoteCalls = this.remoteCalls.filter(
						(call) => call.streamId != `agora_remote${stream.getId()}`
					);
					console.log(`${evt.uid} left from this channel`);
				}
			}
		});

		this.agoraService.client.on('peer-leave', (evt) => {
			const stream = evt.stream;
			if (stream) {
				if (stream.getId().toString().length === 9) {
					this.sharing = false;
					stream.stop();
					this.shareCalls = this.shareCalls.filter((call) => call != `agora_remote${stream.getId()}`);
					console.log(`${evt.uid} left from this channel`);
					this.offVideoForSharing();
				} else {
					stream.stop();
					this.remoteCalls = this.remoteCalls.filter(
						(call) => call.streamId != `agora_remote${stream.getId()}`
					);
					console.log(`${evt.uid} left from this channel`);
				}
			}
		});
	}

	private onMuteVideo(uid: any, sharing?: any) {
		let element = document.getElementsByClassName(`agora_remote${uid}`)[0];
		if (element) {
			element.removeAttribute('style');
		}

		console.log('element', element);

		if (!sharing) {
			let index = this.checkForExistingRemoteStream(`agora_remote${uid}`, 'remote');
			let elementTagName = document.getElementById(index);
			if (elementTagName) {
				elementTagName.setAttribute('style', 'display: none;');
			}

			let element = document.getElementsByClassName(`agora_remote${uid}`)[0];
			if (element) {
				element.removeAttribute('style');
			}
		} else {
			let index = this.checkForExistingRemoteStream(`agora_remote${uid}`, 'remote');
			let elementTagName = document.getElementById(index);
			if (elementTagName) {
				elementTagName.removeAttribute('style');
			}

			let element = document.getElementsByClassName(`agora_remote${uid}`)[0];
			if (element) {
				element.removeAttribute('style');
			}
		}

		this.offVideosStreamIds = JSON.parse(localStorage.getItem('offVideosIds'));
		if (!this.offVideosStreamIds) {
			this.offVideosStreamIds = [];
		}
		if (!this.offVideosStreamIds.includes(`agora_remote${uid}`)) {
			this.offVideosStreamIds.push(`agora_remote${uid}`);
		}

		localStorage.setItem('offVideosIds', JSON.stringify(this.offVideosStreamIds));
	}

	private onUnMuteVideo(uid: any) {
		let element = document.getElementsByClassName(`agora_remote${uid}`)[0];
		if (element) {
			element.setAttribute('style', 'display: none;');
		}
		let index = this.checkForExistingRemoteStream(`agora_remote${uid}`, 'remote');
		let elementTagName = document.getElementById(index);
		if (elementTagName) {
			elementTagName.removeAttribute('style');
		}
		this.offVideosStreamIds = JSON.parse(localStorage.getItem('offVideosIds'));
		if (!this.offVideosStreamIds) {
			this.offVideosStreamIds = [];
		}
		this.offVideosStreamIds = this.offVideosStreamIds.filter((id) => {
			return id != `agora_remote${uid}`;
		});

		localStorage.setItem('offVideosIds', JSON.stringify(this.offVideosStreamIds));
	}

	private checkForExistingRemoteStream(value: any, type: string) {
		let result;
		if (type == 'sharing') {
			result = this.shareCalls.findIndex((call) => {
				return call == value;
			});
		} else {
			result = this.remoteCalls.findIndex((call) => {
				return call.streamId == value;
			});
		}
		return result;
	}

	private findRemoteUserName(streamId: string) {
		let id = '' + streamId;
		let userType = id.substr(0, 1);
		let userInfo;
		if (userType == '1') {
			userInfo = this.joiningList[0];
			userInfo.profession = 'User';
		} else if (userType == '2') {
			userInfo = this.joiningList[1];
			userInfo.profession = 'Expert';
		} else {
			userInfo = this.joiningList[2];
			userInfo.profession = 'Supervisor';
			userInfo.name = 'Grab Guidance';
		}
		return userInfo;
	}

	leave() {
		this.agoraService.client.unpublish(this.localStream);
		this.localStream.close();
		this.agoraService.client.leave(
			() => {
				console.log('Leavel channel successfully');
				this.router.navigate([ '/review-rating' ]);
			},
			(err: any) => {
				console.log('Leave channel failed', err);
			}
		);
	}

	onOff() {
		if (this.localStream.isVideoOn()) {
			this.localStream.disableVideo();
			this.localVideo = true;
			this.isVideoOn = false;
			this.onMuteVideo(this.userId);
		} else {
			this.localStream.enableVideo();
			this.isVideoOn = true;
			this.localVideo = false;
			this.onUnMuteVideo(this.userId);
		}
	}
	audioOff() {
		if (this.localStream.isAudioOn()) {
			this.localStream.muteAudio();
			this, (this.isAudioOn = false);
		} else {
			this.localStream.unmuteAudio();
			this.isAudioOn = true;
		}
	}

	createImageUrl(data: any) {
		if (data) {
			return data;
		}
		return '../../assets/images/image.png';
	}

	screenShare = (channelId: string, userId: any) => {
		this.sharing = true;
		var screenClient = AgoraRTC.createClient({
			mode: 'rtc',
			codec: 'vp8'
		});
		this.uidSharing = Math.floor(100000000 + Math.random() * 900000000);
		screenClient.init('b414beee0d714fd0bbd968c9e12da559', () => {
			screenClient.join(
				null,
				channelId,
				this.uidSharing,
				(uid) => {
					const streamSpec = {
						streamID: uid,
						audio: false,
						video: false,
						screen: true
					};
					this.shareStream = null;
					let screenStream = AgoraRTC.createStream(streamSpec);
					this.shareStream = screenStream;
					// Initialize the stream.
					screenStream.init(
						() => {
							screenClient.publish(screenStream);
							this.offVideoForSharing('sharing');
						},
						(err) => {
							console.log(err);
						}
					);
				},
				(err) => {
					console.log(err);
				}
			);
		});
	};

	shareEnd() {
		this.agoraService.client.unpublish(this.shareStream);
		this.sharing = false;
		this.shareStream.close();
		this.agoraService.client.leave(
			() => {
				console.log('Leavel channel successfully');
			},
			(err: any) => {
				console.log('Leave channel failed', err);
			}
		);
	}

	offVideoForSharing(sharing?: any) {
		this.offVideosStreamIds = JSON.parse(localStorage.getItem('offVideosIds'));
		if (!this.offVideosStreamIds) {
			this.offVideosStreamIds = [];
		}
		this.offVideosStreamIds.forEach((id) => {
			if (id.includes('agora_remote')) {
				id = id.split('agora_remote')[1];
			}
			if (sharing) {
				this.onMuteVideo(id, sharing);
			} else {
				setTimeout(() => {
					this.onMuteVideo(id);
				});
			}
		});
	}

	checkForVideoOff(index: any) {
		if (this.videoOffUser) {
			let result = this.videoOffUser === index;
			return result;
		}
	}

	ngOnDestroy() {
		localStorage.removeItem('offVideosIds');
	}
}
