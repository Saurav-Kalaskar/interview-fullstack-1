import express from "express";
import { Pool } from "pg";

const app = express();
const PORT = 3000;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "test_db",
    password: "password",
    port: 5432,
});

// TODO: Implement a rate limiter using the Token Bucket algorithm
// Placeholder variables:
// - MAX_TOKENS: Maximum number of tokens the bucket can hold
// - REFILL_RATE: Rate at which tokens refill per second
// - Implement a function to refill tokens over time
// - Implement middleware to enforce rate limiting

// Simulated database for pagination
const items = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

// TODO: Implement an API that scales well under high load (pagination, async processing)
app.get("/items", async (req, res) => {
    // Fetch paginated items efficiently.
    // Consider:
    // - Implementing async database queries.
    // - Handling large datasets with pagination.
});

// Nested SQL queries (TODO: Improve this)
app.get("/fetch-data", async (req, res) => {
    const client = await pool.connect();
    try {
        const query1 = "SELECT * FROM users WHERE id = $1";
        const query2 = "SELECT * FROM orders WHERE user_id = $1";
        const query3 = "SELECT * FROM payments WHERE order_id = $1";

        client.query(query1, [req.query.id1], (e1, r1) => {
            if (!e1) {
                client.query(query2, [req.query.id1], (e2, r2) => {
                    if (!e2) {
                        client.query(query3, [req.query.id2], (e3, r3) => {
                            if (!e3) {
                                res.send({ user: r1.rows, orders: r2.rows, payments: r3.rows });
                            } else {
                                res.status(500).send("Error fetching payments");
                            }
                        });
                    } else {
                        res.status(500).send("Error fetching orders");
                    }
                });
            } else {
                res.status(500).send("Error fetching user");
            }
        });
    } finally {
        client.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});