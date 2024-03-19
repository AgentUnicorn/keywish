app.service('VersionService', function($http) {
    this.getVersion = function() {
        return $http.get('VERSION').then(function(response) {
            return response.data;
        });
    };
})