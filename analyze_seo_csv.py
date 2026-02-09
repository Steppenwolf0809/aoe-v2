import csv
import sys
from datetime import datetime

file_path = r"D:\aoe-v2\docs\research\abogadosonlineecuador.com-Performance-on-Search-2026-02-08 - Gráfico ultimos 12 meses.csv"

def parse_float(val):
    try:
        return float(val.replace('%', '').replace(',', '.'))
    except ValueError:
        return 0.0

def parse_int(val):
    try:
        return int(val)
    except ValueError:
        return 0

data = []
try:
    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
except Exception as e:
    print(f"Error reading file: {e}")
    sys.exit(1)

total_clicks = 0
total_impressions = 0
weighted_position_sum = 0
valid_position_impressions = 0

daily_stats = []
monthly_stats = {}

for row in data:
    date_str = row['Fecha']
    clicks = parse_int(row['Clics'])
    impressions = parse_int(row['Impresiones'])
    ctr_str = row['CTR']
    position_str = row['Posición']
    
    # Position might be empty
    position = 0.0
    if position_str:
        position = float(position_str)

    total_clicks += clicks
    total_impressions += impressions
    
    if impressions > 0 and position > 0:
        weighted_position_sum += (position * impressions)
        valid_position_impressions += impressions

    daily_stats.append({
        'date': date_str,
        'clicks': clicks,
        'impressions': impressions,
        'ctr': clicks / impressions if impressions > 0 else 0,
        'position': position
    })

    # Monthly aggregation
    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        month_key = dt.strftime('%Y-%m')
        if month_key not in monthly_stats:
            monthly_stats[month_key] = {'clicks': 0, 'impressions': 0}
        
        monthly_stats[month_key]['clicks'] += clicks
        monthly_stats[month_key]['impressions'] += impressions
    except ValueError:
        continue

# Global Metrics
avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
avg_position = (weighted_position_sum / valid_position_impressions) if valid_position_impressions > 0 else 0

# Find max days
max_clicks_day = max(daily_stats, key=lambda x: x['clicks']) if daily_stats else None
max_impressions_day = max(daily_stats, key=lambda x: x['impressions']) if daily_stats else None

print("--- ANALYSIS RESULT ---")
print(f"Total Clicks: {total_clicks}")
print(f"Total Impressions: {total_impressions}")
print(f"Average CTR: {avg_ctr:.2f}%")
print(f"Average Position: {avg_position:.2f}")

if max_clicks_day:
    print(f"Peak Clicks: {max_clicks_day['clicks']} on {max_clicks_day['date']}")
if max_impressions_day:
    print(f"Peak Impressions: {max_impressions_day['impressions']} on {max_impressions_day['date']}")

print("\n--- MONTHLY BREAKDOWN ---")
print("Month,Clicks,Impressions,CTR")
sorted_months = sorted(monthly_stats.keys())
for m in sorted_months:
    c = monthly_stats[m]['clicks']
    i = monthly_stats[m]['impressions']
    ctr = (c/i*100) if i > 0 else 0
    print(f"{m},{c},{i},{ctr:.2f}%")
