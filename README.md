# This project is created based on MERN

This is a findgroup project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation
- [Openlayers](http://openlayers.org/) for Data Visualization

## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```


## Running

Make sure to add a `config.js` file in the `config` folder. See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```

## Error: bcrypt for windows10
Open powershell with administrator privileges and run this command, then proceed with bcrypt installation
* `npm install --global --production windows-build-tools`

if you have the same problem with other system, visit [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions) github.
