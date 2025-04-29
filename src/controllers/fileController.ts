import { Request, Response } from 'express';
import mongoose from 'mongoose';
import File from '../models/File';
import User from '../models/User';
import Product from '../models/Producto';
import { uploadFileToS3, uploadUserProfilePicture, uploadProductImage, deleteFileFromS3, getSignedUrlFromS3 } from '../services/s3Service';
import { IGetUserAuthInfoRequest } from '../types/request';

export const uploadProfilePicture = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
  
      const user = await User.findById(req.user!.id);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (user.profilePictureUrl) {
        const key = user.profilePictureUrl.split('.com/')[1]; // Extraer key
        if (key) {
          await deleteFileFromS3(key);
        }
      }
  
      const url = await uploadUserProfilePicture(file, req.user!.id);
  
      user.profilePictureUrl = url;
      await user.save();
  
      res.status(201).json({ message: 'Profile picture updated successfully', url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload profile picture' });
    }
  };
  
  export const uploadProductPicture = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { productId } = req.params;
  
      if (!file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
  
      const product = await Product.findById(productId);
  
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
  
      if (product.imageUrl) {
        const key = product.imageUrl.split('.com/')[1];
        if (key) {
          await deleteFileFromS3(key);
        }
      }
  
      const url = await uploadProductImage(file, productId);
  
      product.imageUrl = url;
      await product.save();
  
      res.status(201).json({ message: 'Product image updated successfully', url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload product picture' });
    }
  };
  
  export const deleteFile = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.body;
  
      if (!key) {
        res.status(400).json({ message: 'File key is required' });
        return;
      }

      await deleteFileFromS3(key);
  
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  
      const user = await User.findOne({ profilePictureUrl: fileUrl });
      if (user) {
        user.profilePictureUrl = "";
        await user.save();
      }
  
      const product = await Product.findOne({ imageUrl: fileUrl });
      if (product) {
        product.imageUrl = "";
        await product.save();
      }
  
      res.status(200).json({ message: 'File deleted successfully, and references cleaned if existed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete file', error });
    }
  };