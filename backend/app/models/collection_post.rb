class CollectionPost < ApplicationRecord
  # Associations
  belongs_to :collection
  belongs_to :post
  
  # Validations
  validates :post_id, uniqueness: { scope: :collection_id, message: "is already in this collection" }
end
