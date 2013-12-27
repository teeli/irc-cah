// import
var _ = require('underscore'),
    helpers = require('../helpers/helpers');
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
    /**
     * Initialize collection
     */
    init:   function () {

    },
    /**
     * Reset collection
     * @param models Array of models
     */
    reset:  function (models) {
        _.each(models, this.add, this);
    },
    /**
     * Add a new model to collection
     * @param model
     */
    add:    function (model) {
        if (model instanceof this.model) {
            this.models.push(model);
        } else {
            this.models.push(new this.model(model));
        }
    },
    /**
     * Remove a model from collection
     * @param model
     */
    remove: function (model) {
        this.models = _.without(this.models, model);
    },
    /**
     * Find a model from collection with matching key value pari
     * @param key
     * @param val
     * @returns (Model)
     */
    find: function(key, val) {
        return _.find(this.models, function(model) {
            if(model.get(key) == val) return true;
        });
    },
    /**
     * Get model at index
     * @param index
     * @returns (Model)
     */
    at:     function (index) {
        return this.models[index];
    },
    /**
     * All models as array
     * @returns {Array}
     */
    all:    function () {
        return this.models;
    },
    /**
     * Length of the collection
     * @returns {Number}
     */
    length: function() {
        return this.models.length;
    },
    /**
     * Aliast for length()
     * @returns {Number}
     */
    count: function() {
        return this.length();
    },
    /**
     * Pluck attribute from each model in the collection
     */
    pluck: function(attr) {
        return _.invoke(this.models, 'get', attr);
    },
    /**
     * Shuffle models
     */
    shuffle: function () {
        _.shuffle(this.models);
    }
});

Collection.extend = helpers.extend;

/**
 * Expose `Collection()`
 */
exports = module.exports = Collection;
