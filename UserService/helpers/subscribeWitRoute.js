import saga from 'rabbitbox';
import { Router } from 'express';

const router = new Router();

const subscribeAction = saga.subscribeActionBuilder(process.env.CHANNEL_NAME);

/**
 * It subscribes to a Wit.ai action and then adds a route to the Express app
 * @param method - The HTTP method to use (get, post, put, delete, etc.)
 * @returns A function that takes in a path, actions, handler, and middleware.
 */
const subscribeWitRoute = (method) => async (path, actions, handler, ...middleware) => {
  if (Array.isArray(actions)) {
    const subscribeForAllActions = actions.map((action) => subscribeAction(action, handler));
    await Promise.all(subscribeForAllActions);
  } else {
    await subscribeAction(actions, handler);
  }

  return method(path, ...middleware, handler);
}

export default {
  get: subscribeWitRoute(router.get),
  post: subscribeWitRoute(router.post),
  put: subscribeWitRoute(router.put),
  delete: subscribeWitRoute(router.delete),
  patch: subscribeWitRoute(router.patch),
};
