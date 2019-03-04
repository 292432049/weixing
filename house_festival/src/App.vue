<template>
  <div id="app-box">
    <div class="ml-main">
      <router-view/>
    </div>
  </div>
</template>

<script>
// import { removeUserData } from '@/utils/auth'
import { Button } from 'vant'
export default {
  name: 'App',
  components: {
    [Button.name]: Button
  },
  data () {
    return {
    }
  },
  methods: {

  },
  mounted () {

  },
  created () {
  }
}
</script>

<style lang="scss">
.ceshi-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
}
body {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  max-width: 750px;
  // background-color: #FFAB2C;
}

html {
  box-sizing: border-box;
  // touch-action: none;  //  组织preventDefault()报错
}

html,
body,
#app {
  width: 100%;
  // height: 100%;
  // overflow-x: hidden;
  // overflow-y: auto;
  // -webkit-overflow-scrolling: touch;
  background-color: #DC000D;
  margin: 0 auto;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

ul,li{
  list-style: none;
  padding: 0px;
  margin: 0px;
}

:focus,
:active {
  outline: none;
}

a,
a:focus,
a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
}

// 修改vant css
.van-toast--default {
  min-width: 120px;
  width: auto;
  .van-toast__text {
    font-size: 30px;
  }
}

.ml-model-close {
  position: absolute;
  bottom: -108px;
  left: 50%;
  margin-left: -44px;
  padding: 20px;
  img {
    width: 48px;
    height: 48px;
  }
}
// 两个页面公共样式
$mlMainColor: #DC000D;
@mixin bgimgFix ($url) {
  background-image: url($url);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
}

.page_container {
  min-height: 100vh;
  padding-top: 418px;
  overflow: hidden;
  @include bgimgFix('./assets/images/ml_bg_big@2x.png');
  background-position: center top;
}

@keyframes prizeAnim {
  0%  {top:0px;}
  100% {top:12px;}
}

// 抽奖模块
 .luckOpportArea{
      .luckOpport{
        width:708px;
        height:254px;
        @include bgimgFix('./assets/image/ml_laohuji_middle@2x.png');
        margin-left:43px;
        margin-top:-5px;
        position: relative;
        z-index:1;
      }
      .luckBtn{
        position: relative;
        width:718px;
        height:164px;
        z-index: 2;
        margin:0 auto;
        margin-top:-20px;
        @include bgimgFix('./assets/image/ml_laohuji_middle1@2x.png');

        .startLuck {
          width: 314px;
          position: relative;
          margin: auto;

          img {
            width: 314px;
            height: 98px;
            display: block;
            position: absolute;
            top: 0;
          }

          .top {
            animation: prizeAnim 0.6s infinite;
            -webkit-animation:prizeAnim 0.6s infinite;
            animation-direction: alternate;
            -webkit-animation-direction: alternate;

            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
          }
        }

        .giftBtn {
          position: absolute;
          right: 88px;

          img{
            width:108px;
            height:102px;
            display: block;
            margin-left:20px;
          }
        }
      }
    }
    // 活动规则
    .topImg{
      height:421px;
      position: relative;
      .actRule{
        position:absolute;
        top:30px;
        right:0;
        display: block;
        height:114px;
        width:42px;
        text-indent: -9999px;
        @include bgimgFix('./assets/image/ml_bt_ruler@2x.png');
      }
      .city{
        position:absolute;
        top:22px;
        left:20px;
        display: block;
        padding:0 20px;
        height:48px;
        line-height:48px;
        color:#fff;
        font-weight: bold;
        background:rgba(0,0,0,0.2);
        text-align:center;
        border-radius: 20px;
        // @include bgimgFix('./assets/image/ml_bt_city@2x.png');
      }
    }
.ml-login-model {
  border-radius: 0.1333rem;
  overflow: visible;
}
  .luckFooter{
    margin:50px 0;
      img{
       display: block;
       width:560px;
       height:24px;
       margin:0 auto;
       margin-top:50px
     }
     .more{
       width:390px;
       height:70px;
       display: block;
       margin:0 auto;

       img{
          width:100%;
          height:100%;
       }
     }
  }
  .asistance-wrapper {
    padding-top: 100px;
    background-color: #FFAB2C;
    .open-app {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100px;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, .5);
      z-index: 1000;
      .ml-logo {
        width: 60px;
        height: 60px;
      }
      .ml-slogan {
        flex: 1;
        font-size: 30px;
        color: #fff;
        padding-left: 20px;
      }
      .open-app-btn {
        img {
          width: 146px;
          height: 50px;
        }
      }
    }
    .main-wrapper {
      height: 570px;
      background-image: url(./assets/images/ml_bg_small2@2x.png);
      .main-button {
        margin-bottom: 36px;
      }
    }
    .main-asistance-from {
      margin-top: 36px;
      margin-bottom: 40px;
      font-size: 28px;
      height: 40px;
    }
  }
  .luckOpportArea{
    .luckBtn{
        width:720px;
        height:138px;
        @include bgimgFix ('./assets/image/GroupCopy2@2x.png');
    }
  }
  .userDetail{
    position: absolute;
    color:#EC424F;
    font-Size:24px;
    text-align: center;
    margin:307px auto 0;
    width: 100%;
    text-align:center;
  }
  .startLuck{
    margin:10px auto 0 auto;
  }
  .luckOpportArea .luckBtn{
      display: block;
      margin:0 auto;
      margin-top:-10px;
  }
  .residualTimes{
      position: absolute;
      bottom: 10px;
      display: block;
      width:100%;
      color:#fff;
      text-align: center;
      margin-top:20px;
  }
  .luckOpportArea .luckBtn .startLuck img{
    margin-top:-18px;
  }
</style>
