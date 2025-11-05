import React, { useState, useEffect } from "react";
import "../css/home.css";
import {
  Home as HomeIcon,
  Bell as NotificationsIcon,
  Mail as MessagesIcon,
  User as UserIcon,
  MoreHorizontal,
  Image,
  Smile,
  MapPin,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BadgeCheck as PremiumIcon,
  UserRound as ProfileIcon,
  MoreHorizontal as MoreOptionsIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  Heart,
  MessageCircle,
  Repeat2,
  BarChart3,
  Share,
  Send,
  Edit3,
  Trash2,
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  deleteDoc,
  where,
  onSnapshot
} from "firebase/firestore";
import { db } from "../lib/firebase";

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [userLikes, setUserLikes] = useState({});
  const [activeTab, setActiveTab] = useState("home");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Listen for Firebase Auth user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await initializeUserLikes(currentUser.uid);
        if (activeTab === "profile") {
          fetchUserPosts(currentUser.uid);
        }
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const initializeUserLikes = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "userLikes", userId));
      if (userDoc.exists()) {
        setUserLikes(userDoc.data().likedPosts || {});
      } else {
        setUserLikes({});
      }
    } catch (error) {
      console.error("Error initializing user likes:", error);
    }
  };

  // Real-time posts listener for home feed
  useEffect(() => {
    if (activeTab === "home") {
      setupRealTimePostsListener();
    }
  }, [activeTab]);

  // Real-time listener for user profile posts
  useEffect(() => {
    if (activeTab === "profile" && user) {
      setupRealTimeUserPostsListener(user.uid);
    }
  }, [activeTab, user]);

  // Real-time listener for selected user profile posts
  useEffect(() => {
    if (activeTab === "userProfile" && selectedUser) {
      setupRealTimeUserPostsListener(selectedUser.uid);
    }
  }, [activeTab, selectedUser]);

  const setupRealTimePostsListener = () => {
    setIsLoadingPosts(true);
    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(postsQuery, 
      (querySnapshot) => {
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setIsLoadingPosts(false);
        
        // Store posts in localStorage for offline persistence
        localStorage.setItem('cachedPosts', JSON.stringify(postsData));
      },
      (error) => {
        console.error("Error in real-time posts listener:", error);
        setIsLoadingPosts(false);
        
        // Fallback to cached posts if real-time fails
        const cachedPosts = localStorage.getItem('cachedPosts');
        if (cachedPosts) {
          setPosts(JSON.parse(cachedPosts));
        }
      }
    );

    return unsubscribe;
  };

  const setupRealTimeUserPostsListener = (userId) => {
    setIsLoadingPosts(true);
    const postsQuery = query(
      collection(db, "posts"), 
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(postsQuery, 
      (querySnapshot) => {
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setIsLoadingPosts(false);
      },
      (error) => {
        console.error("Error in real-time user posts listener:", error);
        setIsLoadingPosts(false);
      }
    );

    return unsubscribe;
  };

  // Load cached posts on initial load
  useEffect(() => {
    const cachedPosts = localStorage.getItem('cachedPosts');
    if (cachedPosts && posts.length === 0) {
      setPosts(JSON.parse(cachedPosts));
    }
  }, []);

  const handlePostSubmit = async () => {
    if (!postContent.trim() || !user) return;

    setIsLoading(true);
    try {
      const newPost = {
        content: postContent,
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        timestamp: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
        retweets: 0,
        replies: 0
      };

      await addDoc(collection(db, "posts"), newPost);
      
      setPostContent("");
      // Real-time listener will automatically update the posts
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId, currentLikes, currentLikedBy) => {
    if (!user) {
      alert("Please sign in to like posts");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const userLikeRef = doc(db, "userLikes", user.uid);
      
      const isLiked = currentLikedBy.includes(user.uid);
      
      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: Math.max(0, currentLikes - 1),
          likedBy: arrayRemove(user.uid)
        });
        await setDoc(userLikeRef, {
          likedPosts: {
            ...userLikes,
            [postId]: false
          }
        }, { merge: true });
        setUserLikes(prev => ({ ...prev, [postId]: false }));
      } else {
        // Like
        await updateDoc(postRef, {
          likes: currentLikes + 1,
          likedBy: arrayUnion(user.uid)
        });
        await setDoc(userLikeRef, {
          likedPosts: {
            ...userLikes,
            [postId]: true
          }
        }, { merge: true });
        setUserLikes(prev => ({ ...prev, [postId]: true }));
      }
      // Real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error updating like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentContent.trim() || !user) {
      alert("Please sign in to comment");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      const currentReplies = postDoc.data()?.replies || 0;

      const comment = {
        id: Date.now().toString(),
        content: commentContent,
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        timestamp: serverTimestamp(),
      };

      await updateDoc(postRef, {
        comments: arrayUnion(comment),
        replies: currentReplies + 1
      });

      setCommentContent("");
      setActiveCommentPost(null);
      // Real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleEditPost = async (postId) => {
    if (!editContent.trim()) return;

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        content: editContent
      });
      
      setEditingPost(null);
      setEditContent("");
      // Real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Failed to edit post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      // Real-time listener will automatically update the UI
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Search through all posts to find users
      const postsQuery = query(collection(db, "posts"));
      const querySnapshot = await getDocs(postsQuery);
      
      const usersMap = new Map();
      querySnapshot.docs.forEach(doc => {
        const post = doc.data();
        const searchLower = searchQuery.toLowerCase();
        const displayNameLower = post.displayName.toLowerCase();
        const usernameLower = post.userEmail.split('@')[0].toLowerCase();
        
        if (displayNameLower.includes(searchLower) || usernameLower.includes(searchLower)) {
          if (!usersMap.has(post.userId)) {
            usersMap.set(post.userId, {
              uid: post.userId,
              displayName: post.displayName,
              email: post.userEmail,
              username: post.userEmail.split('@')[0]
            });
          }
        }
      });
      
      setSearchResults(Array.from(usersMap.values()));
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleUserSelect = async (userData) => {
    setSelectedUser(userData);
    setActiveTab("userProfile");
    setSearchQuery("");
    setSearchResults([]);
    // Real-time listener will automatically fetch and update user posts
  };

  const handleBackToHome = () => {
    setSelectedUser(null);
    setActiveTab("home");
    // Real-time listener will automatically switch to home feed
  };

  // Example dropdown suggestions
  const suggestions = [
    "React",
    "Firebase",
    "Tailwind",
    "JavaScript",
    "Node.js",
    "MongoDB",
  ];

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setIsExpanded(false);
        setActiveCommentPost(null);
        setEditingPost(null);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

  const renderProfileSection = () => {
    if (!user) return null;

    const userPosts = posts.filter(post => post.userId === user.uid);
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalPosts = userPosts.length;

    return (
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <UserIcon size={80} />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.displayName || "User"}</h2>
            <p className="profile-handle">@{user.email ? user.email.split("@")[0] : "username"}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{totalPosts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{totalLikes}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat">
                <span className="stat-number">{userPosts.reduce((sum, post) => sum + (post.replies || 0), 0)}</span>
                <span className="stat-label">Replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserProfile = () => {
    if (!selectedUser) return null;

    const userPosts = posts.filter(post => post.userId === selectedUser.uid);
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalPosts = userPosts.length;

    return (
      <div className="profile-section">
        <button className="back-button" onClick={handleBackToHome}>
          ← Back to Home
        </button>
        <div className="profile-header">
          <div className="profile-avatar">
            <UserIcon size={80} />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{selectedUser.displayName}</h2>
            <p className="profile-handle">@{selectedUser.username}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{totalPosts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{totalLikes}</span>
                <span className="stat-label">Likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPost = (post, showActions = true) => (
    <div key={post.id} className="post-card">
      <div className="post-avatar">
        <UserIcon size={40} />
      </div>
      <div className="post-content">
        <div className="post-header">
          <span className="post-display-name">
            {post.displayName}
          </span>
          <span className="post-username">
            @{post.userEmail.split('@')[0]}
          </span>
          <span className="post-time">
            · {formatTimestamp(post.timestamp)}
          </span>
          
          {/* Edit/Delete buttons for own posts */}
          {showActions && user && post.userId === user.uid && (
            <div className="post-actions-owner">
              <button 
                className="action-btn edit-btn"
                onClick={() => {
                  setEditingPost(post.id);
                  setEditContent(post.content);
                }}
              >
                <Edit3 size={16} />
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {editingPost === post.id ? (
          <div className="edit-post-area">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-textarea"
              maxLength={280}
            />
            <div className="edit-actions">
              <button 
                className="cancel-edit-btn"
                onClick={() => {
                  setEditingPost(null);
                  setEditContent("");
                }}
              >
                Cancel
              </button>
              <button 
                className="save-edit-btn"
                onClick={() => handleEditPost(post.id)}
                disabled={!editContent.trim()}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="post-text">
            {post.content}
          </div>
        )}

        {showActions && (
          <>
            <div className="post-actions">
              <button 
                className="post-action-btn"
                onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
              >
                <MessageCircle size={18} />
                <span>{post.replies || 0}</span>
              </button>
              <button className="post-action-btn">
                <Repeat2 size={18} />
                <span>{post.retweets || 0}</span>
              </button>
              <button 
                className={`post-action-btn ${userLikes[post.id] ? 'liked' : ''}`}
                onClick={() => handleLike(post.id, post.likes || 0, post.likedBy || [])}
              >
                <Heart size={18} fill={userLikes[post.id] ? "currentColor" : "none"} />
                <span>{post.likes || 0}</span>
              </button>
              <button className="post-action-btn">
                <BarChart3 size={18} />
                <span>0</span>
              </button>
              <button className="post-action-btn">
                <Share size={18} />
              </button>
            </div>

            {/* Comment Section */}
            {activeCommentPost === post.id && (
              <div className="comment-section">
                <div className="comment-compose">
                  <div className="compose-user-avatar">
                    <UserIcon size={20} />
                  </div>
                  <div className="comment-input-area">
                    <textarea
                      placeholder="Post your reply"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      maxLength={280}
                      className="comment-textarea"
                    />
                    <button 
                      className="comment-submit-btn"
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!commentContent.trim()}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Display Comments */}
                <div className="comments-list">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments
                      .sort((a, b) => {
                        try {
                          return (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0);
                        } catch {
                          return 0;
                        }
                      })
                      .map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-avatar">
                            <UserIcon size={16} />
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-display-name">
                                {comment.displayName}
                              </span>
                              <span className="comment-username">
                                @{comment.userEmail.split('@')[0]}
                              </span>
                              <span className="comment-time">
                                · {formatTimestamp(comment.timestamp)}
                              </span>
                            </div>
                            <div className="comment-text">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="no-comments">
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="Home-container">
      <div className="Home-wrapper">
        {/* Header */}
        <div className="Header-container">
          <div className="Header-left">
            <button
              className="header-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>
            <h1>X-Space</h1>
          </div>

          <div className="Header-right">
            {windowWidth > 444 ? (
              <div className="search-bar">
                <SearchIcon size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchQuery && (
                  <div className="search-dropdown">
                    {searchResults.length > 0 ? (
                      searchResults.map((user, i) => (
                        <div
                          key={i}
                          className="dropdown-item user-result"
                          onClick={() => handleUserSelect(user)}
                        >
                          <UserIcon size={16} />
                          <div className="user-result-info">
                            <span className="user-result-name">{user.displayName}</span>
                            <span className="user-result-handle">@{user.username}</span>
                          </div>
                        </div>
                      ))
                    ) : filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item, i) => (
                        <div
                          key={i}
                          className="dropdown-item"
                          onClick={() => setSearchQuery(item)}
                        >
                          {item}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-item no-result">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {!isExpanded ? (
                  <button
                    className="search-icon-btn"
                    onClick={() => setIsExpanded(true)}
                  >
                    <SearchIcon size={22} />
                  </button>
                ) : (
                  <div className="search-bar mobile">
                    <SearchIcon size={20} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="search-input"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      className="close-search"
                      onClick={() => {
                        setSearchQuery("");
                        setIsExpanded(false);
                        setSearchResults([]);
                      }}
                    >
                      <CloseIcon size={20} />
                    </button>

                    {searchQuery && (
                      <div className="search-dropdown">
                        {searchResults.length > 0 ? (
                          searchResults.map((user, i) => (
                            <div
                              key={i}
                              className="dropdown-item user-result"
                              onClick={() => handleUserSelect(user)}
                            >
                              <UserIcon size={16} />
                              <div className="user-result-info">
                                <span className="user-result-name">{user.displayName}</span>
                                <span className="user-result-handle">@{user.username}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-item no-result">
                            No users found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <div
            className="menu-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
        )}

        <div className="Content-container">
          <div
            className={`left-pannel ${menuOpen ? "open" : ""}`}
            role="navigation"
            aria-label="Main menu"
          >
            <div className="left-pannel-upper">
              <div 
                className={`left-pannel-upper-selection ${activeTab === "home" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("home");
                  setSelectedUser(null);
                }}
              >
                <HomeIcon strokeWidth={3} />
                <span>Home</span>
              </div>
              <div className="left-pannel-upper-selection">
                <SearchIcon strokeWidth={3} />
                <span>Explore</span>
              </div>
              <div className="left-pannel-upper-selection">
                <NotificationsIcon strokeWidth={3} />
                <span>Notifications</span>
              </div>
              <div className="left-pannel-upper-selection">
                <MessagesIcon strokeWidth={3} />
                <span>Messages</span>
              </div>
              <div className="left-pannel-upper-selection">
                <BookmarkIcon strokeWidth={3} />
                <span>Bookmarks</span>
              </div>
              <div 
                className={`left-pannel-upper-selection ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("profile");
                  setSelectedUser(null);
                }}
              >
                <ProfileIcon strokeWidth={3} />
                <span>Profile</span>
              </div>
              <div className="left-pannel-upper-selection">
                <MoreOptionsIcon strokeWidth={3} />
                <span>More</span>
              </div>
              <button className="compose-btn">Post</button>
              
              <div className="left-pannel-lower">
                <div className="image">
                  <UserIcon size={20} />
                </div>

                <div className="user-info">
                  <span className="user-name">
                    {user?.displayName || "User"}
                  </span>
                  <span className="user-handle">
                    @{user?.email ? user.email.split("@")[0] : "username"}
                  </span>
                </div>

                <MoreHorizontal size={20} className="more-icon" />
              </div>
            </div>

            <button
              className="left-panel-close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="main-column">
            {/* Header based on active tab */}
            <div className="compose-header">
              <h2>
                {activeTab === "home" && "Home"}
                {activeTab === "profile" && "Profile"}
                {activeTab === "userProfile" && selectedUser?.displayName}
              </h2>
            </div>

            {/* Compose Post Section - Only show on home and own profile */}
            {(activeTab === "home" || activeTab === "profile") && (
              <div className="compose-section">
                <div className="compose-area">
                  <div className="compose-user-avatar">
                    <UserIcon size={24} />
                  </div>
                  <div className="compose-input-area">
                    <textarea
                      placeholder="What is happening?!"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      maxLength={280}
                      className="compose-textarea"
                    />
                    <div className="compose-actions">
                      <div className="compose-icons">
                        <button className="compose-icon-btn">
                          <Image size={20} />
                        </button>
                        <button className="compose-icon-btn">
                          <Smile size={20} />
                        </button>
                        <button className="compose-icon-btn">
                          <MapPin size={20} />
                        </button>
                      </div>
                      <button 
                        className="post-submit-btn"
                        onClick={handlePostSubmit}
                        disabled={!postContent.trim() || isLoading}
                      >
                        {isLoading ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Section */}
            {activeTab === "profile" && renderProfileSection()}
            {activeTab === "userProfile" && renderUserProfile()}

            {/* Posts Feed */}
            <div className="posts-feed">
              {isLoadingPosts ? (
                <div className="loading-posts">
                  <div className="loading-spinner"></div>
                  <p>Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => renderPost(post, activeTab !== "userProfile" || post.userId === user?.uid))
              ) : (
                <div className="no-posts">
                  <p>
                    {activeTab === "home" && "No posts yet. Be the first to post!"}
                    {activeTab === "profile" && "You haven't posted anything yet."}
                    {activeTab === "userProfile" && "This user hasn't posted anything yet."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="right-column">
            {/* Profile Card in Right Column for Home Tab */}
            {activeTab === "home" && user && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-card-avatar">
                    <UserIcon size={48} />
                  </div>
                  <div className="profile-card-info">
                    <h3 className="profile-card-name">{user.displayName || "User"}</h3>
                    <p className="profile-card-handle">@{user.email ? user.email.split("@")[0] : "username"}</p>
                  </div>
                </div>
                <div className="profile-card-stats">
                  <div className="profile-stat">
                    <span className="stat-number">
                      {posts.filter(post => post.userId === user.uid).length}
                    </span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-number">
                      {posts.filter(post => post.userId === user.uid).reduce((sum, post) => sum + (post.likes || 0), 0)}
                    </span>
                    <span className="stat-label">Likes</span>
                  </div>
                </div>
                <button 
                  className="view-profile-btn"
                  onClick={() => {
                    setActiveTab("profile");
                  }}
                >
                  View Profile
                </button>
              </div>
            )}

            {/* Who to follow */}
            <div className="who-to-follow">
              <h3>Who to follow</h3>
              <div className="follow-suggestion">
                <div className="suggestion-avatar">
                  <UserIcon size={40} />
                </div>
                <div className="suggestion-info">
                  <span className="suggestion-name">React</span>
                  <span className="suggestion-handle">@reactjs</span>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
              <div className="follow-suggestion">
                <div className="suggestion-avatar">
                  <UserIcon size={40} />
                </div>
                <div className="suggestion-info">
                  <span className="suggestion-name">Firebase</span>
                  <span className="suggestion-handle">@firebase</span>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
            </div>

            {/* Footer */}
            <div className="right-column-footer">
              <div className="footer-links">
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Cookie Policy</a>
                <a href="#">Accessibility</a>
                <a href="#">Ads info</a>
                <a href="#">More</a>
              </div>
              <div className="copyright">
                © 2024 X-Space Corp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;