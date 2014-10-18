'use strict';

var path = require('path');
var gulp = require('gulp');
var fs = require('fs');
var glob = require('glob');

//todo: Pass a template to this function
module.exports = function (config) {
    /*config = {
        source: ''
        dest: ''
        moduleName: ''
    * }*/

    glob(config.source, function(er, files) {
        var fileStart = createFileStart(config.moduleName);
        var routes = createRoutes(files);
        var fileEnd = createFileEnd();

        var ngRoutes = fileStart + routes + fileEnd;

        fs.writeFile(config.dest, ngRoutes);
    });
};

function createRoutes(files) {
    var routes = [];

    for(var i = 0, j = files.length; i < j; i++) {
        routes.push(createStateString(files[i]));
    }

    routes.push(';');

    return routes.join('');
}

function createFileStart(moduleName) {
    var fileStart = '' +
        '"use strict";' +
        'angular.module(' + moduleName + ')' +
            '.config(function($stateProvider, $urlRouterProvider) {' +
                '$stateProvider' +
                    '.state("course", {' +
                        'url: "/:courseId"' +
                    '})' +
                    '.state("home", {' +
                        'url: "/"' +
                    '})';

    return fileStart;
}

function createFileEnd() {
    var fileEnd = '' +
        '$urlRouterProvider.otherwise("/");' +
    '});';

    return fileEnd;
}

function createStateString(file) {
    var state = '' +
        '.state(' + getStateName(file) + ', {' +
            getStateConfigTemplate(file) +
        '})';

    return state;
}

function getStateConfigTemplate (file) {
    var templates = [];

    if(true) {
        templates.push(getUrlTemplate(file));
    }

    if(file.controller) {
        templates.push(getControllerTemplate(file))
    }

    return templates.join(',');
}

function getStateName(file) {
    var filePath = file.replace('.html', '');
    var filePieces = filePath.split('/');
    var stateName = filePieces[filePieces.length - 1];

    return '"' + stateName + '"';
}

function getControllerTemplate(file) {
    return 'controller: "' + file.controller + '"';
}

function getUrlTemplate(file) {
    return 'templateUrl:"' + file + '"';
}