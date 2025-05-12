class Comment < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :post
  has_many :likes, as: :likeable, dependent: :destroy
  
  # Validations
  validates :content, presence: true, length: { maximum: 1000 }
  
  # Instance methods
  def as_json(options = {})
    current_user = options.delete(:current_user)
    
    json = super(options.merge(
      except: [:updated_at],
      methods: [:liked_by_current_user]
    ))
    
    json[:liked_by_current_user] = liked_by_current_user(current_user) unless json.has_key?(:liked_by_current_user)
    
    json
  end
  
  def liked_by_current_user(current_user = nil)
    return false unless current_user
    likes.exists?(user_id: current_user.id)
  end
end
