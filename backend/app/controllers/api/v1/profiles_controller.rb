class Api::V1::ProfilesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show]
  
  # GET /api/v1/profiles/:username
  def show
    @user = User.find_by!(username: params[:username])
    @posts = @user.posts.order(created_at: :desc)
    
    is_following = current_user && current_user.followings.include?(@user)
    is_current_user = current_user && current_user.id == @user.id
    
    render json: {
      profile: {
        id: @user.id,
        name: @user.name,
        username: @user.username,
        bio: @user.bio,
        avatar: @user.avatar.url,
        followers_count: @user.followers.count,
        following_count: @user.followings.count,
        posts_count: @user.posts.count,
        joined_at: @user.created_at,
        is_following: is_following,
        is_current_user: is_current_user
      },
      posts: @posts.as_json(only: [:id, :title, :excerpt, :has_audio, :likes_count, :comments_count, :reposts_count])
    }
  end
  
  # GET /api/v1/profiles/:username/liked_posts
  def liked_posts
    return render json: { error: 'Authentication required' }, status: :unauthorized unless current_user
    
    @user = User.find_by!(username: params[:username])
    
    if current_user == @user || @user.public_likes
      # Get posts that the user has liked
      liked_post_ids = @user.likes.where(likeable_type: 'Post').pluck(:likeable_id)
      @posts = Post.where(id: liked_post_ids).order(created_at: :desc)
      
      render json: @posts.as_json(only: [:id, :title, :excerpt, :has_audio, :likes_count, :comments_count, :reposts_count])
    else
      render json: { error: 'This user\'s likes are private' }, status: :forbidden
    end
  end
  
  # POST /api/v1/profiles/:username/follow
  def follow
    @user = User.find_by!(username: params[:username])
    
    # Can't follow yourself
    if @user == current_user
      return render json: { error: 'You cannot follow yourself' }, status: :unprocessable_entity
    end
    
    # Create follow relationship
    following = current_user.active_follows.build(followed: @user)
    
    if following.save
      render json: { message: 'User followed successfully' }
    else
      render json: { errors: following.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/profiles/:username/unfollow
  def unfollow
    @user = User.find_by!(username: params[:username])
    
    follow = current_user.active_follows.find_by(followed: @user)
    
    if follow&.destroy
      render json: { message: 'User unfollowed successfully' }
    else
      render json: { error: 'You are not following this user' }, status: :not_found
    end
  end
end
