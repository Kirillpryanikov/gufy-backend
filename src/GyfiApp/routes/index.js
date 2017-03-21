import SocketPage from './SocketPage'
import App from '../App'

export default {
  path: '/',
  children: [
    {
      path: '/socket',
      action() {
        return {
          component: <SocketPage />,
        }
      },
    },
    {
      path: '*',
      action({ context, error }) {
        return {
          component: <App context={context} error={error}></App>,
          status: error.status || 404,
        }
      },
    },
  ],

  async action({ next }) {
    let route;

    // Execute each child route until one of them return the result
    // TODO: move this logic to the `next` function
    // console.log('action');
    do {
      // console.log('do');

      route = await next();
    } while (!route);

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - Lego Starter Kit`;
    route.description = route.description || '';

    return route;
  },

  // async action({ next, context }) {
  //   const component = await next();
  //   if (component === undefined) return component;
  //   return render(
  //     <App context={context}>
  //       {component}
  //     </App>
  //   );
  // },
};
