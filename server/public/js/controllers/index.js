'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    console.log('frontend done');
    $scope.global = Global;
    $scope.test = 'yeah';
}]);