;(function (win) {
  const doc = win.document
  const docEl = doc.documentElement
  // 基准大小
  const baseSize = 16

  // 设置 rem 函数
  function setRem() {    
    let clientWidth = docEl.clientWidth
    let designWidth = 1920

    if (clientWidth < 500) {
      designWidth = 375
    } else if (clientWidth < 769) {
      designWidth = 590
    } else {
      designWidth = Math.min(clientWidth, designWidth)
    }
    
    const scale = clientWidth / designWidth
    // 设置页面根节点字体大小（“Math.min(scale, 3)” 指最高放大比例为3，可根据实际业务需求调整）
    docEl.style.fontSize = `${baseSize * Math.min(scale, 3)}px`
  }
  // 初始化
  setRem()
  // 改变窗口大小时重新设置 rem
  window.addEventListener('resize', setRem, false)
})(window)
