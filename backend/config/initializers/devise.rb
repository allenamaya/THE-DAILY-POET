Devise.setup do |config|
  config.mailer_sender = 'noreply@dailypoet.com'

  require 'devise/orm/active_record'

  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.navigational_formats = ['*/*', :html, :json]
  
  # Add support for API authentication
  config.warden do |manager|
    manager.failure_app = Proc.new do |env|
      response = {
        success: false,
        message: "Authentication required",
        status: 401
      }
      
      return [401, { "Content-Type" => "application/json" }, [response.to_json]]
    end
  end
end
