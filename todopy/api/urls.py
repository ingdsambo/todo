from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from api.views import task_list, task_detail

urlpatterns = patterns(
	'api.views',    
    url(r'^tasks/$', task_list, name='task_list'),
    url(r'^tasks/(?P<pk>[0-9]+)$', task_detail, name='task_detail'),
)

urlpatterns = format_suffix_patterns(urlpatterns)