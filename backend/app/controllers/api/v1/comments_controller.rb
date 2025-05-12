class Api::V1::CommentsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  before_action :set_post, only: [:index, :create]
  before_action :set_comment, only: [:destroy, :like, :unlike]
  before_action :authorize_user, only: [:destroy]
  
  # GET /api/v1/posts/:post_id/comments
  def index
    @comments = @post.comments.includes(:user).order(created_at: :desc)
    
    render json: @comments.as_json(
      include: { user: { only: [:id, :name, :username, :avatar] } },
      methods: [:liked_by_current_user],
      current_user: current_user
    )
  end
  
  # POST /api/v1/posts/:post_id/comments
  def create
    @comment = @post.comments.new(comment_params)
    @comment.user = current_user
    
    if @comment.save
      @post.increment!(:comments_count)
      render json: @comment.as_json(
        include: { user: { only: [:id, :name, :username, :avatar] } }
      ), status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/comments/:id
  def destroy
    post = @comment.post
    @comment.destroy
    post.decrement!(:comments_count)
    head :no_content
  end
  
  # POST /api/v1/comments/:id/like
  def like
    like = @comment.likes.find_or_create_by(user: current_user)
    
    if like.persisted?
      @comment.increment!(:likes_count)
      render json: { message: 'Comment liked successfully' }
    else
      render json: { errors: like.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/comments/:id/unlike
  def unlike
    like = @comment.likes.find_by(user: current_user)
    
    if like&.destroy
      @comment.decrement!(:likes_count)
      render json: { message: 'Comment unliked successfully' }
    else
      render json: { error: 'Like not found' }, status: :not_found
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:post_id])
  end
  
  def set_comment
    @comment = Comment.find(params[:id])
  end
  
  def authorize_user
    unless @comment.user == current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def comment_params
    params.require(:comment).permit(:content)
  end
end
