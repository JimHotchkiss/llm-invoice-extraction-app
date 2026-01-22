import pandas as pd
import sqlite3
from contextlib import contextmanager

def sheet_names_extraction():
    file_path = "./data/case_study_data.xlsx"

    # Create ExcelFile Object to handle workbook without loading data
    xls = pd.ExcelFile(file_path)

    sheet_names_list = xls.sheet_names
    return sheet_names_list


sales_order_db = 'sales_order.db'

@contextmanager
def get_db_connection(db_name):
    """ Context manager for database connections - automatically closes the connection """
    conn = sqlite3.connect(db_name)
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"❌ Database error: {e}")
        raise
    finally:
        conn.close()

def init_sales_order_database(sales_order_db):
    """ Create the database and the corresponding sales_order tables """
    
    with get_db_connection(sales_order_db) as conn:
        sheet_names = sheet_names_extraction()
        for table_name in sheet_names:
            df = pd.read_excel("./data/case_study_data.xlsx", sheet_name=table_name)
            # 3. Write the DataFrame to a table named 'users'
            print(f"sheet name: {table_name}")
            df.to_sql(f"{table_name}", conn, if_exists='replace', index=False)
        
            print(f" ✅ Database initialized at {sales_order_db}")

def init_invoice_data_table(sales_order_db):
    """ Create the database and invoice tables """
    
    with get_db_connection(sales_order_db) as conn:
        cursor = conn.cursor()
        
        # Invoice header table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS invoice_details (
                invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number TEXT UNIQUE NOT NULL,
                order_date TEXT,
                customer_id TEXT,
                customer_name TEXT,
                customer_address TEXT,
                ship_to_address TEXT,
                sales_person TEXT,
                po_number TEXT,
                ship_date TEXT,
                ship_method TEXT,
                terms TEXT,
                sub_total REAL,
                sales_tax REAL,
                freight REAL DEFAULT 0.0,
                invoice_total REAL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Invoice line items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS invoice_line_items (
                line_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                item_number INTEGER,
                product_id TEXT,
                product_description TEXT,
                quantity INTEGER,
                unit_price REAL,
                total_unit_price REAL,
                discount_percent REAL DEFAULT 0.0,
                line_total REAL,
                FOREIGN KEY (invoice_id) REFERENCES invoice_details(invoice_id)
                    ON DELETE CASCADE
            )
        ''')
        
        conn.commit()
        print(f" ✅ Invoice tables initialized at {sales_order_db}")


def delete_table_content(table_name,sales_order_db):
    """ Delete all records from the table """
    with get_db_connection(sales_order_db) as conn:
        conn.row_factory = sqlite3.Row  # ✅ This makes rows behave like dicts
        cursor = conn.cursor()
        cursor.execute(f'DELETE  FROM {table_name}') 
        purchase_orders = cursor.fetchall()
        print(f" 📨 Retrieved {len(purchase_orders)} purchase orders from the database.")
        return {f"message: {table_name} has been deleted"}


if __name__ == "__main__":
    # init_sales_order_database(sales_order_db)
    table_name = "SalesOrderDetail"
    # delete_table_content(table_name, sales_order_db)
    init_invoice_data_table(sales_order_db)





