class Like < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :likeable, polymorphic: true
  
  # Validations
  validates :user_id, uniqueness: { scope: [:likeable_id, :likeable_type], message: "has already liked this" }
end
