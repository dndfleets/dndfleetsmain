# Image Optimization Guide

This guide explains how to optimize car images for faster loading on the DND Fleets website.

## Current Optimizations

The application now includes:
- ✅ Lazy loading with Intersection Observer
- ✅ Skeleton loaders while images load
- ✅ Priority loading for above-the-fold images
- ✅ Error handling with fallbacks
- ✅ Responsive image sizing

## Image Optimization Best Practices

### 1. Optimize Images Before Upload

**Recommended Tools:**
- **Squoosh** (https://squoosh.app) - Free, browser-based
- **TinyPNG** (https://tinypng.com) - Free, online
- **ImageOptim** (Mac) or **FileOptimizer** (Windows) - Desktop tools

**Target Sizes:**
- **Thumbnail images** (Fleet page): 400x256px, WebP format, ~50-80KB
- **Detail images** (Car detail page): 1200x600px, WebP format, ~150-300KB
- **Hero images**: 1920x1080px, WebP format, ~200-400KB

### 2. Use Modern Image Formats

**Priority Order:**
1. **WebP** - Best compression, supported by all modern browsers
2. **AVIF** - Even better compression, newer format
3. **JPEG** - Fallback for older browsers
4. **PNG** - Only for images with transparency

### 3. Compression Settings

- **Quality**: 75-85% for photos (good balance of quality/size)
- **Progressive JPEG**: Enable for better perceived performance
- **Remove EXIF data**: Reduces file size

### 4. Image Dimensions

**Before Upload:**
- Resize images to the exact dimensions needed
- Don't upload 4K images and scale down in CSS
- Create multiple sizes for different use cases

### 5. Upload Workflow

1. **Optimize locally** using tools above
2. **Convert to WebP** format
3. **Resize** to target dimensions
4. **Upload** to Supabase Storage

## Supabase Storage Optimization

### Enable CDN (Recommended)

Supabase Storage uses a CDN, but you can optimize further:

1. **Use Supabase CDN URLs** - Images are automatically served via CDN
2. **Enable caching headers** - Already configured in storage policies
3. **Consider Cloudflare** - Add Cloudflare in front for additional optimization

### Storage Bucket Configuration

Ensure your `car-images` bucket has:
- ✅ Public access enabled
- ✅ CORS configured for your domain
- ✅ Proper RLS policies

## Performance Monitoring

### Check Image Performance

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **Img**
4. Check:
   - File sizes
   - Load times
   - Whether images are cached

### Target Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Image load time**: < 1s for above-the-fold images

## Quick Optimization Script

If you have many images to optimize, you can use this Node.js script:

```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, width, quality = 80) {
  await sharp(inputPath)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);
  console.log(`Optimized: ${outputPath}`);
}

// Usage example
// optimizeImage('input.jpg', 'output.webp', 400, 75);
```

Install: `npm install sharp`

## Additional Recommendations

### 1. Use Image CDN Service (Advanced)

Consider using:
- **Cloudinary** - Automatic optimization and transformation
- **ImageKit** - Real-time image optimization
- **Cloudflare Images** - Integrated with Cloudflare

### 2. Implement Responsive Images

For even better performance, use `srcset`:

```tsx
<img
  srcSet="
    image-400.webp 400w,
    image-800.webp 800w,
    image-1200.webp 1200w
  "
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  src="image-1200.webp"
  alt="Car image"
/>
```

### 3. Preload Critical Images

For hero images or first car images:

```html
<link rel="preload" as="image" href="/path/to/critical-image.webp" />
```

## Troubleshooting

### Images Still Loading Slowly

1. **Check file sizes** - Should be < 300KB for detail images
2. **Verify format** - Using WebP?
3. **Check network** - Slow connection or CDN issues?
4. **Browser cache** - Clear cache and test
5. **Supabase region** - Ensure storage is in a region close to users

### Images Not Displaying

1. Check Supabase Storage bucket is public
2. Verify CORS settings
3. Check image URLs in browser console
4. Ensure RLS policies allow public read access

## Summary

**Before Upload:**
- ✅ Optimize images (compress, resize)
- ✅ Convert to WebP format
- ✅ Target file sizes: 50-300KB depending on use

**After Upload:**
- ✅ Images are served via Supabase CDN
- ✅ Lazy loading handles off-screen images
- ✅ Skeleton loaders improve perceived performance

For best results, optimize images **before** uploading to Supabase Storage.

