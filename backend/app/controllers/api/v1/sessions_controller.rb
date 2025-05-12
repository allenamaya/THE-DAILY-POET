class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]
  
  # POST /api/v1/login
  def create
    user = User.find_by(email: params[:user][:email])
    
    if user && user.valid_password?(params[:user][:password])
      sign_in(user)
      render json: user, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  
  # DELETE /api/v1/logout
  def destroy
    sign_out(current_user)
    render json: { message: 'Logged out successfully' }, status: :ok
  end
end
