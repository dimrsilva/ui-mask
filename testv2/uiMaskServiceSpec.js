describe("uiMaskService", function() {
    "use strict";

    var $uiMask;

    beforeEach(module("ui.mask.service"));

    beforeEach(inject(function (_$uiMask_) {
        $uiMask = _$uiMask_;
    }));

    describe("initialization", function() {
        it("should initialize", function() {
            var mask = $uiMask.create("AAA-9999");
            expect(mask).not.toBeNull();
        });

        it("should not initialize with empty mask", function() {
            var mask = $uiMask.create("");
            expect(mask).toBeNull(); })
    });

    describe("mask", function() {
        it("should mask", function() {
            var mask = $uiMask.create("AAA-9999");
            var masked = mask.mask("abc1234");
            expect(masked).toBe("abc-1234");
        });

        it("should mask partial values", function() {
            var mask = $uiMask.create("AAA-9999");
            var masked = mask.mask("abc12");
            expect(masked).toBe("abc-12__");
        });

        it("should not mask invalid values", function() {
            var mask = $uiMask.create("AAA-9999");
            var masked = mask.mask("ab1234");
            expect(masked).toBeNull();
        });
    });

    describe("unmask", function() {
        it("should unmask", function() {
            var mask = $uiMask.create("AAA-9999");
            var unmasked = mask.unmask("abc-1234");
            expect(unmasked).toBe("abc1234");
        });

        it("should unmask partial values", function() {
            var mask = $uiMask.create("AAA-9999");
            var unmasked = mask.unmask("abc-12__");
            expect(unmasked).toBe("abc12");
        });

        it("should not mask invalid values", function() {
            var mask = $uiMask.create("AAA-9999");
            var unmasked = mask.unmask("ab1234");
            expect(unmasked).toBeNull();
        });
    })

});