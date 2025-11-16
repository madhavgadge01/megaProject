import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Container, PostCard } from '../components';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);

                const postsData = await appwriteService.getPosts(); 
                
                console.log("Posts data:", postsData);
                
                if (postsData && postsData.documents) {
                    const validPosts = postsData.documents.filter(
                        post => post && post.$id && post.slug 
                    );
                    setPosts(validPosts);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full py-8 text-center">
                <Container>
                    <h1 className="text-2xl font-bold">Loading posts...</h1>
                </Container>
            </div>
        );
    }

    if (!user && posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <h1 className="text-2xl font-bold hover:text-gray-500">
                        Login to read posts
                    </h1>
                </Container>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 text-center">
                <Container>
                    <h1 className="text-2xl font-bold hover:text-gray-500">
                        No posts available
                    </h1>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {posts.map((post) => (
                        <div key={post.$id}>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;