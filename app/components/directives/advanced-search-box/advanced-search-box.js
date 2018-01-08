'use strict';

angular
    .module("NewsApp")
    .config(advancedSearchConfig)
    .directive("advancedSearchBox", advancedSearchBoxDrt);

function advancedSearchConfig(DataNewsAPIFactory, NEWSAPI, $filter) {
}

function advancedSearchBoxDrt() {
    return {
        restrict: 'EA',
        templateUrl: 'components/directives/advanced-search-box/advanced-search-box.html',
        css: 'components/directives/advanced-search-box/advanced-search-box.css',         // Provide by angular-css
        controller: AdvancedSearchBoxCtrl,
        controllerAs: vm
    }
}

function AdvancedSearchBoxCtrl() {

    var vm = this;

    vm.selectedSource = null;
    vm.sources = [];
    vm.selectedLanguage = null;
    vm.languages = NEWSAPI.LANGUAGES;
    vm.selectedSortBy = null;
    vm.sortby = NEWSAPI.SORTBY;

    // TODO. Guardar en un array los sources y no estar pidiendolos cada vez
    // Recuperar la lista de sources y cargarlos en el select de sources
    DataNewsAPIFactory
        .getSources()
        .then(function(result){
            vm.sources = result.sources;
        })
        .catch(function(err){
            console.error('GetSources error: ',err);
        });

    // Search
    vm.search = function search(selectedSearch,selectedSource,selectedFrom,selectedTo,selectedLanguage,selectedSortBy) {
        console.log('paso');

        // Convert dates to ISO 8601 format
        selectedFrom = $filter('date')(selectedFrom, 'yyyy-MM-dd');
        selectedTo   = $filter('date')(selectedTo, 'yyyy-MM-dd');

        DataNewsAPIFactory.getEverything(selectedSearch,selectedSource,'',selectedFrom,selectedTo,selectedLanguage,selectedSortBy, 20)
            .then(function (result) {
                $scope.articles = result.articles;
            })
            .catch(function (err) {
                console.error(err.data.code + ' - ' + err.data.message);
            });
    };
}]);