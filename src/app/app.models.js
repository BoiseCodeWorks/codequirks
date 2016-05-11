let Posts = function(DS, $rootScope) {
	return DS.defineResource({
		name: 'post',
		endpoint: 'posts',
		relations: {
			belongsTo: {
				post: {
					localField: 'user',
					localKey: 'userId',
				}
			},
			hasMany: {
				tags: {
					localField: 'tags',
					foreignKey: 'tagId',
				}
			}
		},
		beforeUpdate: (resource, data, next) => {
			if ($rootScope.member.id !== 'eca8b7c7-e034-4986-aa0f-58580ef6c906' && data.authorId != $rootScope.member.id) {
				return
			}
			next(null, data);
		},
		beforeDestroy: (resource, data, next) => {
			if ($rootScope.member.id !== 'eca8b7c7-e034-4986-aa0f-58580ef6c906' && data.authorId != $rootScope.member.id) {
				return
			}
			next(null, data);
		}
	})
}

let Tags = function(DS) {
	return DS.defineResource({
		name: 'tag',
		endpoint: 'tags'
	})
}

let dataModels = angular.module('dataModels', ['js-data'])
	.factory('Post', Posts)
.factory('Tag', Tags)

Posts.$inject = ['DS', '$rootScope'];
Tags.$inject = ['DS'];

export {
dataModels
}