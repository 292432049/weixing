<template>
  <div class="houseLuck">
    <div class="houseLuckTitle">
      <img :src="require('../../assets/image/ml_bt_title@2x.png')" alt="">
      <p> 首月租房9.9  全年租房8折起 </p>
    </div>
    <ul>
      <li v-for="(item,index) in houseList" :key="index" @click="houseLink(item.linkUrl)">
          <img :src="item.houseLogo" alt="">
          <div  class="zhe">
            <div v-for="(key,index) in item.labels" :key="index">
              <p  v-if="key.type ==='month'">首月<span> {{key.content}}</span></p>
              <p v-if="key.type ==='year'">全年<span> {{key.content}}</span></p>
            </div>
          </div>
          <div class="golook">去看看</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'houseList',
  components: {},
  props: {
    houseList: {
      type: Array
    }
  },
  data () {
    return {

    }
  },
  methods: {
    houseLink (link) {
      console.log('link', process.env.HOUSE_H5_URL + link)
      window.location.href = process.env.HOUSE_H5_URL + link
    }
  }
}
</script>
<style lang="scss">
//房源钜惠
.houseLuck{
    .houseLuckTitle{
      margin:40px 0;
      font-size:28px;
      color:#fff;
      text-align: center;
      img{
        width:308px;
        height:36px;
      }
      p{
        padding:0;
        margin:0;
      }
    }
    ul{
      width:692px;
      background:#F83972;
      border-radius:10px;
      position: relative;
      z-index: 3;
      margin:0 auto;
      padding:30px 20px 10px;
      li{
          display: flex;
          justify-content: space-between;
          width:632px;
          height:134px;
          background:#DC000D;
          box-shadow: 1px 2px 15px 0px #DC000D;
          border-radius:10px;
          overflow: hidden;
          padding:0;

          margin:0 auto;
              margin-bottom:20px;
        .golook{
            display: block;
            width: 140px;
            height:56px;
            line-height: 56px;
            text-align: center;
            color:#B71A49;
            background:#FFD917;
            border-radius:20px;
            margin:40px 31px 0 0;
        }
        img{
          display: block;
          width:132px;
          height:100%;
        }
        .zhe{
            display:flex;
            flex-direction: column;
            justify-content: center;
            // margin-top:-10px;
            flex:1;
            margin-left:30px;
            // align-items: flex-start;
            // text-align: left;
          p{
            display: block;
            width:200px;
            height:42px;
            // background:#fff;
            font-size:24px;
            text-align: left;
            line-height: 42px;
            border-radius:20px;
            margin:0;
            margin-top:10px;
            color:#fff;
            font-weight: bold;
            // padding:0;
            span{
                color:#FFD917;
                font-size:36px;

            }
          }
        }
      }
    }
}
</style>
