import * as profileService from '../services/profile.service.js';

export const getProfiles = async (req, res, next) => {
    try {
        const profiles = await profileService.getPatientProfiles(req.user.id);
        res.json({ profiles });
    } catch (err) {
        next(err);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getPatientProfileById(req.params.id, req.user.id);
        res.json({ profile });
    } catch (err) {
        next(err);
    }
};

export const createProfile = async (req, res, next) => {
    try {
        const profile = await profileService.createPatientProfile(req.user.id, req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Patient profile created successfully.', 
            profile 
        });
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const profile = await profileService.updatePatientProfile(req.params.id, req.user.id, req.body);
        res.json({ 
            success: true, 
            message: 'Patient profile updated successfully.', 
            profile 
        });
    } catch (err) {
        next(err);
    }
};

export const deleteProfile = async (req, res, next) => {
    try {
        await profileService.deletePatientProfile(req.params.id, req.user.id);
        res.json({ success: true, message: 'Patient profile deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
