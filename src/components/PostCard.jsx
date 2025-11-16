import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, slug }) {

    console.log("=== PostCard Debug ===");
    console.log("Post ID:", $id);
    console.log("Slug:", slug);
    console.log("Featured Image ID:", featuredImage);
    console.log("Title:", title);
    
 
    if (!$id || !slug) {
        console.warn("PostCard missing required fields:", { $id, slug });
        return null;
    }


    if (!featuredImage) {
        console.error(" No featuredImage provided!");
        return (
            <Link to={`/post/${slug}`}>
                <div className='w-full bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-all'>
                    <div className='w-full mb-4 aspect-video overflow-hidden rounded-xl bg-gray-300 flex items-center justify-center'>
                        <span className='text-gray-500'>No Image Available</span>
                    </div>
                    <h2 className='text-xl font-bold'>{title}</h2>
                </div>
            </Link>
        );
    }


    let imageUrl;
    try {
        imageUrl = appwriteService.getFilePreview(featuredImage);
        console.log("✅ Generated Image URL:", imageUrl);
    } catch (error) {
        console.error("Error generating image URL:", error);
        imageUrl = "https://via.placeholder.com/400x300?text=Error+Loading+Image";
    }

    return (
        <Link to={`/post/${slug}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-all'>
                <div className='w-full mb-4 aspect-video overflow-hidden rounded-xl bg-gray-300'>
                    <img 
                        src={imageUrl}
                        alt={title}
                        className='w-full h-full object-cover'
                        onLoad={() => {
                            console.log("✅ Image loaded successfully for:", title);
                        }}
                        onError={(e) => {
                            console.error(" Image failed to load for:", title);
                            console.error("Failed URL:", imageUrl);
                            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                    />
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </Link>
    )
}

export default PostCard