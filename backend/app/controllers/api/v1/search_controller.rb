class Api::V1::SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  
  # GET /api/v1/search
  def index
    query = params[:query].to_s.strip
    exclude_collection_id = params[:exclude_collection].to_i
    
    if query.present?
      # Search posts
      @posts = Post.includes(:user, :tags)
                   .joins("LEFT JOIN tags ON tags.post_id = posts.id")
                   .where("posts.title LIKE ? OR posts.content LIKE ? OR tags.name LIKE ?", 
                          "%#{query}%", "%#{query}%", "%#{query}%")
                   .distinct
                   .limit(20)
      
      # If excluding posts from a collection
      if exclude_collection_id > 0
        collection = Collection.find_by(id: exclude_collection_id)
        if collection && collection.user_id == current_user&.id
          @posts = @posts.where.not(id: collection.posts.pluck(:id))
        end
      end
      
      # Search users
      @users = User.where("name LIKE ? OR username LIKE ? OR bio LIKE ?", 
                         "%#{query}%", "%#{query}%", "%#{query}%")
                  .limit(10)
      
      # Search tags
      @tags = Tag.select("name, COUNT(DISTINCT post_id) as posts_count")
                .where("name LIKE ?", "%#{query}%")
                .group(:name)
                .order("posts_count DESC")
                .limit(20)
    else
      @posts = []
      @users = []
      @tags = []
    end
    
    render json: {
      posts: @posts.as_json(include: { 
                              user: { only: [:id, :name, :username], methods: [:avatar_url] },
                              tags: { only: :name }
                            },
                            methods: [:excerpt]),
      users: @users.as_json(only: [:id, :name, :username, :bio], 
                           methods: [:avatar_url, :posts_count, :followers_count, :following_count]),
      tags: @tags.as_json(only: [:name, :posts_count])
    }
  end
end
