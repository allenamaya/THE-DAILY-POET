class Api::V1::NotificationsController < ApplicationController
  # GET /api/v1/notifications
  def index
    @notifications = current_user.notifications.includes(:actor).order(created_at: :desc).limit(50)
    render json: @notifications
  end
  
  # PATCH /api/v1/notifications/:id/read
  def mark_as_read
    @notification = current_user.notifications.find(params[:id])
    @notification.update(read: true)
    head :no_content
  end
  
  # POST /api/v1/notifications/mark_all_read
  def mark_all_read
    current_user.notifications.update_all(read: true)
    head :no_content
  end
end
