node-express-hogan-i18n-example
===============================

## Synopsis

Node.js server using Express 4.0, Hogan-Express template engine and i18n translation module with layout template and default header, navigation and footers already setup.

## Motivation

Nowadays we live in a globalised world where companies deal with customers, suppliers and other businesses irrespective of their country. Globalisation has brought with it a mingling of audiences with various mother tongues, and this is something to take into consideration when building a website and trying to target specific language group. This example features multilingual website with Hogan template engine which is basically Twitter’s version of Mustache for Node.js and i18n translation module boilerplate which can be a valuable resource for building fast, robust, and adaptable web apps or sites.

In order to focus on delivering content in the most effective way, this example uses progressive enhancement technique. Content is created first and other layers of enhancements are layered on top of the website. Each layer of coding placed on top of the content is optional. If the enhancement is capable of being displayed by the browser, it will be displayed. If the enhancement cannot be displayed by the browser, the enhancement will not be displayed, but the user's ability to consume the content will not be hindered. This means that the website continues to work properly even when Javascript is disabled or CSS not supported.

## Installation

Once you have forked the project, you can run the app by simply typing the following line in your terminal:

```js
npm start
```
And here is how you run the app in production mode:

```js
node_env=PRODUCTION npm start
```


## License

MIT License

Copyright (c) 2014 Dian Dimitrov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
