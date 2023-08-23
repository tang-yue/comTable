(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    (window as any).clientWidth = (docEl as any).clientWidth;
    (window as any).clientHeight = (docEl as any).clientHeight
    if (!(window as any).clientWidth) return
    docEl.style.fontSize = 100 * ((window as any).clientHeight / 1080) + 'px';
    (window as any).base = 100 * ((window as any).clientHeight / 1080)
  }
  try {
    recalc()
  } catch (e) {
    console.log(e)
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
