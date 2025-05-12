class CreateAdditionalTables < ActiveRecord::Migration[7.0]
  def change
    # Notifications table
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :actor, null: false, foreign_key: { to_table: :users }
      t.string :action_type, null: false
      t.text :content, null: false
      t.string :target_type, null: false
      t.integer :target_id, null: false
      t.string :target_url
      t.boolean :read, default: false
      
      t.timestamps
    end
    
    add_index :notifications, [:user_id, :read]
    
    # Collections table
    create_table :collections do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.boolean :is_private, default: false
      
      t.timestamps
    end
    
    # Collection Posts join table
    create_table :collection_posts do |t|
      t.references :collection, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      
      t.timestamps
    end
    
    add_index :collection_posts, [:collection_id, :post_id], unique: true
    
    # Post Views table
    create_table :post_views do |t|
      t.references :post, null: false, foreign_key: true
      t.references :user, foreign_key: true
      t.string :ip_address
      t.string :user_agent
      
      t.timestamps
    end
    
    # Add views_count to posts
    add_column :posts, :views_count, :integer, default: 0
  end
end
