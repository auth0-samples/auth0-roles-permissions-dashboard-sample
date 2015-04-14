class Config {
  constructor() {
  	this.data = { };
  }

  init(cfg) {
    this.data = cfg;
  }

  get(key) {
    return this.data[key];
  }
}

export default new Config();