from flask import request, jsonify
from contextlib import contextmanager
import sqlite3

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

def save_invoice_to_db(invoice):
        
        """ 
            Save invoice to appropriate databases
            
            Returns:
                list: List of invoice dicts, each with a 'line_items' array 
        """


        with get_db_connection(sales_order_db) as conn:
            conn.row_factory = sqlite3.Row  # ✅ This makes rows behave like dicts
            cursor = conn.cursor()

            # ✅ Check if invoice already exists
            cursor.execute('''
                SELECT invoice_id FROM invoice_details 
                WHERE invoice_number = ?
            ''', (invoice['invoice_number'],))
            
            existing = cursor.fetchone()
            
            if existing:
                print(f"❌ Invoice {invoice['invoice_number']} already exists")
                # Invoice already exists
                return {
                    'success': False,
                    'error': f"Invoice {invoice['invoice_number']} already exists",
                    'invoice_id': existing['invoice_id']
                }

            line_items = invoice.pop('line_items')
            print(f"invoice after pop: {invoice}")

            # Insert invoice header (all columns at once)
            invoice_columns = ', '.join(invoice.keys())
            invoice_placeholders = ', '.join(['?' for _ in invoice])
            invoice_values = tuple(invoice.values())

            cursor.execute(f'''
            INSERT INTO invoice_details ({invoice_columns})
            VALUES ({invoice_placeholders})
            ''', invoice_values)

            invoice_id = cursor.lastrowid  # Get the auto-generated ID
            print(f"✅ Inserted invoice with ID: {invoice_id}")

             
            # Update the invoice_line_items table
            for item in line_items:
                item['invoice_id'] = invoice_id  # Add foreign key
                line_item_columns = ', '.join(item.keys())
                line_item_placeholders = ', '.join(['?' for _ in item])
                line_item_values = tuple(item.values())
                
                cursor.execute(f'''
                    INSERT INTO invoice_line_items ({line_item_columns})
                    VALUES ({line_item_placeholders})
                ''', line_item_values)

            conn.commit()  # Save changes!
            print(f"✅ Inserted {len(line_items)} line items")

            return invoice_id
        
def get_invoices(query_number = 50):
    """ 
        Retrieve invoices with their line items in a structured format
        
        Returns:
            list: List of invoice dicts, each with a 'line_items' array 
    """
    with get_db_connection(sales_order_db) as conn:
        conn.row_factory = sqlite3.Row  # ✅ This makes rows behave like dicts
        cursor = conn.cursor()

        # Query the invoice_details table
        cursor.execute(f'SELECT * FROM invoice_details LIMIT {query_number}') 
        invoices = [dict(row) for row in cursor.fetchall()]

        # For each invoice get its line item
        for invoice in invoices:
            cursor.execute(
                '''
                SELECT *
                FROM invoice_line_items
                WHERE invoice_id = ? 

                ''', (invoice['invoice_id'],))
            invoice['line_items'] = [dict(row) for row in cursor.fetchall()]
        


        print(f" 🧾 Retrieved {len(invoices)} invoices from the database.")
        return invoices
    
def edit_invoice(invoice_id, data):
    # print(f"Query data: {data}, id: {invoice_id}")
    """ 
        Edit invoice form data 
        
        Returns:
            Message whether update was successful 
    """
    with get_db_connection(sales_order_db) as conn:
        conn.row_factory = sqlite3.Row  # ✅ This makes rows behave like dicts
        cursor = conn.cursor()

        line_items = data.pop('line_items', [])
        
        # Remove primary key - invoice_id 
        data.pop("invoice_id", None)
        # Remove time_stamp
        data.pop("created_at", None)

        # Add invoice_id for WHERE clause
        values = tuple(data.values()) + (invoice_id,)

        # Extract the column names
        column_names = []
        for column_name in data.keys():
            column_str = f"{column_name} = ?"
            column_names.append(column_str)

        sql_columns = ", ".join(column_names)

        cursor.execute(f'UPDATE invoice_details SET {sql_columns} WHERE invoice_id = ?', values)

        # Delete old line items
        cursor.execute('DELETE FROM invoice_line_items WHERE invoice_id = ?', (invoice_id,))

           
        for item in line_items:
            # Remove auto-generated fields
            item.pop('line_item_id', None)
            
            # Add the invoice_id to link to parent
            item['invoice_id'] = invoice_id
            
            # Build column names
            columns = ', '.join(item.keys())
            
            # Build placeholders (?, ?, ?)
            placeholders = ', '.join(['?' for _ in item])
            
            # Get values
            values = tuple(item.values())
            
            # ✅ Execute INSERT for each line item
            cursor.execute(f'''
                INSERT INTO invoice_line_items ({columns})
                VALUES ({placeholders})
            ''', values)

        
        conn.commit()
        
        return {
                "message": "Invoice updated successfully"
        }
      


def delete_invoice(invoice_id):
    print(f"invoice_id: {invoice_id}")
    """ 
        Delete invoice form data 
        
        Returns:
            Message whether delete was successful 
    """
    with get_db_connection(sales_order_db) as conn:
        conn.row_factory = sqlite3.Row  # ✅ This makes rows behave like dicts
        cursor = conn.cursor()

        # Check if invoice exist
        cursor.execute("SELECT invoice_number FROM invoice_details WHERE invoice_id = ?", (invoice_id,))
        invoice = cursor.fetchone()

        if invoice is None: 
            return jsonify({
                'error': 'Invoice not found'
            }), 404
        
         # Delete line items first (foreign key constraint)
        cursor.execute("DELETE FROM invoice_line_items WHERE invoice_id = ?", (invoice_id,))
        line_items_deleted = cursor.rowcount  # ✅ Number of rows affected
        
        # Delete invoice header
        cursor.execute("DELETE FROM invoice_details WHERE invoice_id = ?", (invoice_id,))
        invoice_deleted = cursor.rowcount  # ✅ Should be 1 if successful

        conn.commit() 

         # Verify deletion
        if invoice_deleted == 0:
            return jsonify({'error': 'Delete failed'}), 500
        
        return jsonify({
            'success': True,
            'message': f'Invoice {invoice[0]} deleted successfully',
            'deleted': {
                'invoice': invoice_deleted,
                'line_items': line_items_deleted
            }
        }), 
      