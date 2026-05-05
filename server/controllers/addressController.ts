import { Request, Response } from "express";
import Address from "../models/Address.js";

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean();
        res.json({ success: true, data: addresses });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAddress = async (req: Request, res: Response) => {
    try {
        if (req.body.isDefault) {
            await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
        }

        const address = await Address.create({ ...req.body, user: req.user._id });
        res.status(201).json({ success: true, data: address });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
        if (!address) return res.status(404).json({ success: false, message: "Address not found" });

        if (req.body.isDefault) {
            await Address.updateMany({ user: req.user._id, _id: { $ne: req.params.id } }, { $set: { isDefault: false } });
        }

        Object.assign(address, req.body);
        await address.save();
        res.json({ success: true, data: address });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!address) return res.status(404).json({ success: false, message: "Address not found" });
        res.json({ success: true, message: "Address deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
