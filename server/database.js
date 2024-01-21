// CLOUD SQL CONNECTION

import mysql from 'mysql2'
import {Connector} from '@google-cloud/cloud-sql-connector';
import dotenv from 'dotenv'
dotenv.config()

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.GOOGLE_INSTANCE_CONNECTION_NAME,
  ipType: 'PUBLIC',
});
 
const pool = await mysql.createPool({
    ...clientOpts,
    user: process.env.GOOGLE_USERNAME,
    password: process.env.GOOGLE_DATABASE_PASSWORD,
    database: process.env.GOOGLE_DATABASE_NAME,
  }).promise()



export async function getAllProducts(){
    const [rows] = await pool.query("SELECT * FROM products") || null
    return rows
}

export async function getProduct(id){
    const [rows] = await pool.query(
        `SELECT * FROM products WHERE id = ?`,[id]
    )
    return rows[0]
}

export async function addProduct(name, description, category, price, stock_quantity) {
    const [result] = await pool.query(`
    INSERT INTO products (name, description, category, price, stock_quantity)
    VALUES (?, ?, ?, ?, ?)
    `, [name, description, category, price, stock_quantity])
    const id = result.insertId;
    return await getProduct(id);
}

export async function deleteProduct(id){
    const [result] = await pool.query(
        `DELETE FROM products WHERE id = ?`
    , [id]);
    return result
}


export async function updateProduct(col_name, new_val, id){

    const allowedColumns = ['description', 'name', 'price', 'stock_quantity', 'category']; 

    if (!allowedColumns.includes(col_name)) {
        throw new Error('Invalid column name');
    }

    const [result] = await pool.query(
        `UPDATE products SET ${col_name} = ?  WHERE id = ?`
    , [new_val, id]);
    return result
}

// const products = await getAllProducts()
// console.log(products);
// const product = await getProduct(1)
// const new_product = await addProduct('test', 'test', 'test', 10, 2)
// console.log(new_product);
// const updated = await updateProduct('description', "elo", 4)
// console.log(updated);