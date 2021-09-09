import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {};

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    // Initiate classes and wait for async operations here.
    const API_ENTRY_POINT = 'https://swapi.boom.dev/api/planets/';
    this.data.count = 0;
    this.data.planets = {}

    const response = await fetch(API_ENTRY_POINT)
    let { count, next, results } = await response.json();

    this.data.count = count;
    this.data.planets = [...results]
    

    while (next !== null) {
      const response = await fetch(next)
      const result = await response.json();
      this.data.planets = [...this.data.planets, ...result.results]
      next = result.next;
    }
  
    this.emit(Application.events.APP_READY);
  }
}

