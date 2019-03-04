<template>
  <div :class="tigerCls" ref="tiger">
    <div
      class="tiger_item"
      :style="{backgroundImage:'url('+tigerImgList[0]+')',
          backgroundPositionY: tigerItemFirstY + 'px'}"
    ></div>
    <div
      class="tiger_item"
      :style="{backgroundImage:'url('+tigerImgList[1]+')',
          backgroundPositionY: tigerItemSecondY + 'px'}"
    ></div>
    <div
      class="tiger_item"
      :style="{backgroundImage:'url('+tigerImgList[2]+')',
          backgroundPositionY: tigerItemThirdY + 'px'}"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'Tiger',
  data () {
    return {
      tigerCls: 'tiger',
      tigerItemFirstY: 0,
      tigerItemSecondY: 0,
      tigerItemThirdY: 0,
      rotating: false,
      roatingLinear: false,
      tigerItemHeight: 0,
      startTime: 0,
      timer: null
    }
  },
  props: {
    tigerImgList: {
      type: Array,
      required: true
    },
    tigerPrizeNumber: {
      type: Number,
      required: true
    }
  },
  watch: {
    rotating (newVal, oldVal) {
      if (this.roatingLinear) {
        this.tigerCls = 'tiger tiger-tran-linear'
      } else if (this.rotating) {
        this.tigerCls = 'tiger tiger-tran'
      } else {
        this.tigerCls = 'tiger'
      }
      // this.tigerCls = this.rotating ? 'tiger tiger-tran' : 'tiger'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.tigerItemHeight === 0) {
        this.tigerItemHeight = this.$refs.tiger.offsetHeight
      }
      this.tigerItemFirstY = this.tigerItemSecondY = this.tigerItemThirdY = this.tigerItemHeight
    },
    start (choosed) {
      // 开始动画
      if (this.rotating) {
        return
      }
      setTimeout(() => {
        this.rotating = false
        this.$emit('onTigerSuccess')
      }, 5500)
      this.init()
      this.$nextTick(() => {
        this.rotating = true
        let height = this.$refs.tiger.offsetHeight
        this.tigerItemFirstY =
          height * (this.tigerPrizeNumber * 2 + choosed)
        setTimeout(() => {
          this.tigerItemSecondY =
            height * (this.tigerPrizeNumber * 2 + choosed)
        }, 500)
        setTimeout(() => {
          this.tigerItemThirdY =
            height * (this.tigerPrizeNumber * 2 + choosed)
        }, 1000)
      })
    },
    startNow () {
      if (this.rotating) {
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      // this.init()
      this.$nextTick(() => {
        this.startTime = (new Date()).getTime()
        this.rotating = true
        this.roatingLinear = true
        this.tigerItemFirstY = 100000
        setTimeout(() => {
          this.tigerItemSecondY = 100000
        }, 500)
        setTimeout(() => {
          this.tigerItemThirdY = 100000
        }, 1000)

        // 超时结束
        this.timer = setTimeout(() => {
          if (this.rotating) {
            this.clear()
            this.$emit('onTigerFail')
            this.tigerItemFirstY = this.tigerItemSecondY = this.tigerItemThirdY = this.tigerItemHeight
          }
        }, 8000)
      })
    },
    choose (index) {
      let t = setInterval(() => {
        if (this.startTime !== 0 && (new Date()).getTime() - this.startTime > 4000) {
          clearInterval(t)
          this.clear()
          this.$emit('onTigerSuccess')
          setTimeout(() => {
            this.tigerItemFirstY = this.tigerItemSecondY = this.tigerItemThirdY = this.tigerItemHeight * index
          }, 100)
        }
      }, 100)
    },
    stop () {
      setTimeout(() => {
        this.clear()
        this.tigerItemFirstY = this.tigerItemSecondY = this.tigerItemThirdY = this.tigerItemHeight
      }, 1500)
    },
    clear () {
      this.startTime = 0
      this.rotating = false
      this.roatingLinear = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tiger {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;

  .tiger_item {
    width: 160px;
    height: 160px;
    border-radius: 8px;
    // background-size: cover;
    background-size: 100%;
    background-position: center center;
    background-repeat: repeat-y;
  }
}

.tiger-tran {
  .tiger_item {
    transition: all ease 4s;
  }
}

.tiger-tran-linear {
  .tiger_item {
    transition: all ease 100s;
  }
}
</style>
