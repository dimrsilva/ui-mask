describe("uiMaskDirective", function () {
	"use strict";

    var formHtml  = "<form name='test'><input name='input' ng-model='x' ui-mask='{{mask}}'></form>";
  	var inputHtml = "<input name='input' ng-model='x' ui-mask='{{mask}}'>";
  	var compileElement, scope;

  	beforeEach(module("ui.mask.directive"));
    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope;
        compileElement = function(html) {
            return $compile(html)(scope);
        };
    }));

    describe("lifecycle", function() {
    	it("should initialize", function() {
            var input = compileElement(inputHtml);
            scope.$apply("x = 'abc1234'");
            scope.$apply("mask = 'AAA-9999'");
            expect(input.val()).toBe("abc-1234");
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

});