class Repost < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :post
  
  # Validations
  validates :user_id, uniqueness: { scope: :post_id, message: "has already reposted this" }
end
