#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Sep 17 14:17:26 2018

@author: anishkhanna
"""
from . import views
from django.urls import path
from django.conf.urls import handler404, handler500

app_name = 'website'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('blog/', views.BlogView.as_view(), name='blog'),
    path('predictor/', views.PredictorView.as_view(), name='predictor'),
    path('stockCode/',views.stockCode, name='stockCode'),
    path('addComment/', views.commentAdder, name='commentAdder')
]