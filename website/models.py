from django.db import models
from django.utils import timezone

class Post(models.Model):
    Content = models.TextField()
    pub_date = models.DateTimeField(default=timezone.now)
    Title = models.CharField(max_length=200)
    Caption = models.TextField()
    Image = models.ImageField(default='/media/Post Images/prof pic.jpg', upload_to='Post Images')
    def __str__(self):
        return self.Title

class Comment(models.Model):
    post = models.ForeignKey('website.Post', on_delete = models.CASCADE, related_name = 'comments')
    name = models.CharField(max_length=200)
    comment_text = models.TextField()
    pub_date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.comment_text
    