export class Slide{
  constructor(slide, wrapper, prev, next){
    this.prev = document.querySelector(prev);
    this.next = document.querySelector(next);
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper)
    this.active = 2;
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
    this.elements = {
      left3: this.active - 3,
      left2: this.active - 2,
      left1: this.active - 1,
      right1: this.active + 1,
      right2: this.active + 2,
      right3: this.active + 3
    };
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s ease' : '';
  }

  moveSlide(active){/*
    let position = -((active - 2) * this.slide.children[0].getBoundingClientRect().width)
    if(active == 1){
      position = 39
    }else if(active == 0){
      position = 329
    }*/
    
    let position = -(250 * (active - 2))
    this.transition(true)
    this.dist.movePosition = position
    this.dist.finalPosition = position
    this.slide.style.transform = `translateX(${position}px)`
  }

  moveSlideMouse(position){
    console.log(position)
    this.dist.movePosition = position;
    this.slide.style.transform = `translateX(${Math.ceil(position)}px)`
    this.updateMoveSlide(position)
  }

  updateMoveSlide(position){
    this.active = Math.floor(Math.abs((position) / 250)) + 2
    this.updateElements(this.active)
    this.slideConfig()
  }

  updateElements(active){
    this.elements = {
      left3: active - 3,
      left2: active - 2,
      left1: active - 1,
      right1: active + 1,
      right2: active + 2,
      right3: active + 3
    };
  }

  slideConfig(){
    [...this.slide.children].map((i,index) => {
      switch(index){
        case this.elements.left3:
            i.style.zIndex = '2'
            i.style.margin = ''
            i.style.width = ''
            i.style.height = ''
            i.firstChild.style.transform = ''
            i.firstChild.style.transformStyle = ''
          break;
        case this.elements.left2:
            i.style.zIndex = '3'
            i.style.margin = '0 -126px 0 -85px'
            i.firstChild.style.transform = 'rotateY(-70deg) scale(1)'
            i.firstChild.style.transformStyle = 'preserve-3d'
            i.style.width = '250px'
            i.style.height = '225px'
          break;
        case this.elements.left1:
            i.style.zIndex = '4'
            i.style.margin = '0 -14px 0 0'
            i.firstChild.style.transform = 'rotateY(-45deg) scale(1)'
            i.firstChild.style.transformStyle = 'preserve-3d'
            i.style.width = '300px'
            i.style.height = '330px'
          break;
        case this.active:
            i.style.zIndex = '5'
            i.style.width = '350px'
            i.style.height = '400px'
            i.style.margin = '0'
            i.firstChild.style.transform = 'scale(1)'
            i.firstChild.style.transformStyle = ''
          break;
        case this.elements.right1:
            i.style.zIndex = '4'
            i.style.margin = '0 0 0 -14px'
            i.firstChild.style.transform = 'rotateY(45deg) scale(1)'
            i.firstChild.style.transformStyle = 'preserve-3d'
            i.style.width = '300px'
            i.style.height = '330px'
          break;
        case this.elements.right2:
            i.style.zIndex = '3'
            i.style.margin = '0 -85px 0 -126px'
            i.firstChild.style.transform = 'rotateY(70deg) scale(1)'
            i.firstChild.style.transformStyle = 'preserve-3d'
            i.style.width = '250px'
            i.style.height = '225px'
          break;
        case this.elements.right3:
            i.style.zIndex = '2'
            i.style.margin = ''
            i.firstChild.style.transform = ''
            i.firstChild.style.transformStyle = ''
          break;
      }
    })
  }
  onPrev(){
    if(this.active > 0){
      this.active = this.active - 1
      this.updateElements(this.active)
      this.slideConfig()
      this.moveSlide(this.active)
    }
  }
  onNext(){
    if((this.active) + 1 < this.slide.children.length){
      this.active = this.active + 1
      this.updateElements(this.active)
      this.slideConfig()
      this.moveSlide(this.active)
    }
  }

  onStart(event) {
    this.transition(false)
    let moveType;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = 'mousemove';
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = 'touchmove';
    }
    this.wrapper.addEventListener(moveType, this.onMove);
  }

  onEnd(event){
    const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    console.log(this.dist)
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.2;
    return this.dist.finalPosition - this.dist.movement;
  }

  onMove(event) {
    const pointerPosition =
      event.type === 'mousemove'
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlideMouse(Math.ceil(finalPosition));
  }

  addEvents(){
    this.prev.addEventListener('click', this.onPrev);
    this.next.addEventListener('click', this.onNext);
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvents(){
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  init(){
    this.slideConfig();
    this.bindEvents();
    this.addEvents();
  }
}