class Notification < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :actor, class_name: "User"
  
  # Validations
  validates :content, presence: true
  validates :action_type, presence: true
  validates :target_type, presence: true
  validates :target_id, presence: true
  
  # Scopes
  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc).limit(20) }
  
  # Instance methods
  def as_json(options = {})
    super(options.merge(
      include: {
        actor: { only: [:id, :name, :username], methods: [:avatar_url] }
      },
      except: [:updated_at]
    ))
  end
end
