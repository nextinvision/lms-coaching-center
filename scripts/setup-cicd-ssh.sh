#!/bin/bash
# Helper script to set up SSH keys for CI/CD deployment
# Run this on your local machine or development environment

set -e

echo "🔐 CI/CD SSH Key Setup Helper"
echo "=============================="
echo ""

# Check if key already exists
KEY_NAME="github_actions_deploy"
KEY_PATH="$HOME/.ssh/$KEY_NAME"

if [ -f "$KEY_PATH" ]; then
    echo "⚠️  SSH key already exists at: $KEY_PATH"
    read -p "Do you want to overwrite it? (yes/no): " OVERWRITE
    if [ "$OVERWRITE" != "yes" ]; then
        echo "❌ Setup cancelled"
        exit 0
    fi
fi

# Get server details
read -p "Enter production server IP [72.62.194.231]: " SERVER_IP
SERVER_IP=${SERVER_IP:-72.62.194.231}

read -p "Enter SSH username [root]: " SSH_USER
SSH_USER=${SSH_USER:-root}

read -p "Enter SSH port [22]: " SSH_PORT
SSH_PORT=${SSH_PORT:-22}

echo ""
echo "📝 Generating SSH key pair..."

# Generate SSH key
ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$KEY_PATH" -N ""

echo ""
echo "✅ SSH key generated at: $KEY_PATH"
echo ""

# Add to SSH agent
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)" > /dev/null
fi

ssh-add "$KEY_PATH" 2>/dev/null || echo "⚠️  Could not add to SSH agent (optional)"

echo "📤 Adding public key to server..."
echo "   Server: $SSH_USER@$SERVER_IP:$SSH_PORT"

# Copy public key to server
ssh-copy-id -i "$KEY_PATH.pub" -p "$SSH_PORT" "$SSH_USER@$SERVER_IP" || {
    echo ""
    echo "⚠️  Could not automatically copy key. Manual steps:"
    echo ""
    echo "1. Copy this public key:"
    echo "   cat $KEY_PATH.pub"
    echo ""
    echo "2. SSH to server and add to authorized_keys:"
    echo "   ssh -p $SSH_PORT $SSH_USER@$SERVER_IP"
    echo "   mkdir -p ~/.ssh"
    echo "   nano ~/.ssh/authorized_keys"
    echo "   (paste the public key and save)"
    echo ""
}

# Test connection
echo ""
echo "🧪 Testing SSH connection..."
if ssh -i "$KEY_PATH" -p "$SSH_PORT" -o StrictHostKeyChecking=no "$SSH_USER@$SERVER_IP" "echo 'Connection successful!'" 2>/dev/null; then
    echo "✅ SSH connection successful!"
else
    echo "⚠️  SSH connection test failed. Please verify manually."
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Copy the PRIVATE key content to add to GitHub Secrets:"
echo "   cat $KEY_PATH"
echo ""
echo "2. Go to GitHub Repository Settings:"
echo "   https://github.com/nextinvision/lms-coaching-center/settings/secrets/actions"
echo ""
echo "3. Add these secrets:"
echo "   PROD_HOST = $SERVER_IP"
echo "   PROD_USERNAME = $SSH_USER"
echo "   PROD_SSH_PORT = $SSH_PORT (if not 22)"
echo "   PROD_SSH_KEY = (paste private key content from step 1)"
echo ""
echo "4. Add database URL:"
echo "   PROD_DATABASE_URL = postgresql://postgres:postgres@localhost:5432/lms_coaching_center?schema=public"
echo ""
echo "✅ Setup complete!"


