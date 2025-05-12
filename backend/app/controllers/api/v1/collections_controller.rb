class Api::V1::CollectionsController < ApplicationController
  before_action :set_collection, only: [:show, :update, :destroy, :add_post, :remove_post]
  before_action :authorize_user, only: [:update, :destroy, :add_post, :remove_post]
  
  # GET /api/v1/collections
  def index
    @collections = current_user.collections.order(updated_at: :desc)
    render json: @collections
  end
  
  # GET /api/v1/collections/:id
  def show
    # Check if the collection is private and not owned by the current user
    if @collection.is_private && @collection.user_id != current_user&.id
      return render json: { error: "You don't have permission to view this collection" }, status: :forbidden
    end
    
    @posts = @collection.posts.includes(:user, :tags).order(created_at: :desc)
    
    render json: {
      collection: @collection,
      posts: @posts.as_json(include: { 
                              user: { only: [:id, :name, :username], methods: [:avatar_url] },
                              tags: { only: :name }
                            },
                            methods: [:excerpt])
    }
  end
  
  # POST /api/v1/collections
  def create
    @collection = current_user.collections.new(collection_params)
    
    if @collection.save
      render json: @collection, status: :created
    else
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/collections/:id
  def update
    if @collection.update(collection_params)
      render json: @collection
    else
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/collections/:id
  def destroy
    @collection.destroy
    head :no_content
  end
  
  # POST /api/v1/collections/:id/add_post
  def add_post
    post = Post.find(params[:post_id])
    
    # Check if the post is already in the collection
    if @collection.posts.include?(post)
      return render json: { error: "Post is already in this collection" }, status: :unprocessable_entity
    end
    
    @collection.posts << post
    render json: { message: "Post added to collection successfully" }
  end
  
  # DELETE /api/v1/collections/:id/remove_post/:post_id
  def remove_post
    post = Post.find(params[:post_id])
    
    # Check if the post is in the collection
    unless @collection.posts.include?(post)
      return render json: { error: "Post is not in this collection" }, status: :not_found
    end
    
    @collection.posts.delete(post)
    render json: { message: "Post removed from collection successfully" }
  end
  
  private
  
  def set_collection
    @collection = Collection.find(params[:id])
  end
  
  def authorize_user
    unless @collection.user_id == current_user.id
      render json: { error: "You don't have permission to modify this collection" }, status: :forbidden
    end
  end
  
  def collection_params
    params.require(:collection).permit(:name, :description, :is_private)
  end
end
