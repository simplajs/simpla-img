class SimplaImg {
  beforeRegister() {
    this.is = 'simpla-img';

    this.properties = {
      src: String,
      width: String,
      height: String,
      scale: Number,
      position: Object
    }
  }
}

Polymer(SimplaImg);
