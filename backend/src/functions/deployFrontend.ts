import { S3, CloudFront } from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

/**
 * Lambda function to deploy frontend assets to S3 and invalidate CloudFront cache
 */
export const handler = async (): Promise<any> => {
  try {
    console.log('Starting frontend deployment process');
    
    // Initialize AWS clients
    const s3 = new S3();
    const cloudfront = new CloudFront();
    
    // Get environment variables
    const bucketName = process.env.WEB_APP_BUCKET;
    const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
    
    if (!bucketName || !distributionId) {
      throw new Error('Required environment variables are missing');
    }
    
    console.log(`Deploying frontend to bucket: ${bucketName}`);
    
    // Path to the frontend build directory
    const buildPath = path.resolve(__dirname, '../../../frontend/dist');
    
    // Check if the build directory exists
    if (!fs.existsSync(buildPath)) {
      throw new Error(`Build directory not found: ${buildPath}`);
    }
    
    // Get a list of all files in the build directory recursively
    const getFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
      const files = fs.readdirSync(dirPath);
      
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          arrayOfFiles = getFiles(filePath, arrayOfFiles);
        } else {
          arrayOfFiles.push(filePath);
        }
      });
      
      return arrayOfFiles;
    };
    
    const allFiles = getFiles(buildPath);
    console.log(`Found ${allFiles.length} files to upload`);
    
    // Upload files to S3
    const uploadPromises = allFiles.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath);
      const relativeFilePath = filePath.replace(buildPath, '').replace(/\\/g, '/').replace(/^\//, '');
      
      // Determine content type
      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      
      const params = {
        Bucket: bucketName,
        Key: relativeFilePath,
        Body: fileContent,
        ContentType: contentType,
        CacheControl: getCacheControl(relativeFilePath),
      };
      
      console.log(`Uploading: ${relativeFilePath}`);
      return s3.putObject(params).promise();
    });
    
    await Promise.all(uploadPromises);
    console.log('All files uploaded successfully');
    
    // Invalidate CloudFront cache
    const invalidationParams = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: ['/*'],
        },
      },
    };
    
    console.log('Invalidating CloudFront cache');
    await cloudfront.createInvalidation(invalidationParams).promise();
    console.log('CloudFront cache invalidated');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Frontend deployed successfully',
        bucket: bucketName,
        distributionId,
      }),
    };
  } catch (error) {
    console.error('Error deploying frontend:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error deploying frontend',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

/**
 * Determine appropriate cache control settings based on file path
 */
function getCacheControl(filePath: string): string {
  // Cache HTML files for a shorter period
  if (filePath.endsWith('.html')) {
    return 'public, max-age=0, must-revalidate';
  }
  
  // Cache static assets (JS, CSS, images) for longer periods
  if (/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/.test(filePath)) {
    // One year cache for assets with content hash in filename
    if (/\.[a-z0-9]{8,}\.(js|css|png|jpg|jpeg|gif|svg)$/.test(filePath)) {
      return 'public, max-age=31536000, immutable';
    }
    
    // One week cache for other static assets
    return 'public, max-age=604800';
  }
  
  // Default cache control for other file types
  return 'public, max-age=3600';
} 