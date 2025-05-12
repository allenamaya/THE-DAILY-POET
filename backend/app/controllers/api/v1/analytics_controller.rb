class Api::V1::AnalyticsController < ApplicationController
  # GET /api/v1/analytics
  def index
    range = params[:range] || "30days"
    
    case range
    when "7days"
      start_date = 7.days.ago.beginning_of_day
    when "30days"
      start_date = 30.days.ago.beginning_of_day
    when "90days"
      start_date = 90.days.ago.beginning_of_day
    when "year"
      start_date = 1.year.ago.beginning_of_day
    else
      start_date = 30.days.ago.beginning_of_day
    end
    
    # Get user's posts
    user_posts = current_user.posts
    
    # Calculate total metrics
    total_posts = user_posts.count
    total_views = user_posts.sum(:views_count)
    total_likes = user_posts.sum(:likes_count)
    total_comments = user_posts.sum(:comments_count)
    total_reposts = user_posts.sum(:reposts_count)
    followers_count = current_user.followers.count
    
    # Calculate engagement rate
    engagement_rate = total_views > 0 ? (total_likes + total_comments + total_reposts).to_f / total_views : 0
    
    # Get posts by day
    posts_by_day = user_posts
                    .where("created_at >= ?", start_date)
                    .group("DATE(created_at)")
                    .count
                    .map { |date, count| { date: date.to_s, posts: count } }
    
    # Get views by day
    views_by_day = PostView
                    .where(post_id: user_posts.pluck(:id))
                    .where("created_at >= ?", start_date)
                    .group("DATE(created_at)")
                    .count
                    .map { |date, count| { date: date.to_s, views: count } }
    
    # Get engagement by day
    likes_by_day = Like
                    .where(likeable_type: "Post", likeable_id: user_posts.pluck(:id))
                    .where("created_at >= ?", start_date)
                    .group("DATE(created_at)")
                    .count
    
    comments_by_day = Comment
                      .where(post_id: user_posts.pluck(:id))
                      .where("created_at >= ?", start_date)
                      .group("DATE(created_at)")
                      .count
    
    reposts_by_day = Repost
                      .where(post_id: user_posts.pluck(:id))
                      .where("created_at >= ?", start_date)
                      .group("DATE(created_at)")
                      .count
    
    # Combine engagement metrics by day
    engagement_by_day = []
    (start_date.to_date..Date.today).each do |date|
      date_str = date.to_s
      engagement_by_day << {
        date: date_str,
        likes: likes_by_day[date_str] || 0,
        comments: comments_by_day[date_str] || 0,
        reposts: reposts_by_day[date_str] || 0
      }
    end
    
    # Get top performing posts
    top_posts = user_posts
                .select("id, title, views_count as views, likes_count as likes, comments_count as comments, reposts_count as reposts")
                .order("(likes_count + comments_count + reposts_count) DESC")
                .limit(5)
    
    # Calculate engagement distribution
    total_engagement = total_likes + total_comments + total_reposts
    engagement_distribution = [
      { name: "Likes", value: total_engagement > 0 ? total_likes.to_f / total_engagement : 0 },
      { name: "Comments", value: total_engagement > 0 ? total_comments.to_f / total_engagement : 0 },
      { name: "Reposts", value: total_engagement > 0 ? total_reposts.to_f / total_engagement : 0 }
    ]
    
    render json: {
      overview: {
        total_posts: total_posts,
        total_views: total_views,
        total_likes: total_likes,
        total_comments: total_comments,
        total_reposts: total_reposts,
        followers_count: followers_count
      },
      engagement_rate: engagement_rate,
      posts_by_day: posts_by_day,
      views_by_day: views_by_day,
      engagement_by_day: engagement_by_day,
      top_posts: top_posts,
      engagement_distribution: engagement_distribution
    }
  end
end
