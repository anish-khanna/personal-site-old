from django.views import generic
from django.http import JsonResponse, HttpResponse
import json
import numpy as np
import pandas as pd
from .models import Post, Comment
from keras.models import load_model
import datetime   
import urllib.request    
from pandas.tseries.holiday import AbstractHolidayCalendar, Holiday, nearest_workday, \
    USMartinLutherKingJr, USPresidentsDay, GoodFriday, USMemorialDay, \
    USLaborDay, USThanksgivingDay 
# Initialising the RNN into sequential class
from django.contrib.staticfiles.templatetags.staticfiles import static 
from django.core.serializers.json import DjangoJSONEncoder

class USTradingCalendar(AbstractHolidayCalendar):
    rules = [
        Holiday('NewYearsDay', month=1, day=1, observance=nearest_workday),
        USMartinLutherKingJr,
        USPresidentsDay,
        GoodFriday,
        USMemorialDay,
        Holiday('USIndependenceDay', month=7, day=4, observance=nearest_workday),
        USLaborDay,
        USThanksgivingDay,
        Holiday('Christmas', month=12, day=25, observance=nearest_workday)
    ]

class IndexView(generic.ListView):
    template_name = 'website/index.html'
    
    def get_queryset(self):
        return

class BlogView(generic.ListView):
    template_name = 'website/blog.html'
    context_object_name = 'post_list'
    
    def get_queryset(self):
        return Post.objects.order_by('-pub_date')[:]
    
class PredictorView(generic.ListView):
    template_name = 'website/predictor.html'
    
    def get_queryset(self):
        return
    
def stockCode(request):
    if request.method == "POST":
        code = request.POST.get("code")
        
        model = load_model('/Users/anishkhanna/Documents/Python Files/stock predictor model 5 outputs.h5')
        with urllib.request.urlopen("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+code+"&outputsize=full&apikey=O91SB0IK1PJN0TXU") as url:
            data = json.loads(url.read().decode())  #Decodes the json data format taken from the API and stores it in the form of a dict

        stock_data_dataframe = pd.DataFrame.from_dict(data["Time Series (Daily)"], orient = 'index')

        from sklearn.preprocessing import MinMaxScaler
        scalar = MinMaxScaler(feature_range = (0, 1))
        stock_data_dataframe = scalar.fit_transform(stock_data_dataframe)
        inputs = []
        for i in range(stock_data_dataframe.shape[0]-180, stock_data_dataframe.shape[0]):   #must be at least 60 points in to use the previous 60
            inputs.append(stock_data_dataframe[i-90:i, 0:5])
        inputs = np.array(inputs)
        
        predicted_stock_price = model.predict(inputs)
        predicted_stock_price = scalar.inverse_transform(predicted_stock_price)
        
        predicted_stock_price_high = predicted_stock_price[:,1:2].flatten()
        predicted_stock_price_low = predicted_stock_price[:,2:3].flatten()
        
        from keras import backend as K
        K.clear_session()
        
        def business_dates(start, end):
            us_cal = USTradingCalendar()
            kw = dict(start=start, end=end)
            return pd.DatetimeIndex(freq='B', **kw).drop(us_cal.holidays(**kw))
        
        dates = business_dates(start=datetime.date.today(), end=datetime.date.today()+datetime.timedelta(days=300))
        
        print(dates)
        
        return JsonResponse({"low": predicted_stock_price_low.tolist(), "high": predicted_stock_price_high.tolist(), "dates": dates.tolist()[:180]})
    else:
        return JsonResponse(
                json.dumps({"nothing to see", "this not happening"}), content_type="application/json")
        
def commentAdder(request):
    if request.method == "POST":
        print(request.POST.get("name"))
        linkedPost = Post.objects.get(id=request.POST.get("post"))
        Comment.objects.create(name=request.POST.get("name"), comment_text=request.POST.get("comment"), post=linkedPost)
        return JsonResponse({"success": "successful comment add"})
    else:
        return JsonResponse({"error": "Unsuccessful comment add"})
    
def handle_page_not_found(request, exception):
    template_name='website/404.html'
    return HttpResponse(content=template_name.render(), content_type='text/html; charset=utf-8', status=404)
    
def my_custom_error_view(request, exception):
    template_name='website/500.html'
    return HttpResponse(content=template_name.render(), content_type='text/html; charset=utf-8', status=500)