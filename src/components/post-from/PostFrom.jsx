import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",  
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);


    useEffect(() => {
        if (!userData) {
            console.error("User not logged in! Please login first.");
        }
    }, [userData]);

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title" && value?.title) {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const submit = async (data) => {
        console.log("🔥 Submit clicked!");
        console.log("Form data:", data);
        console.log("User:", userData);
        
       
        if (!userData || !userData.$id) {
         
            navigate("/login");
            return;
        }
        
        try {
            if (post) {
       
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.slug}`);  // ✅ FIXED - Use slug instead of $id
                }
            } else {
                // CREATE new post
                console.log("Creating new post...");
                
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
                console.log("File uploaded:", file);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    
                    console.log("Calling createPost with:", { 
                        ...data, 
                        userId: userData.$id 
                    });
                    
                    const dbPost = await appwriteService.createPost({ 
                        ...data, 
                        userId: userData.$id 
                    });
                    
                    console.log("Post created:", dbPost);

                    if (dbPost) {
                        navigate(`/post/${dbPost.slug}`);  // ✅ FIXED - Use slug instead of $id
                    }
                } else {
                    alert("Please upload an image!");
                    console.log("No file uploaded!");
                }
            }
        } catch (error) {
            console.error("❌ ERROR:", error);
            alert("Error: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}