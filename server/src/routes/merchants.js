import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get merchant dashboard
router.get('/dashboard', verifyToken, requireRole(['merchant']), async (req, res) => {
  try {
    const { data: merchant } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('merchant_id', merchant.id);

    const stats = {
      totalSales: orders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length,
      newOrders: orders.filter(o => o.status === 'new').length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
      completedOrders: orders.filter(o => o.status === 'completed').length
    };

    res.json({ merchant, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get merchant products
router.get('/products', verifyToken, requireRole(['merchant']), async (req, res) => {
  try {
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('merchant_id', merchant.id);

    if (error) throw error;
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get merchant orders
router.get('/orders', verifyToken, requireRole(['merchant']), async (req, res) => {
  try {
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        customer:users(full_name, phone, province, address)
      `)
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update merchant profile
router.put('/profile', verifyToken, requireRole(['merchant']), async (req, res) => {
  try {
    const { companyName, phone, whatsapp, dollarRate } = req.body;

    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const { error } = await supabase
      .from('merchants')
      .update({
        company_name: companyName,
        phone,
        whatsapp,
        dollar_rate: dollarRate
      })
      .eq('id', merchant.id);

    if (error) throw error;
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
