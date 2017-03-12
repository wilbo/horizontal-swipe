(function() {

  class HorizontalSwipe {
  	constructor (container) {
  		this.container = container
  		this.speed = 5

  		// binds
  		this.down = this.down.bind(this)
  		this.move = this.move.bind(this)
  		this.up = this.up.bind(this)
  		this.out = this.out.bind(this)
  		this.animate = this.animate.bind(this)

  		// state
  		this.startX = 0
  		this.currentX = 0
  		this.toX = 0
  		this.swiping = false
  		this.repositioning = false
  		this.frameId = 0

  		// this.container.addEventListener('scroll', _.debounce(this.scrolled, this.debounceAfter))
  		this.container.addEventListener('mousedown', this.down)
  		this.container.addEventListener('mousemove', this.move)
  		this.container.addEventListener('mouseup', this.up)

  		this.container.addEventListener('touchstart', this.down)
  		this.container.addEventListener('touchmove', this.move)
  		this.container.addEventListener('touchend', this.up)

  		this.container.addEventListener('mouseleave', this.out)
  	}

  	out () {
  		this.up()
  	}

  	down (event) {
  		if (this.swiping || this.repositioning)
  			return

  		this.swiping = true

  		this.startX = event.pageX || event.touches[0].pageX
  		this.currentX = this.startX

  		this.frameId = requestAnimationFrame(this.animate)
  	}

  	move (event) {
  		if (!this.swiping || this.repositioning)
  			return

  		this.currentX = event.pageX || event.touches[0].pageX
  	}

  	up (event) {
  		if (!this.swiping || this.repositioning)
  			return

  		this.swiping = false

  		// calculate position to animate to (closest div)
  		const children = this.container.children
  		const index = Math.round(this.container.scrollLeft / children[0].offsetWidth)
  		this.toX = children[index].offsetLeft

  		this.currentX = this.container.scrollLeft
  		this.repositioning = true
  	}

  	animate () {
  		this.frameId = requestAnimationFrame(this.animate)

  		if (this.swiping) {
  			this.container.scrollLeft = ((this.currentX - this.startX) * -1) + this.toX
  		}

  		if (this.repositioning) {
  			this.currentX += (this.toX - this.currentX) / this.speed
  			this.container.scrollLeft = this.currentX.toFixed(2)

  			// quit animation if goal reached
  			if (Math.round(this.currentX) === this.toX) {
  				this.repositioning = false
  				cancelAnimationFrame(this.frameId)
  			}
  		}

  	}
  }

  if (typeof module !== "undefined" && typeof require !== "undefined") {
  	module.exports = HorizontalSwipe;
  } else {
  	window["HorizontalSwipe"] = HorizontalSwipe;
  };

})();
