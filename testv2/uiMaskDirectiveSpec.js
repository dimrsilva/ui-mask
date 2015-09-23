describe("uiMaskDirective", function () {
	"use strict";

    var formHtml  = "<form name='test'><input name='input' ng-model='x' ui-mask='{{mask}}'></form>";
  	var inputHtml = "<input name='input' ng-model='x' ui-mask='{{mask}}'>";
  	var compileElement, scope;

  	beforeEach(module("ui.mask.directive"));

    beforeEach(function() {
        angular.module("test",[]).directive("toUpper", function() {
            return {
                priority: 200,
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, iElement, iAttrs, controller) {
                    controller.$formatters.push(function(fromModelValue) {
                        return angular.uppercase(fromModelValue);
                    });
                    controller.$parsers.push(function(fromViewValue) {
                        return angular.lowercase(fromViewValue);
                    });
                }
            }
        });
        module("test");
    });

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope;
        compileElement = function(html) {
            return $compile(html)(scope);
        };
    }));

    describe("initialization", function() {
    	it("should initialize", function() {
            var input = compileElement(inputHtml);
            scope.$apply("x = 'abc1234'");
            scope.$apply("mask = 'AAA-9999'");
            expect(input.val()).toBe("abc-1234");
    	});

        it("should not dirty or invalidate the input", function() {
            var input = compileElement(inputHtml);
            scope.$apply("x = 'abc123'");
            scope.$apply("mask = '(9) * A'");
            expect(input.hasClass("ng-pristine")).toBeTruthy();
            scope.$apply("mask = '(9) * A 9'");
            expect(input.hasClass("ng-pristine")).toBeTruthy();
        });

        it("should not change the model value", function() {
            scope.$apply("x = 'abc123'");
            scope.$apply("mask = '(A) * 9'");
            expect(scope.x).toBe("abc123");
            scope.$apply("mask = '(A) * 9 A'");
            expect(scope.x).toBe("abc123");
        });

        it("should set ngModelController.$viewValue to match input value", function() {
            compileElement(formHtml);
            scope.$apply("x = 'ab1'");
            scope.$apply("mask = '(A) * 9'");
            expect(scope.test.input.$viewValue).toBe("(a) b 1");
            scope.$apply("mask = '(A) * 9 A'");
            expect(scope.test.input.$viewValue).toBe("(a) b 1 _");
        });

        it("should uninitialize", function() {
            var input = compileElement(inputHtml);
            scope.$apply("x = 'abc1234'");
            scope.$apply("mask = 'AAA-9999'");
            expect(input.val()).toBe("abc-1234");
            scope.$apply("mask = ''");
            expect(input.val()).toBe("abc1234");
        });
    });

    describe("with other directives", function() {

        beforeEach(function () {
            compileElement("<form name='test'><input to-upper name='input' ng-model='x' ui-mask='{{mask}}'></form>");
        });

        it("should play nicely", function() {
            scope.$apply("x = 'ab1'");
            scope.$apply("mask = '(A) * 9'");
            expect(scope.x).toBe("ab1");
            expect(scope.test.input.$viewValue).toBe("(A) B 1");
            scope.$apply("mask = '(A)A'");
            expect(scope.test.input.$viewValue).toBe("(A)B");
        });
    });

});