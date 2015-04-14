class RouterService {
  constructor() {
  	this.router = null;
  }

  set(router) {
    this.router = router;
  }

  transitionTo(routeNameOrPath, params, query) {
    this.router.transitionTo(routeNameOrPath, params, query);
  }
}

export default new RouterService()