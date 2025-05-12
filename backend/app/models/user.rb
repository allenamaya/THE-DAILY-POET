class User < ApplicationRecord
  # Include default devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  # Associations
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :reposts, dependent: :destroy
  
  # Following/Followers
  has_many :active_follows, class_name: "Follow", foreign_key: "follower_id", dependent: :destroy
  has_many :passive_follows, class_name: "Follow", foreign_key: "followed_id", dependent: :destroy
  has_many :followings, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower
  
  # Active Storage for avatar
  has_one_attached :avatar
  
  # Validations
  validates :name, presence: true
  validates :username, presence: true, uniqueness: { case_sensitive: false }, 
            format: { with: /\A[a-zA-Z0-9_]+\z/, message: "can only contain letters, numbers, and underscores" }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }, on: :create
  validates :bio, length: { maximum: 500 }, allow_blank: true
  
  # Callbacks
  before_save :downcase_email_and_username
  
  # Instance methods
  def as_json(options = {})
    super(options.merge(
      only: [:id, :name, :username, :email, :bio, :created_at, :updated_at],
      methods: [:avatar_url]
    ))
  end
  
  def avatar_url
    avatar.attached? ? Rails.application.routes.url_helpers.url_for(avatar) : nil
  end
  
  private
  
  def downcase_email_and_username
    self.email = email.downcase
    self.username = username.downcase
  end
end
