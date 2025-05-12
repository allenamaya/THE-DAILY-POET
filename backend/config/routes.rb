Rails.application.routes.draw do
  # Devise routes
  devise_for :users, skip: [:sessions, :registrations, :passwords]
  
  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication
      post '/signup', to: 'users#create'
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      get '/me', to: 'users#me'
      
      # Users/Profiles
      resources :users, only: [:update] do
        collection do
          put 'password', to: 'users#update_password'
        end
      end
      
      resources :profiles, param: :username, only: [:show] do
        member do
          post :follow
          delete :unfollow
          get :liked_posts
        end
      end
      
      # Posts
      resources :posts do
        collection do
          get :featured
          get :trending
          get :recent
          get :following
        end
        
        member do
          post :like
          delete :unlike
          post :repost
          delete :unrepost
        end
        
        resources :comments, only: [:index, :create]
      end
      
      # Comments
      resources :comments, only: [:destroy] do
        member do
          post :like
          delete :unlike
        end
      end
      
      # Notifications
      resources :notifications, only: [:index] do
        member do
          patch :read, to: 'notifications#mark_as_read'
        end
        
        collection do
          post :mark_all_read
        end
      end
      
      # Search
      get '/search', to: 'search#index'
      
      # Collections
      resources :collections do
        member do
          post :add_post
          delete :remove_post/:post_id, to: 'collections#remove_post'
        end
      end
      
      # Analytics
      get '/analytics', to: 'analytics#index'
    end
  end
  
  # Catch-all route for SPA
  root 'home#index'
  get '*path', to: 'home#index', constraints: ->(request) { !request.xhr? && request.format.html? }
end
