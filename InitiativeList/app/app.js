
var app = angular.module('initiativeApp', ['ui.bootstrap', 'xeditable']);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});

// override the default input to update on blur
app.directive('ngModelOnblur', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.bind('focus', function () {
                elm.unbind('input').unbind('keydown').unbind('change');
            });
            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});
app.directive('ngModelOnchange', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.bind('focus', function () {
                elm.unbind('input').unbind('keydown');
            });
            elm.unbind('input').unbind('keydown');
            elm.bind('change', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});