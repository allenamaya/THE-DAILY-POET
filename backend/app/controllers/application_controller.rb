class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  
  before_action :authenticate_user!
  
  # Return JSON for API requests
  respond_to :json, if: -> { request.path.start_with?('/api') }
  
  # Handle not found errors
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  
  private
  
  def not_found
    render json: { error: 'Resource not found' }, status: :not_found
  end
  
  # Override Devise's method to include API authentication
  def authenticate_user!
    if request.path.start_with?('/api')
      unless current_user
        render json: { error: 'You need to sign in or sign up before continuing.' }, status: :unauthorized
      end
    else
      super
    end
  end
end
