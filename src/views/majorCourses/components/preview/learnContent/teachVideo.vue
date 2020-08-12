<template>
  <div class="content">
    <div v-show="cont.fileId">
      <video  id="player-container-id" preload="auto" width="640" height="360" playsinline webkit-playsinline />
    </div>
  </div>
</template>

<script>
  import { CHAPTER_CONT_TYPE } from './constant'
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
        return this.$_getValue(this.chapterCont, `${CHAPTER_CONT_TYPE.shipin}.content`, {})
      }
    },
    data() {
      return {
        player: null,
        appID: ''
      }
    },
    watch: {
      'cont.fileId': {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.play(val)
            })
          } else {
            this.player && this.player.pause()
          }
        },
        immediate: true
      }
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
