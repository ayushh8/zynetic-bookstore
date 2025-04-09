import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.middleware';
import { Book } from '../models/book.model';

const router = express.Router();


router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('publishedDate').isISO8601().withMessage('Invalid date format')
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Error creating book' });
    }
});


router.get('/', auth, [
    query('author').optional().isString(),
    query('category').optional().isString(),
    query('rating').optional().isFloat({ min: 0, max: 5 }),
    query('title').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sortBy').optional().isIn(['price', 'rating']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { author, category, rating, title, page = 1, limit = 10, sortBy, sortOrder = 'asc' } = req.query;

        const query: any = {};
        if (author) query.author = author;
        if (category) query.category = category;
        if (rating) query.rating = rating;
        if (title) query.title = { $regex: title, $options: 'i' };

        const sort: any = {};
        if (sortBy) {
            sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
        }

        const books = await Book.find(query)
            .sort(sort)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Book.countDocuments(query);

        res.json({
            books,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching books' });
    }
});


router.get('/:id', auth, async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching book' });
    }
});


router.put('/:id', auth, [
    body('title').optional().notEmpty(),
    body('author').optional().notEmpty(),
    body('category').optional().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('publishedDate').optional().isISO8601()
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Error updating book' });
    }
});


router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting book' });
    }
});

export const bookRoutes = router; 