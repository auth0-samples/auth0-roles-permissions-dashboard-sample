class Lock {
  constructor() {

  }

  init(clientId, domain) {
    this.lock = new Auth0Lock(clientId, domain);
  }

  show(callback) {
    this.lock.show({ closable: false }, callback);
  }
}

export default new Lock();