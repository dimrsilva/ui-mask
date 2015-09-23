angular.module('ui.mask.service', ['ui.mask.config']).factory('$uiMask', uiMaskFactory);

function uiMaskFactory(uiMaskConfig) {
	return {
		create: function(maskDefinition, maskPlaceholder, maskOptions) {
			var maskCaretMap,
				maskPatterns;


            if (isValidMask()) {
                initMask();

                return {
                    mask: mask,
                    unmask: unmask,
                    isValid: isValid,
                };
            }
            else {
                return null;
            }

            function isValidMask() {
                return typeof maskDefinition === "string" && maskDefinition.length > 0;
            }

			function initMask() {
				maskOptions = uiMaskConfig;
				processRawMask();
			}

			function mask(rawValue) {
                var valueMasked = '',
                    rvi = 0, //rawValueIndex
                    mki = 0; // maskCaretMapIndex

                for (var i = 0; i < maskPlaceholder.length; i++) {
                    if (rvi < rawValue.length && i === maskCaretMap[mki]) {
                        if (maskPatterns[mki].test(rawValue.charAt(rvi))) {
                            valueMasked += rawValue.charAt(rvi) || '_';
                            rawValue = rawValue.substr(1);
                            mki++;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        valueMasked += maskPlaceholder.charAt(i);
                    }
                }
                return valueMasked;
			}

			function unmask(maskedValue) {
                var valueUnmasked = '',
                    mpi = 0; // maskPatternsIndex

                // Preprocess by stripping mask components from value
                for (var i = 0; i < maskComponents.length; i++) {
                    maskedValue = maskedValue.replace(maskComponents[i], '');
                }

                for (var i = 0; i < maskedValue.length; i++) {
                    var chr = maskedValue[i];
                    if (mpi <= maskPatterns.length && maskPatterns[mpi].test(chr)) {
                        valueUnmasked += chr;
                        mpi++;
                    }
                    else if (chr !== maskPlaceholder[i]) {
                        return null;
                    }
                }
                return valueUnmasked;
			}

			function isValid(rawValue) {

			}

            function processRawMask() {
                var characterCount = 0;

                maskCaretMap = [];
                maskPatterns = [];
                var defaultMaskPlaceholder = '';

                if (typeof maskDefinition === 'string') {

                    var isOptional = false,
                            numberOfOptionalCharacters = 0,
                            splitMask = maskDefinition.split('');

                    angular.forEach(splitMask, function(chr, i) {
                        if (maskOptions.maskDefinitions[chr]) {

                            maskCaretMap.push(characterCount);

                            defaultMaskPlaceholder += getPlaceholderChar(i - numberOfOptionalCharacters);
                            maskPatterns.push(maskOptions.maskDefinitions[chr]);

                            characterCount++;
                        }
                        else if (chr === '?') {
                            isOptional = true;
                            numberOfOptionalCharacters++;
                        }
                        else {
                            defaultMaskPlaceholder += chr;
                            characterCount++;
                        }
                    });
                }
                // Caret position immediately following last position is valid.
                maskCaretMap.push(maskCaretMap.slice().pop() + 1);

                maskPlaceholder = defaultMaskPlaceholder;

                maskComponents = getMaskComponents();
            }

            function getPlaceholderChar(i) {
                if (angular.isDefined(maskPlaceholder)) {
                    return maskPlaceholder[i];
                }
                else {
                	return '_';
                }
            }

            // Generate array of mask components that will be stripped from a masked value
            // before processing to prevent mask components from being added to the unmasked value.
            // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
            // If a maskable char is followed by a mask char and has a mask
            // char behind it, we'll split it into it's own component so if
            // a user is aggressively deleting in the input and a char ahead
            // of the maskable char gets deleted, we'll still be able to strip
            // it in the unmaskValue() preprocessing.
            function getMaskComponents() {
                return maskPlaceholder.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
            }
        }
    };
}