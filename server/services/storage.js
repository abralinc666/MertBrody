// LovelyCam V4.0 - S3 / Cloudflare R2 / MinIO Object Storage Service
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const s3 = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || 'https://s3.amazonaws.com',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
    }
});

async function uploadMediaBuffer(buffer, mimeType, folder = 'chat-media') {
    const ext = mimeType.split('/')[1] || 'jpg';
    const key = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || 'lovelycam-media',
        Key: key,
        Body: buffer,
        ContentType: mimeType
    }));
    return `${process.env.CDN_BASE_URL || '/uploads'}/${key}`;
}

module.exports = { uploadMediaBuffer };
