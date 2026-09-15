import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Create order
router.post('/', verifyToken, requireRole(['customer']), async (req, res) => {
  try {
    const {
      items,
      deliverySpeed,
      deliveryTimeSlot,
      customerName,
      customerPhone,
      customerWhatsapp,
      province,
      address,
      discountCode,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    let merchantId = null;

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (!merchantId) merchantId = product.merchant_id;

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_code: product.code,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Apply discount
    let discountAmount = 0;
    if (discountCode) {
      const { data: discount } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode)
        .eq('is_active', true)
        .single();

      if (discount && (!discount.expires_at || new Date(discount.expires_at) > new Date())) {
        discountAmount = discount.discount_amount || (subtotal * discount.discount_percentage / 100);
      }
    }

    // Get delivery cost
    let deliveryCost = 0;
    const { data: rates } = await supabase
      .from('delivery_rates')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('speed', deliverySpeed)
      .single();

    if (rates) {
      // TODO: check if same province or different
      deliveryCost = rates.same_province;
    }

    const total = Math.max(0, subtotal - discountAmount + deliveryCost);

    // Create order
    const orderNumber = generateOrderNumber();
    const orderId = uuidv4();

    const { error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          order_number: orderNumber,
          user_id: req.user.id,
          merchant_id: merchantId,
          status: 'new',
          payment_status: 'pending',
          subtotal,
          discount_amount: discountAmount,
          delivery_cost: deliveryCost,
          total,
          delivery_speed: deliverySpeed,
          delivery_time_slot: deliveryTimeSlot,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_whatsapp: customerWhatsapp,
          province,
          address,
          discount_code: discountCode,
          notes
        }
      ]);

    if (orderError) throw orderError;

    // Add order items
    const itemInserts = orderItems.map(item => ({
      id: uuidv4(),
      order_id: orderId,
      ...item
    }));

    const { error: itemError } = await supabase
      .from('order_items')
      .insert(itemInserts);

    if (itemError) throw itemError;

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    // Create notification
    await supabase
      .from('notifications')
      .insert([
        {
          id: uuidv4(),
          user_id: req.user.id,
          type: 'order_created',
          title: 'تم إنشاء طلبك',
          message: `تم إنشاء طلبك رقم ${orderNumber} بنجاح`,
          related_order_id: orderId
        }
      ]);

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      orderNumber,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer orders
router.get('/customer/my-orders', verifyToken, requireRole(['customer']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id);

    if (status) query = query.eq('status', status);

    query = query.order('created_at', { ascending: false });

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (pageNum - 1) * limitNum;

    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({ orders: data, total: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        merchant:merchants(company_name, phone),
        customer:users(full_name, email, phone)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Check authorization
    if (req.user.role === 'customer' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Update order status (admin/merchant)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const { data: order } = await supabase
      .from('orders')
      .select('merchant_id')
      .eq('id', req.params.id)
      .single();

    if (req.user.role === 'merchant') {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', req.user.id)
        .single();

      if (order.merchant_id !== merchant.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
