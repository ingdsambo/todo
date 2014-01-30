from rest_framework import viewsets
from rest_framework.routers import DefaultRouter
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from api.models import Task
from api.serializers import TaskSerializer
from api.permissions import IsOwnerOrReadOnly

class TaskMixin(object):
	queryset = Task.objects.all()
	serializer_class = TaskSerializer
	permission_classes = (IsOwnerOrReadOnly,IsAuthenticated,)
	authentication_classes = (SessionAuthentication, BasicAuthentication)    

	def pre_save(self, obj):
		obj.owner = self.request.user

	def get(self, request, format=None):
	    content = {
	        'user': unicode(request.user),  # `django.contrib.auth.User` instance.
	        'auth': unicode(request.auth),  # None
	    }
	    return Response(content)

class TaskViewSet(TaskMixin, viewsets.ModelViewSet):
	pass

task_list = TaskViewSet.as_view({		
	'post':'create'
})

task_detail = TaskViewSet.as_view({
	'get':'retrieve',
	'put':'update',
	'patch':'partial_update',
	'delete':'destroy'
})