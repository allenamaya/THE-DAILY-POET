class CreateTables < ActiveRecord::Migration[7.0]
  def change
    # Users table (added by Devise)
    create_table :users do |t|
      # Devise fields
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      
      # Custom fields
      t.string :name, null: false
      t.string :username, null: false
      t.text :bio
      t.boolean :public_likes, default: true
      
      t.timestamps
    end
    
    add_index :users, :email, unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :username, unique: true
    
    # Posts table
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content, null: false
      t.text :excerpt
      t.boolean :has_audio, default: false
      t.integer :likes_count, default: 0
      t.integer :comments_count, default: 0
      t.integer :reposts_count, default: 0
      
      t.timestamps
    end
    
    # Comments table
    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.text :content, null: false
      t.integer :likes_count, default: 0
      
      t.timestamps
    end
    
    # Likes table (polymorphic)
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :likeable, polymorphic: true, null: false
      
      t.timestamps
    end
    
    add_index :likes, [:user_id, :likeable_type, :likeable_id], unique: true
    
    # Reposts table
    create_table :reposts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      
      t.timestamps
    end
    
    add_index :reposts, [:user_id, :post_id], unique: true
    
    # Follows table
    create_table :follows do |t|
      t.integer :follower_id, null: false
      t.integer :followed_id, null: false
      
      t.timestamps
    end
    
    add_index :follows, [:follower_id, :followed_id], unique: true
    add_index :follows, :follower_id
    add_index :follows, :followed_id
    
    # Tags table
    create_table :tags do |t|
      t.references :post, null: false, foreign_key: true
      t.string :name, null: false
      
      t.timestamps
    end
    
    add_index :tags, [:post_id, :name], unique: true
    add_index :tags, :name
  end
end
