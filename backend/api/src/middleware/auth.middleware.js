import { supabaseAdmin } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
    try {
        // 1. Get the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided. Please log in.' });
        }

        // 2. Extract the token (everything after "Bearer ")
        const token = authHeader.split(' ')[1];

        // 3. Ask Supabase to verify the token
        const {
            data: { user },
            error,
        } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res
                .status(401)
                .json({ error: 'Invalid or expired token. Please log in again.' });
        }

        // 4. Get the user's profile from our profiles table
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return res.status(401).json({ error: 'User profile not found.' });
        }

        // 5. Attach user info to the request (available in controllers)
        req.user = {
            id: user.id,
            email: user.email,
            ...profile,
        };

        // 6. Continue to the next middleware/controller
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Authentication error.' });
    }
};

// /**
//  * OPTIONAL: Tries to identify the user, but lets guests through.
//  * req.user will be null if not logged in.
//  * Use this for the /book-guest route.
//  */
// export const optionalAuth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         // If no token, they are a guest. Move to controller.
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             req.user = null;
//             return next();
//         }

//         const token = authHeader.split(' ')[1];
//         const {
//             data: { user },
//             error,
//         } = await supabaseAdmin.auth.getUser(token);

//         // If token is bad, we still treat them as a guest rather than blocking them
//         if (error || !user) {
//             req.user = null;
//             return next();
//         }

//         const { data: profile } = await supabaseAdmin
//             .from('profiles')
//             .select('*')
//             .eq('id', user.id)
//             .single();

//         // Attach profile if found, otherwise stay as guest
//         req.user = profile ? { id: user.id, email: user.email, ...profile } : null;

//         next();
//     } catch (err) {
//         // Errors in optional auth shouldn't crash the request for a guest
//         req.user = null;
//         next();
//     }
// };
