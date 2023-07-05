import csv
import json
from geojson import Feature, FeatureCollection, Point

features = []
with open('points.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    check = 0
    collection = {"type": "FeatureCollection", "features": []}
    for row in reader:
        if check == 0:
            check += 1
            for i in range(len(row)):
                print(f'{i} - {row[i]}')
            continue
        # print(row[2])
        collection['features'].append({
            "type": "Feature",
            "properties": {
                "id_entrance": row[0],
                "meetcode": row[1],
                "name_ru": row[2],
                "name_en": row[3],
                "id_station": row[4],
                "direction": row[5],
                "max_width": row[8],
                "min_step": row[9],
                "min_step_ramp": row[10],
                "lift": row[11],
                "lift_minus_step": row[12],
                "min_rail_width": row[13],
                "max_rail_width": row[14],
                "max_angle": row[15],
                "escalator": row[16],
                "time": row[17]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    row[7],
                    row[6]
                ]
            }
        })

    with open('ruPoints.geojson', 'w', encoding='utf-8') as of:
        of.write(str(collection))
