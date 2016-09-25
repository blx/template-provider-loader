/*
 * Outputs a function containing a lazy resolve of the template path, allowing
 * Webpack to apply code splitting.
 *
 * The `prefix` option is for providing other loaders to be applied to the HTML template.
 * Example webpack config:
 *
 *     {
 *         ...
 *         templateProviderLoader: {
 *             prefix: 'ng-cache?module=YOUR-MODULE-NAME&prefix=*!'
 *         },
 *         ...
 *     }
 *         
 *
 * Usage:
 * 
 *     $stateProvider.state("state-x", {
 *         templateProvider: require('template-provider-loader!path/to/template.html')
 *         ...
 *     });
 *
 * I have no idea if this is a good idea.
 */

module.exports = function(source) {

    // We hella deterministic in here
    this.cacheable();

    // Possible other loaders for resource (NB this is probably not idiomatic)
    var prefix = this.options.templateProviderLoader && this.options.templateProviderLoader.prefix || '';

    // Boilerplate to ensure template loading
    // * is deferred (lazy)
    // * defines a split point
    return "module.exports = ['$q', function($q) { " +
        "var deferred = $q.defer(); " +
        "require.ensure([], function(require) {" +
        "  deferred.resolve(require('" + prefix + this.resourcePath + "'));" +
        "});" +
        "return deferred.promise;" +
        "}]";
}
