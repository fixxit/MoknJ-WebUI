angular.module('Graph').controller('ModalDeleteGraphCtrl',
        function ($scope, $uibModalInstance, parentScope, graph) {
            $scope.name = graph.name;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                $scope.dataLoading = true;
                parentScope.deleteGraph(graph,
                        function (success, message) {
                            if (success) {
                                parentScope.removeFromList(graph);
                                $uibModalInstance.close();
                            } else {
                                $scope.errorMessage = true;
                                $scope.message = message;
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });