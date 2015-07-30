/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-generators
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');
/**
 * Main generator
 * @module index
 */

module.exports = yeoman.generators.Base.extend({
  initializing: function(){
    this.log(yosay('Pomegranate generators'));
  },

  prompting: function(){
    var done = this.async();
    var prompts =[
      {
        name: 'modelName',
        message: 'What do you want your model to be named?'
      },
      {
        type: 'input',
        name: 'modelPath',
        message: 'What is the path to your models directory?',
        default: 'models/sql'
      },
      {
        type: 'confirm',
        name: 'generateController',
        message: 'Do you want to generate a controller for this Model?',
        default: false
      },
      {
        type: 'input',
        name: 'controllerPath',
        message: 'What is path to your controllers directory?',
        default: 'controllers',
        when: function(answers){
          return answers.generateController
        }
      },
      {
        type: 'confirm',
        name: 'generateRoutes',
        message: 'Do you want to generate a route file for this Model?',
        default: false
      },
      {
        type: 'input',
        name: 'routePath',
        message: 'What is path to your routes directory?',
        default: 'routes',
        when: function(answers){
          return answers.generateRoutes
        }
      },
      {
        type: 'input',
        name: 'routeUrl',
        message: 'What is the url path for your route?',
        when: function(answers){
          return answers.generateRoutes
        }
      }
    ];

    this.prompt(prompts, function(props){
      this.modelName = props.modelName.toLowerCase();
      this.modelPath = props.modelPath;
      this.modelFileName = this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1);

      if(this.generateController = props.generateController){
        this.controllerName = this.modelFileName
        this.controllerPath = props.controllerPath;
      };
      if(this.generateRoutes = props.generateRoutes){
        this.routePath = props.routePath;
        this.routeUrl = props.routeUrl
        this.fullFileRoute = path.normalize(this.routePath +'/'+ this.routeUrl + '/index.js')
      };
      done()
    }.bind(this))

  },
  writing: function(){
    this.fs.copyTpl(
      this.templatePath('_Model'),
      this.destinationPath(path.normalize(this.modelPath +'/'+ this.modelFileName + '.js')),
      this
    )
    if(this.generateController){
      this.fs.copyTpl(
        this.templatePath('_Controller'),
        this.destinationPath(path.normalize(this.controllerPath +'/'+ this.modelFileName + '.js')),
        this
      )
    }
    if(this.generateRoutes){
      this.fs.copyTpl(
        this.templatePath('_Route'),
        this.destinationPath(this.fullFileRoute),
        this
      )
    }
  }

});