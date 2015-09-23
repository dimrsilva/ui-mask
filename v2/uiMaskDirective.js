angular.module('ui.mask.directive', ['ui.mask.service']).directive('uiMask', uiMaskDirective);

function uiMaskDirective($uiMask) {
    return {
        priority: 100,
        require: 'ngModel',
        restrict: 'A',
        link: uiMaskLinkFunction,
    };

    function uiMaskLinkFunction(scope, iElement, iAttrs, ngModel) {
        var mask = null;

        ngModel.$formatters.push(formatter);
        ngModel.$parsers.push(parser);

        iAttrs.$observe('uiMask', initialize);

        function initialize(uiMaskAttr) {
            if (mask !== null) {
                uninitialize();
            }
            mask = $uiMask.create(uiMaskAttr);
            if (mask !== null) {
                bindEventListeners();
                ngModel.$viewValue = mask.mask(ngModel.$viewValue);
                ngModel.$render();
            }
        }

        function uninitialize() {
            if (mask !== null) {
                unbindEventListeners();
                ngModel.$viewValue = mask.unmask(ngModel.$viewValue);
                ngModel.$render();
            }
            mask = null;
        }

        function bindEventListeners() {
            // iElement.bind('blur', blurHandler);
            // iElement.bind('mousedown mouseup', mouseDownUpHandler);
            // iElement.bind(linkOptions.eventsToHandle.join(' '), eventHandler);
            // iElement.bind('paste', onPasteHandler);
        }

        function unbindEventListeners() {
            // iElement.unbind('blur', blurHandler);
            // iElement.unbind('mousedown', mouseDownUpHandler);
            // iElement.unbind('mouseup', mouseDownUpHandler);
            // iElement.unbind('input', eventHandler);
            // iElement.unbind('keyup', eventHandler);
            // iElement.unbind('click', eventHandler);
            // iElement.unbind('focus', eventHandler);
            // iElement.unbind('paste', onPasteHandler);
        }

        function formatter(rawValue) {
            if (mask !== null) {
                return mask.mask(rawValue);
            }
            else {
                return rawValue;
            }
        }

        function parser(maskedValue) {
            if (mask !== null) {
                return mask.unmask(maskedValue);
            }
            else {
                return maskedValue;
            }
        }

    }
}

