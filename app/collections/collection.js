// import
var _ = require('underscore'),
    Model = require('../models/model');

/**
 * Create New collection
 * @param initArr Initializer array
 * @constructor
 */
var Collection = function Collection(models) {
    this.cid = _.uniqueId('c');
    this.models = [];
    this.reset(models);
    this.init.apply(this, arguments);
};

// defaults
_.extend(Collection.prototype, {
    model: Model,
    init:   function () {
    },
    reset:  function (models) {
        _.each(models, this.add, this);
    },
    add:    function (model) {
        if (model instanceof this.model) {
            this.models.push(model);
        } else {
            this.models.push(new this.model(model));
        }
    },
    remove: function (model) {

    },
    filter: function (filter) {

    },
    at:     function (index) {
        return this.models[index];
    },
    all:    function () {
        return this.models;
    },
    length: function() {
        return this.models.length;
    }
});

/**
 * Expose `Collection()`
 */
exports = module.exports = Collection;
