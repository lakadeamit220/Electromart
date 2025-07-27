import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products with pagination, search, filtering, and sorting
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('search').optional().isString().trim(),
    query('category').optional().isString().trim(),
    query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc']).withMessage('Invalid sort option'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { page = 1, limit = 10, search = '', category = '', sort = '' } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    try {
      const sortOptions = {};
      if (sort === 'price_asc') sortOptions.price = 1;
      if (sort === 'price_desc') sortOptions.price = -1;
      if (sort === 'name_asc') sortOptions.name = 1;
      if (sort === 'name_desc') sortOptions.name = -1;

      const products = await Product.find(query)
        .populate('reviews')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await Product.countDocuments(query);
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page * 1,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('image').notEmpty().withMessage('Image URL is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  authMiddleware,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('image').optional().notEmpty().withMessage('Image URL cannot be empty'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Review.deleteMany({ productId: req.params.id });
    res.json({ message: 'Product and associated reviews deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post(
  '/:id/reviews',
  authMiddleware,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const review = new Review({
        productId: req.params.id,
        userId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment,
      });
      await review.save();

      product.reviews.push(review._id);
      await product.save();

      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;