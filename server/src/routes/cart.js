import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get cart items
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id, name, code, price, currency, stock_quantity,
          images:product_images(image_url, is_primary)
        )
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ items: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert([{
          id: uuidv4(),
          user_id: req.user.id,
          product_id: productId,
          quantity
        }]);
      if (error) throw error;
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item
router.patch('/:itemId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.itemId)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/:itemId', verifyToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.itemId)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/', verifyToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
