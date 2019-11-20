import path from 'path';
import fs from 'fs';

import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '../src/reducers';
import {
  StaticRouter,
} from 'react-router-dom';
import App from '../src/App';
import { StoreContext } from 'redux-react-hook';

const PORT = 8080;
const app = express();

const router = express.Router();

function renderFullPage(html, preloadedState = {}) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${ html }</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${ JSON.stringify(preloadedState).replace(
    /</g,
    '\\u003c',
  ) }
        </script>
        <script src="/static/js/2.dd36a251.chunk.js"></script>
        <script src="/static/js/main.cbe622ff.chunk.js"></script>
      </body>
    </html>
    `;
}

const serverRenderer = (req, res, next) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }
    const context = {};
    const preloadedState = {
      todo: {
        todos: [
          {
            id: 1,
            text: 'todo1',
            completed: false,
          },
          {
            id: 1,
            text: 'todo1',
            completed: true,
          }],
      },
    };
    const store = createStore(reducers, preloadedState);
    console.log(req.url);
    const markup = ReactDOMServer.renderToString(
      <Provider store={ store }>
        <StoreContext.Provider value={ store }>
          <StaticRouter location={ req.url } context={ context }>
            <App/>
          </StaticRouter>
        </StoreContext.Provider>
      </Provider>,
    );
    //return res.send(renderFullPage(markup, preloadedState));
    //console.log(data.indexOf('window.__PRELOADED_STATE__={}'))
    //console.log(data.replace(
    //  '<div id="root"></div>',
    //  `<div id="root">${ markup }</div>`,
    //).replace(
    //  'window.__PRELOADED_STATE__={}',
    //  'window.__PRELOADED_STATE__=' + JSON.stringify(preloadedState) + ';',
    //))
    //console.log(data.replace(
    //  '<div id="root"></div>',
    //  `<div id="root">${ markup }</div>`,
    //).replace(
    //  'window.__PRELOADED_STATE__={}',
    //  'window.__PRELOADED_STATE__=' + JSON.stringify(preloadedState) + ';',
    //))
    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ markup }</div>`,
      ).replace(
        'window.__PRELOADED_STATE__={}',
        'window.__PRELOADED_STATE__=' + JSON.stringify(preloadedState) + ';',
      ),
    );
  });
};
//router.use('^/$', serverRenderer);  黑人❓。。
//router.use('/me', serverRenderer);

router.use('/about', serverRenderer);
router.use('^/$', serverRenderer);

router.use(
  express.static(path.resolve(__dirname, '..', 'build'), {maxAge: '30d'}),
);

// tell the app to use the above rules
app.use(router);

// app.use(express.static('./build'))
app.listen(PORT, () => {
  console.log(`SSR running on port ${ PORT }`);
});