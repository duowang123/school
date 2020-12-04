<template>
  <div class="content">
    <div v-show="cont.fileId">
      <video
          id="myVideo"
          class="video-js"
          controls
      >
        <source
            :src="this.cont.fileUrl"
            type="video/mp4"
        >
      </video>
    </div>
  </div>
</template>

<script>
  import { getAppIdForVideo } from '../api'

  export default {
    name: 'PreviewTeachVideo',
    props: {
      chapterCont: {
        type: Object
      }
    },
    computed: {
      cont() {
        return this.$_getValue(this.chapterCont, 'content', {})
      }
    },
    data() {
      return {
        player: null,
        appID: ''
      }
    },
    watch: {
      'cont.fileUrl': {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.initVideo()
            })
          } else {
            this.player && this.player.pause()
          }
        },
        immediate: true
      }
      // 'cont.fileId': {
      //   handler(val) {
      //     if (val) {
      //       this.$nextTick(() => {
      //         this.play(val)
      //       })
      //     } else {
      //       this.player && this.player.pause()
      //     }
      //   },
      //   immediate: true
      // }
    },
    mounted() {
      this.initVideo()
    },
    destroyed() {
      this.player && this.player.dispose()
      this.player = null
    },
    methods: {
      async play(fileID) {
        this.appID = this.appID || (await getAppIdForVideo()).data
        // fileID: 5285890802616171227
        if (this.player && this.player.loadVideoByID) {
          this.player.loadVideoByID({
            fileID: fileID, // 请传入需要播放的视频filID 必须
            appID: this.appID // 请传入点播账号的appID 必须
          })
        } else {
          this.player = TCPlayer('player-container-id', { // player-container-id 为播放器容器ID，必须与html中一致
            fileID: fileID, // 请传入需要播放的视频filID 必须
            appID: this.appID, // 请传入点播账号的appID 必须
            //其他参数请在开发文档中查看
            plugins: {
              ProgressMarker: true
            }
          })
        }
      },
      initVideo() {
        //初始化视频方法
        if (this.player) {
          this.player.src(this.cont.fileUrl)
          this.player.pause()
        } else {
          this.player = this.$video('myVideo', {
            sources: [
              {
                src: this.cont.fileUrl,
                type: "video/mp4"
              }
            ],
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            autoplay: false,
            controls: true,
            language: 'zh-CN',
            //自动播放属性,muted:静音播放
            // autoplay: "false",
            // autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            width: "800px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "400px"
          })
          // setLang(this.$video)
        }
      }
    }
  }
</script>

<style scoped lang="scss">

  .content {
    margin: 24px;
    width: 100%;
    min-height: 500px;
  }
  .tcplayer {
    margin: 0 auto;
  }
  @media screen and (max-width: 640px) {
    #player-container-id {
      width: 100%;
      height: 270px;
    }
  }
  /* 设置logo在高分屏的显示样式 */
  @media only screen and (min-device-pixel-ratio: 2), only screen and (-webkit-min-device-pixel-ratio: 2) {
    .tcp-logo-img {
      width: 50%;
    }
  }

</style>

<style scoped lang="scss">
</style>
