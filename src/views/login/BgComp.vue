<template>
    <div class="login-bg">
      <div class="left-bg">
        <img alt="" class="bg-img" src="./img-bg.png">
        <div class="white-triangle top"></div>
        <div class="white-triangle down"></div>
        <div class="copyright">Copyright◎2020湖南省社会科学院版权所有！</div>
      </div>
      <div class="right-bg">
        <div class="gird">
          <img alt="" src="./img-dd.png">
        </div>
        <div class="block block-1"></div>
        <div class="block block-2"></div>
        <div class="block block-3"></div>
        <div class="block block-4"></div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "BgComp"
    }
</script>

<style lang="scss" scoped>
  $bg: #f8f9fb;
  .login-bg {
    height: 100vh;
    width: 100vw;
    background-color: $bg;
    position: relative;
    display: flex;
    .left-bg {
      width: 66%;
      height: 100vh;
      background-image: linear-gradient(-55deg, #73C5EF 0%, #3F93DB 100%);
      border-radius: 0 4px 0 4px;
      position: relative;
      z-index: 1;
      .bg-img {
        position: absolute;
        top: 20vh;
        right: 580px;
        left: 10vw;
        height: 522px;
        z-index: 10;
      }
      .white-triangle {
        position: absolute;
        right: 0;
        &.top {
          top: 0;
          width: 0;
          height: 0;
          border-top: 30vw solid $bg;
          border-left: 50vh solid transparent;
        }
        &.down {
          top: 50vh;
          width: 0;
          height: 0;
          border-bottom: 50vw solid $bg;
          border-left: 50vh solid transparent;
        }
      }
      .copyright {
        position: absolute;
        bottom: 18px;
        left: 5vw;
        font-size: 12px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 18px;
      }
    }
    .right-bg {
      width: 33vw;
      height: 100vh;
      position: relative;
      .gird {
        position: absolute;
        top: 7vh;
        right: 3vw;
        img {
          width: 77px;
          height: 34px;
        }
      }
      .block {
        position: absolute;
        top: 0;
        right: 0;
        width: 32px;
        height: 32px;
        background-image: linear-gradient(-45deg, #73C5EF 0%, #3F93DB 100%);
        border-radius: 2px;
        z-index: 3;
        &.block-1 {
          top: 23vh;
          right: 11vw;
        }
        &.block-2 {
          top: 50vh;
          right: 30vw;
          width: 13px;
          height: 13px;
        }
        &.block-3 {
          top: 75vh;
          right: 18vw;
          width: 18px;
          height: 18px;
        }
        &.block-4 {
          top: 87vh;
          right: 40vw;
          width: 32px;
          height: 32px;
        }
      }
    }
  }
</style>
