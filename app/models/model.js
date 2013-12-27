var _ = require('underscore'),
    helpers = require('../helpers/helpers');

/**
 * Create a new Model
 * @param attributes
 * @constructor
 */
var Model = function Model(attributes) {
    var attrs = attributes || {};
    this.cid = _.uniqueId('c');
    this.attributes = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.init.apply(this, arguments);
};

// default methods
_.extend(Model.prototype, {
    init: function () {},
    get:  function (key) {
        return this.attributes[key];
    },
    set:  function (key, val) {
        this.attributes[key] = val;
    }
});

// apply underscore methods to Model
var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];
_.each(modelMethods, function (method) {
    Model.prototype[method] = function () {
        var args = slice.call(arguments);
        args.unshift(this.attributes);
        return _[method].apply(_, args);
    };
});


Model.extend = helpers.extend;

/**
 * Expose `Model()`
 */
exports = module.exports = Model;

