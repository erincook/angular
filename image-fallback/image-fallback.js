/**
 * Created by erin.cook on 4/2/15.
 */
'use strict';

/**
 * @ngdoc directive
 * @name app.directive:imageFallback
 * @description
 * # imageFallback
 */
angular.module('app')
    .directive('imageFallback', function(user) {
        return {
            templateUrl: 'directives/image-fallback/image-fallback.html',
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {
                scope.defaultImage = 'https://s.w-x.co/avatar-default-90x90.png';
                if(!attrs.imageFallback){
                    scope.imgsrc = user.profilePicUrl ? user.profilePicUrl : scope.defaultImage;
                } else {
                    scope.imgsrc = attrs.imageFallback;
                }
                scope.img = new Image();
                $(".wx-bigweb-avatar").attr('src', scope.imgsrc);
                scope.img.src = scope.imgsrc;

                $(document).ready(function () {
                    $('img').error(function () {
                        $(this).addClass('noImg');
                    });
                });
            }
        }
    });
