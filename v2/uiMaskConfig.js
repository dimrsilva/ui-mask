angular.module('ui.mask.config', [])
        .value('uiMaskConfig', {
        	defaultPlaceholderChar: "_",
            maskDefinitions: {
                '9': /\d/,
                'A': /[a-zA-Z]/,
                '*': /[a-zA-Z0-9]/
            },
            clearOnBlur: true,
            eventsToHandle: ['input', 'keyup', 'click', 'focus']
        });