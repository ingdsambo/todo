from rest_framework import serializers
from api.models import Task

class TaskSerializer(serializers.ModelSerializer):
	owner = serializers.Field('owner.username')
	
	class Meta:
		model = Task
		fields = ('id','title','description','completed','owner')
