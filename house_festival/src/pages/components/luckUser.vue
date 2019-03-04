<template>
  <div class="luckDraw">
    <div class="luckPerson">
      <ul id="con1" ref="con1">
        <li v-for = "(item,index) in prizeReceives" :key="index">
            {{item.receive}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { activityList } from '@/api/activePage'
const activityCode = 'MJGY20181225' //  活动code
export default {
  name: 'luckuser',
  components: {},
  data () {
    return {
      newsAnimate: true,
      prizeReceives: []
    }
  },
  created () {
    this.prizeReceivesApi()
  },
  methods: {
    prizeReceivesApi () {
      let params = {
        activityCode: activityCode
      }
      activityList.prizeReceivesApi(params).then((res) => {
        this.prizeReceives = res.data.prizeReceives
        this.prizeReceives = this.prizeReceives.concat(this.prizeReceives)
        if (this.prizeReceives && this.prizeReceives.length > 1) {
          this.newsScroll()
        }
      })
    },
    // 新闻滚动
    newsScroll () {
      this.$nextTick(() => {
        let con1 = this.$refs.con1
        this.prizeReceives = this.prizeReceives.concat(this.prizeReceives)
        let moveLeft = 0
        if (con1) {
          let scrollWidth = con1.scrollWidth
          setInterval(() => {
            moveLeft++
            if (moveLeft > scrollWidth) {
              console.log(moveLeft)
              con1.style.transform = 'translateX(' + 0 + 'px)'
              moveLeft = 1
            } else {
              con1.style.transform = 'translateX(' + '-' + moveLeft + 'px)'
              // con1.style.marginLeft = '-' + moveLeft + 'px'
            }
          }, 40)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @mixin bgimgFix ($url) {
    background-image: url($url);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  $mlMainColor: #DC000D;
  .pageContains{
      @include bgimgFix ('../../assets/image/ml_bg@2x.png');
      background-position:top;
  }
  .luckDraw{
    position: relative;
    width:684px;
    height:138px;
    margin: 0 auto;
    padding-top:40px;
      @include bgimgFix('../../assets/image/ml_laohuji_top@2x.png');
      z-index:3;
    .luckPerson{
      position: relative;
      width:75%;
      // background:black;
      height:56px;
      font-size:22px;
      margin:0 auto;
      height:32px;
      overflow: hidden;
      ul{
        margin-top:0;
        margin:0 auto;
        display: flex;
        width:auto;
        white-space:nowrap;
        // transition: all 0.1s;
      }
      // .anim{
      //     transition: all 0.5s;
      // }
      li{
        flex:1;
        height:32px;
        line-height: 32px;
        color:#fff;
        white-space:nowrap;
        padding-right:20px;
      }
    }
  }
</style>
