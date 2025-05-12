class Tag < ApplicationRecord
  # Associations
  belongs_to :post
  
  # Validations
  validates :name, presence: true, length: { maximum: 30 }
  validates :name, uniqueness: { scope: :post_id, message: "has already been added to this post" }
  
  # Callbacks
  before_save :normalize_name
  
  private
  
  def normalize_name
    self.name = name.downcase.strip
  end
end
