class Mover {
    constructor(container, model, delegate){
        this.container = container
        this.model = model
        this.delegate = delegate
        this.startX = 0
        this.startY = 0
    }
    handleEvent(e){
        if(e.type === this.delegate.device.MOUSEMOVE){
            // stop page from panning on iPhone/iPad - we're moving a note, not the page
            e.preventDefault()
            e = (this.delegate.device.CANTOUCH && e.touches && e.touches.length > 0) ? e.touches[0] : e
            this.container.style.left = (e.clientX - this.startX) + "px"
            this.container.style.top = (e.clientY - this.startY)+ "px"
            return
        }

        if(e.type === this.delegate.device.MOUSEUP){
            this.model.top = parseInt(this.container.style.top.replace("px", ""))
            this.model.left = parseInt(this.container.style.left.replace("px", ""))
            this.model.z = this.container.style.zIndex
            this.delegate.win.removeEventListener(this.delegate.device.MOUSEMOVE, this, true)
            this.delegate.win.removeEventListener(this.delegate.device.MOUSEUP, this, true)
            this.delegate.dropped(this)
            return
        }
        
        if(e.type === this.delegate.device.MOUSEDOWN){
            this.dragStart(e)
            return
        }
    }
    dragStart(e){
        e.preventDefault()
        this.delegate.makeActive()
        e = (this.delegate.device.CANTOUCH && e.touches && e.touches.length > 0) ? e.touches[0] : e
        this.startX = e.clientX - this.container.offsetLeft
        this.startY = e.clientY - this.container.offsetTop
        this.delegate.win.addEventListener(this.delegate.device.MOUSEMOVE, this, true)
        this.delegate.win.addEventListener(this.delegate.device.MOUSEUP, this, true)
    }
}

export default Mover