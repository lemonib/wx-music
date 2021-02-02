// components/bottomModel/bottomModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modelShow:Boolean
  },
  options: {
    // 解除组件样式隔离
    styleIsolation: 'apply-shared',
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeModel(){
      this.setData({
        modelShow: false
      })
    },
  }
})