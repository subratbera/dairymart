import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def predict_future_demand(product_price, real_data=None):
    if real_data is None:
        real_data = []
        
    # Base training data
    np.random.seed(42)
    days = list(np.random.randint(0, 7, 200))
    prices = list(np.random.uniform(2.0, 10.0, 200))
    holidays = list(np.random.choice([0, 1], p=[0.9, 0.1], size=200))
    demand = list((100 + 20 * (np.array(days) == 5) + 30 * (np.array(days) == 6) + 50 * np.array(holidays) - 5 * np.array(prices) + np.random.normal(0, 10, 200)).astype(int))

    # Inject real live data into training set
    for rd in real_data:
        # Boost real data significance in the model so it visibly influences the dashboard chart
        for _ in range(5):
            days.append(rd['day'])
            prices.append(rd['price'])
            holidays.append(0)
            demand.append(rd['qty'] * 20) 

    df_demand = pd.DataFrame({'day': days, 'price': prices, 'holiday': holidays, 'demand': demand})
    demand_model = LinearRegression()
    demand_model.fit(df_demand[['day', 'price', 'holiday']], df_demand['demand'])

    future_days = np.arange(7)
    future_prices = np.full(7, product_price)
    future_holidays = np.zeros(7)
    X_future = pd.DataFrame({'day': future_days, 'price': future_prices, 'holiday': future_holidays})
    predictions = demand_model.predict(X_future)
    
    day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    import datetime
    today_idx = datetime.datetime.today().weekday()
    
    result = []
    for i in range(7):
        d_idx = (today_idx + i) % 7
        pred = max(0, int(predictions[d_idx]))
        result.append({
            'day': day_names[d_idx],
            'predicted_demand': pred
        })
    return result

# Mock Products Data for Recommendations (Content-based filtering)
products_data = [
    {'id': 1, 'name': 'Fresh Whole Milk', 'category': 'Milk', 'desc': 'Organic whole milk fresh from the farm.'},
    {'id': 2, 'name': 'Artisan Cheddar Cheese', 'category': 'Cheese', 'desc': 'Aged sharp cheddar cheese block.'},
    {'id': 3, 'name': 'Organic Greek Yogurt', 'category': 'Yogurt', 'desc': 'Creamy and plain greek yogurt.'},
    {'id': 4, 'name': 'Salted Butter', 'category': 'Butter', 'desc': 'Rich creamy salted butter.'},
    {'id': 5, 'name': 'Skim Milk', 'category': 'Milk', 'desc': 'Fat-free skimmed milk.'},
    {'id': 6, 'name': 'Mozzarella Cheese', 'category': 'Cheese', 'desc': 'Fresh mozzarella perfect for pizzas.'}
]
df_products = pd.DataFrame(products_data)

# Combine category and description for content-based similarity
df_products['content'] = df_products['category'] + ' ' + df_products['desc']
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df_products['content'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

def get_product_recommendations(product_id=None, top_n=3):
    if product_id is None:
        # Just return random top 3 for generic
        return df_products.sample(n=top_n).to_dict('records')
    
    try:
        idx = df_products.index[df_products['id'] == product_id].tolist()[0]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        # Get top similar (excluding itself)
        sim_scores = sim_scores[1:top_n+1]
        product_indices = [i[0] for i in sim_scores]
        return df_products.iloc[product_indices].to_dict('records')
    except IndexError:
        return df_products.sample(n=top_n).to_dict('records')
