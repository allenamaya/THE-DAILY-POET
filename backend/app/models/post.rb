class Post < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, as: :likeable, dependent: :destroy
  has_many :reposts, dependent: :destroy
  has_many :tags, dependent: :destroy
  
  # Active Storage for audio file
  has_one_attached :audio
  
  # Validations
  validates :title, presence: true, length: { maximum: 100 }
  validates :content, presence: true
  validate :audio_format, if: -> { audio.attached? }
  
  # Callbacks
  before_save :set_excerpt
  before_save :set_has_audio
  
  # Scopes
  scope :with_audio, -> { where(has_audio: true) }
  
  # Instance methods
  def as_json(options = {})
    current_user = options.delete(:current_user)
    
    json = super(options.merge(
      except: [:updated_at],
      include: {
        user: { 
          only: [:id, :name, :username],
          methods: [:avatar_url] 
        }
      },
      methods: [:audio_url, :has_audio]
    ))
    
    # Add liked/reposted status if current_user is present
    if current_user
      json.merge!(
        liked_by_current_user: likes.exists?(user_id: current_user.id),
        reposted_by_current_user: reposts.exists?(user_id: current_user.id)
      )
    else
      json.merge!(
        liked_by_current_user: false,
        reposted_by_current_user: false
      )
    end
    
    json
  end
  
  def audio_url
    audio.attached? ? Rails.application.routes.url_helpers.url_for(audio) : nil
  end
  
  def liked_by_current_user(current_user = nil)
    return false unless current_user
    likes.exists?(user_id: current_user.id)
  end
  
  def reposted_by_current_user(current_user = nil)
    return false unless current_user
    reposts.exists?(user_id: current_user.id)
  end
  
  private
  
  def set_excerpt
    self.excerpt = content.truncate(150) if content.present?
  end
  
  def set_has_audio
    self.has_audio = audio.attached?
  end
  
  def audio_format
    return unless audio.attached?
    
    unless audio.content_type.in?(%w[audio/mpeg audio/mp3 audio/wav audio/x-wav])
      errors.add(:audio, 'must be an MP3 or WAV file')
    end
  end
end
