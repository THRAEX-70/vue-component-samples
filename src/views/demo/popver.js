class Popver {
  create() {
    const popver = document.createElement('div')
    popver.addEventListener('click', e => e.stopPropagation(), false)

    const style = popver.style
    style.border = '1px solid #EBEEF5'
    style.boxShadow = '0 2px 12px 0 rgb(0 0 0 / 10%)'
    style.padding = '10px 5px'
    style.backgroundColor = '#fff'
    style.display = 'none'
    style.position = 'fixed'
    style.top = 0
    style.left = 0

    const none = _ => (popver.style.display = 'none')

    Array.of('Preview', 'Download').forEach(it => {
      const item = document.createElement('a')
      item.addEventListener('click', none, false)
      item.href = '#'
      item.text = it
      item.style.margin = '0 5px'
      popver.appendChild(item)
    })

    const body = document.body
    body.appendChild(popver)
    body.addEventListener('click', none, false)

    this.elem = popver
  }

  show(plink, dlink) {
    const event = window.event
    event.stopPropagation()

    const target = event.target
    const [tw, th] = [target.offsetWidth, target.offsetHeight]

    !this.elem && this.create()

    const style = this.elem.style
    style.display = 'block'
    style.top = `${event.clientY + (th - event.offsetY) + 2}px`
    style.left = `${event.clientX + (tw / 2 - event.offsetX)}px`

    this.elem.childNodes.forEach((it, ind) => (it.href = ind ? dlink : plink))
  }
}

export default new Popver()
