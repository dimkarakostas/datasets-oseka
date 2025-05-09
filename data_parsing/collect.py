import requests
import csv
import json
from io import StringIO
from collections import defaultdict


def fetch_latest_ucits_csv(policy_code, policy):
    try:
        with open(f'{policy.lower()}.csv') as f:
            pass
    except FileNotFoundError:
        output = []
        for data_type in [1, 0]:  # 1: stock, 0: net flows
            key = f'M.GR.N.{policy_code}.L30.A.{data_type}.Z5.0000.Z01.E'
            url = f'https://data-api.ecb.europa.eu/service/data/IVF/{key}?format=csvdata'

            resp = requests.get(url)
            resp.raise_for_status()

            f = StringIO(resp.text)
            reader = csv.reader(f)
            if data_type == 0:
                next(reader)
            for row in reader:
                output.append(row)

        with open(f'{policy.lower()}.csv', 'w') as f:
            writer = csv.writer(f)
            writer.writerows(output)

    with open(f'{policy.lower()}.csv') as f:
        reader = csv.DictReader(f, delimiter=',')
        rows = list(reader)

    time_series = []
    for line in rows:
        time_series.append([line['TIME_PERIOD'], float(line['OBS_VALUE'])*10**6, line['DATA_TYPE']])
    return time_series


all_dates = set()
history = {
    'stock': defaultdict(list),
    'net_flow': defaultdict(list),
}
for policy_name, policy_key in [
    ('Equity', '1C'),
    ('Bond', '2C'),
    ('Mixed', '3C'),
    ('Real estate', '4C'),
    ('Hedge', '5C'),
    ('Other', '6C'),
]:
    time_series = fetch_latest_ucits_csv(policy_key, policy_name)
    for date, value, data_type in time_series:
        all_dates.add(date)
        if data_type == '0':
            history_type = 'net_flow'
        elif data_type == '1':
            history_type = 'stock'
        history[history_type][date].append((policy_name, value))

for history_type, date_assets in history.items():
    for date, assets in date_assets.items():
        history[history_type][date].append(('Total', sum([i[1] for i in assets])))

for date in sorted(all_dates):
    print(f'{date}')
    for history_type in history.keys():
        print(f'  ({history_type})')
        assets = history[history_type][date]
        for (policy, value) in assets:
            print(f'    {policy}\t {value:,.2f} EUR')

history['profit'] = {}
for year in range(2020, 2025):
    print()
    start_date = f'{year-1}-12'
    end_date = f'{year}-12'

    start_year_stock = sum([i[1] for i in history['stock'][start_date]])
    end_year_stock = sum([i[1] for i in history['stock'][end_date]])
    annual_stock_difference = end_year_stock - start_year_stock
    print(f'{year} stock difference: {annual_stock_difference:,} EUR')

    annual_net_flow = 0
    for month in range(1, 13):
        monthly_flow = sum([i[1] for i in history['net_flow'][f'{year}-{month:02}']])
        annual_net_flow += monthly_flow

    print(f'{year} net flow: {annual_net_flow:,} EUR')

    history['profit'][year] = annual_stock_difference - annual_net_flow
    print(f'{year} profit: {annual_stock_difference - annual_net_flow:,} EUR')

    print(f'{year} tax at 26%: {(annual_stock_difference - annual_net_flow)*0.26:,} EUR')


with open('data.json', 'w') as f:
    json.dump(history, f, indent=4)
