from django.db import models

class Task(models.Model):
	owner = models.ForeignKey('auth.User', related_name='task')
	completed = models.BooleanField(default=False)
	title = models.CharField(max_length=100) 
	description = models.TextField()
