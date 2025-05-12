class Api::V1::PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :featured, :trending, :recent, :search]
  before_action :set_post, only: [:show, :update, :destroy, :like, :unlike, :repost, :unrepost]
  before_action :authorize_user, only: [:update, :destroy]
  
  # GET /api/v1/posts
  def index
    @posts = Post.includes(:user, :tags).order(created_at: :desc).limit(20)
    render json: @posts
  end
  
  # GET /api/v1/posts/featured
  def featured
    @posts = Post.includes(:user, :tags).order(likes_count: :desc).limit(6)
    render json: @posts
  end
  
  # GET /api/v1/posts/trending
  def trending
    @posts = Post.includes(:user, :tags).order(likes_count: :desc).limit(20)
    render json: @posts
  end
  
  # GET /api/v1/posts/recent
  def recent
    @posts = Post.includes(:user, :tags).order(created_at: :desc).limit(20)
    render json: @posts
  end
  
  # GET /api/v1/posts/following
  def following
    return render json: { error: 'Authentication required' }, status: :unauthorized unless current_user
    
    following_ids = current_user.followings.pluck(:id)
    @posts = Post.includes(:user, :tags).where(user_id: following_ids).order(created_at: :desc).limit(20)
    render json: @posts
  end
  
  # GET /api/v1/posts/search
  def search
    query = params[:query].to_s.strip
    
    if query.present?
      @posts = Post.includes(:user, :tags)
                   .joins("LEFT JOIN tags ON tags.post_id = posts.id")
                   .where("posts.title LIKE ? OR posts.content LIKE ? OR tags.name LIKE ?", 
                          "%#{query}%", "%#{query}%", "%#{query}%")
                   .distinct
                   .limit(20)
    else
      @posts = Post.includes(:user, :tags).none
    end
    
    render json: @posts
  end
  
  # GET /api/v1/posts/:id
  def show
    render json: @post.as_json(include: [:user, :tags], 
                              methods: [:liked_by_current_user, :reposted_by_current_user],
                              current_user: current_user)
  end
  
  # POST /api/v1/posts
  def create
    @post = current_user.posts.new(post_params)
    
    # Process tags
    if params[:post][:tags].present?
      tags = params[:post][:tags].split(',').map(&:strip)
      tags.each do |tag_name|
        @post.tags.build(name: tag_name) if tag_name.present?
      end
    end
    
    if @post.save
      render json: @post, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/posts/:id
  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/posts/:id
  def destroy
    @post.destroy
    head :no_content
  end
  
  # POST /api/v1/posts/:id/like
  def like
    like = @post.likes.find_or_create_by(user: current_user)
    
    if like.persisted?
      @post.increment!(:likes_count)
      render json: { message: 'Post liked successfully' }
    else
      render json: { errors: like.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/posts/:id/unlike
  def unlike
    like = @post.likes.find_by(user: current_user)
    
    if like&.destroy
      @post.decrement!(:likes_count)
      render json: { message: 'Post unliked successfully' }
    else
      render json: { error: 'Like not found' }, status: :not_found
    end
  end
  
  # POST /api/v1/posts/:id/repost
  def repost
    repost = @post.reposts.find_or_create_by(user: current_user)
    
    if repost.persisted?
      @post.increment!(:reposts_count)
      render json: { message: 'Post reposted successfully' }
    else
      render json: { errors: repost.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/posts/:id/unrepost
  def unrepost
    repost = @post.reposts.find_by(user: current_user)
    
    if repost&.destroy
      @post.decrement!(:reposts_count)
      render json: { message: 'Post unreposted successfully' }
    else
      render json: { error: 'Repost not found' }, status: :not_found
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def authorize_user
    unless @post.user == current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :audio)
  end
end
