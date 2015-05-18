/**
 * Created by erin.cook on 3/2/15.
 */

'use strict';

/**
 * @ngdoc directive
 * @name app.directive:alternatePlaceholder
 * @description
 * # alternatePlaceholder
 */
angular.module('app')
    .directive('alternatePlaceholder', function ($rootScope) {
        return {
            scope: true,
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'directives/alternate-placeholder/alternate-placeholder.html',
            link: function postLink(scope, element, attrs) {
                scope.findMyInput = element[0].querySelector('input');

                if(scope.findMyInput === null){ //Then it might be a select.. let's check.
                    scope.findMyInput = element[0].querySelector('select');
                    scope.placeholder = $('#' +  scope.findMyInput.id + ' option[value=""]').first().html();
                } else {
                    scope.placeholder = scope.findMyInput.placeholder;
                }
                scope.inputId = scope.findMyInput.id;
                scope.foundMyInput = $("#" + scope.findMyInput.id);
                var alwaysShow = false;
                if(scope.placeholder == undefined){
                    //Fix for IE9
                    scope.placeholder = scope.inputId;
                    alwaysShow = true;
                }

                //show it at least for a split second to make sure the spacing is maintained.
                 element.addClass('alt-placeholder-show');
                var uiMaskDontShow = false;
                var checkModelValue = function() {
                    uiMaskDontShow = false; //A special check for numerical ui masked inputs. If we ever need to mask for an input that is not numerical, then we'll need to change this.
                    if(scope.foundMyInput.attr('ui-mask') && scope.foundMyInput.val().replace(/[^0-9]/g,"").length == 0){
                        uiMaskDontShow = true;
                    }
                    if (alwaysShow || (attrs.alternatePlaceholder && attrs.alternatePlaceholder.length > 0 && attrs.alternatePlaceholder != '{}') ||
                        (scope.foundMyInput.val() && scope.foundMyInput.val().length > 0 && !uiMaskDontShow)) {
                        element.addClass('alt-placeholder-show');
                    } else {
                        element.removeClass('alt-placeholder-show');
                    }
                }
                checkModelValue();  //call it onLoad.
                var getIsDirty = function () {
                    if ( alwaysShow || scope.foundMyInput.val().length > 0)
                    {
                        element.addClass('alt-placeholder-show');
                    } else {
                        element.removeClass('alt-placeholder-show');
                    }
                }

                /*   Listeners */
                $rootScope.$on("alternatePlaceholder:getIsDirty", function(){
                    checkModelValue();
                });
                scope.foundMyInput.on('keyup change', function () {
                    getIsDirty();
                });
                scope.foundMyInput.on('blur', function () {
                    checkModelValue();
                });
            }
        };
    });
