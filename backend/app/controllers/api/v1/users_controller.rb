class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]
  
  # GET /api/v1/me
  def me
    render json: current_user, status: :ok
  end
  
  # POST /api/v1/signup
  def create
    @user = User.new(user_params)
    
    if @user.save
      sign_in(@user)
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/users
  def update
    if current_user.update(update_params)
      render json: current_user, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :username, :email, :password, :password_confirmation)
  end
  
  def update_params
    params.require(:user).permit(:name, :bio, :avatar)
  end
end
