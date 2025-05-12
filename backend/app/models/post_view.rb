class PostView < ApplicationRecord
  # Associations
  belongs_to :post
  belongs_to :user, optional: true
  
  # Validations
  validates :post_id, presence: true
  
  # Callbacks
  after_create :increment_post_views_count
  
  private
  
  def increment_post_views_count
    post.increment!(:views_count)
  end
end
