import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Subscriptions Table
    db.run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        planTitle TEXT NOT NULL,
        duration TEXT NOT NULL,
        price TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        console.log('Subscriptions table ready.');
        // Ensure status column exists for old databases
        db.run(`ALTER TABLE subscriptions ADD COLUMN status TEXT DEFAULT 'pending'`, (alterErr) => {
          // ignore error if column already exists
        });
      }
    });
  }
});

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
  const { name, email, planTitle, price, currency } = req.body;
  
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let englishStr = priceStr.toString().replace(/[٠-٩]/g, d => arabicNumbers.indexOf(d));
    englishStr = englishStr.replace(/[^0-9]/g, '');
    return parseInt(englishStr) || 0;
  };

  try {
    // If no valid key is set, mock the response so the frontend flow can still be tested
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_key_here') {
      console.log('No valid Stripe key found. Mocking checkout session for testing.');
      return res.json({ id: 'mock_session_123', url: 'http://localhost:5173/payment?success=true' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: (currency || 'egp').toLowerCase(),
            product_data: {
              name: planTitle || 'Gym Membership',
            },
            unit_amount: parsePrice(price) * 100, // Stripe expects amounts in smallest unit (piasters/cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/payment?success=true',
      cancel_url: 'http://localhost:5173/payment?canceled=true',
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});
app.post('/api/subscribe', (req, res) => {
  const { name, email, phone, planTitle, duration, price, paymentMethod } = req.body;
  
  if (!name || !email || !planTitle || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const date = new Date().toISOString();
  const status = paymentMethod === 'card' ? 'active' : 'pending';
  
  const sql = `
    INSERT INTO subscriptions (name, email, phone, planTitle, duration, price, paymentMethod, date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [name, email, phone, planTitle, duration, price, paymentMethod, date, status];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error inserting subscription:', err.message);
      return res.status(500).json({ error: 'Failed to save subscription' });
    }
    
    res.status(201).json({
      message: 'Subscription successful',
      subscriptionId: this.lastID
    });
  });
});

app.get('/api/subscriptions', (req, res) => {
  db.all('SELECT * FROM subscriptions ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve subscriptions' });
    }
    res.json(rows);
  });
});

app.put('/api/subscriptions/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Missing status field' });
  }

  db.run('UPDATE subscriptions SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      console.error('Error updating status:', err.message);
      return res.status(500).json({ error: 'Failed to update status' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json({ message: 'Status updated successfully' });
  });
});

app.get('/api/user-profile/:email', (req, res) => {
  const { email } = req.params;
  db.all('SELECT * FROM subscriptions WHERE email = ? ORDER BY date DESC', [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
    
    // We can assume the first row (most recent) is their active plan if it exists
    res.json({
      history: rows
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
