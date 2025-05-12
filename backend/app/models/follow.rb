class Follow < ApplicationRecord
  # Associations
  belongs_to :follower, class_name: "User"
  belongs_to :followed, class_name: "User"
  
  # Validations
  validates :follower_id, uniqueness: { scope: :followed_id, message: "is already following this user" }
  validate :not_following_self
  
  private
  
  def not_following_self
    if follower_id == followed_id
      errors.add(:follower, "cannot follow themselves")
    end
  end
end
