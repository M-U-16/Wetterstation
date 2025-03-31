import csv
import os
import random
import sqlite3
from sys import flags
import sys
from models.model import create_tables, generateSql

def load_csv_into_db(db_path, csv_file):
    create_tables(db_path, sql_file="wetter.sql")
    csv_file = open(csv_file, "r")
    csv_dict_reader = csv.DictReader(csv_file)
    
    db = sqlite3.connect(db_path)
    cursor = db.cursor()
    
    sql = generateSql("INSERT INTO wetterdaten({}) VALUES ({})",csv_dict_reader.fieldnames)
    print(sql)
    for row in csv_dict_reader:
        cursor.execute(sql, tuple(row.values()))
    db.commit()
    db.close()

def combine_csv(file1, file2):
    csv_one = open(file1, "r")
    csv_two = open(file2, "r")
    csv_reader1 = csv.reader(csv_one, delimiter=',')
    csv_reader2 = csv.reader(csv_two, delimiter=',')

    with open("samples/1year-combined.csv", "w") as csvfile_comp:
        head1 = next(csv_reader1)
        head2 = next(csv_reader2)
        
        fields = []
        for field in head1:
            if not field in fields:
                fields.append(field)
        for field in head2:
            if not field in fields:
                fields.append(field)
        fields.append("pm_10")

        comb_writer = csv.writer(csvfile_comp, lineterminator="\n")
        comb_writer.writerow(fields)
        
        for row in csv_reader1:
            row2 = next(csv_reader2)
            for value in row2[1:len(row2)]: row.append(value)
            row.append(round(random.random()*4,2))
            comb_writer.writerow(row)
                    
    csv_one.close()
    csv_two.close()
    
if __name__ == "__main__":
    combine_csv(sys.argv[1], sys.argv[2])