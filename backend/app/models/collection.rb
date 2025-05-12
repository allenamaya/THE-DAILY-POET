class Collection < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :collection_posts, dependent: :destroy
  has_many :posts, through: :collection_posts
  
  # Validations
  validates :name, presence: true, length: { maximum: 100 }
  validates :description, length: { maximum: 500 }, allow_blank: true
  
  # Scopes
  scope :public_collections, -> { where(is_private: false) }
  
  # Instance methods
  def as_json(options = {})
    super(options.merge(
      except: [:user_id],
      methods: [:posts_count]
    ))
  end
  
  def posts_count
    posts.count
  end
end
