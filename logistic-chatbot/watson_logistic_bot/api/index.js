/**
 * Created by JJW on 2017-04-13.
 */
'use strict';

console.log('APIs initialize');

const conversation = require('./message');

module.exports = {
    'initialize': (app, options) => {
        conversation.initialize(app, options);
    }
};