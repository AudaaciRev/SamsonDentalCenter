import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/services
 *
 * List all active dental services.
 * Public endpoint — no login required.
 */
export const getAllServices = async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('services')
            .select('id, name, description, duration_minutes, price')
            .eq('is_active', true) // Only show active services
            .order('name'); // Alphabetical order

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ services: data });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/services/:id
 *
 * Get a single service by ID.
 * Public endpoint.
 */
export const getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Service not found.' });
        }

        res.json({ service: data });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/services
 *
 * Create a new service (Admin only).
 * Body: { name, description, duration_minutes, price }
 */
export const createService = async (req, res, next) => {
    try {
        const { name, description, duration_minutes, price } = req.body;

        if (!name || !duration_minutes) {
            return res.status(400).json({
                error: 'Name and duration_minutes are required.',
            });
        }

        const { data, error } = await supabaseAdmin
            .from('services')
            .insert({ name, description, duration_minutes, price })
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: 'Service created!', service: data });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/services/:id
 *
 * Update a service (Admin only).
 * Body: { name?, description?, duration_minutes?, price?, is_active? }
 */
export const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabaseAdmin
            .from('services')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Service updated!', service: data });
    } catch (err) {
        next(err);
    }
};
