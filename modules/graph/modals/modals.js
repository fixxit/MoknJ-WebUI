angular.module('Graph').controller('ModalDeleteGraphCtrl',
        function ($scope, $modalInstance, parentScope, graph) {
            $scope.name = graph.name;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                $scope.dataLoading = true;
                parentScope.deleteGraph(graph,
                        function (success, message) {
                            if (success) {
                                parentScope.removeFromList(graph);
                                $modalInstance.close();
                            } else {
                                $scope.errorMessage = true;
                                $scope.message = message;
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });