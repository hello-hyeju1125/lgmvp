#!/bin/bash

# Next.js 배포 스크립트 (management-simulation)
# 사용법: ./deploy.sh <PUBLIC_IP>
# config.sh 파일에서 프로젝트 설정을 읽어옵니다.

set -e

if [ -z "$1" ]; then
    echo "사용법: ./deploy.sh <PUBLIC_IP>"
    exit 1
fi

PUBLIC_IP=$1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 설정 파일 로드
if [ -f "./config.sh" ]; then
    source ./config.sh
    echo -e "${GREEN}설정 파일을 로드했습니다: config.sh${NC}"
else
    echo -e "${RED}설정 파일(config.sh)이 없습니다.${NC}"
    echo "먼저 config.sh 파일을 생성하고 프로젝트 설정을 입력해주세요."
    exit 1
fi

LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-admin@pmsim.kro.kr}"
SSL_DOMAIN="${SSL_DOMAIN:-pmsim.kro.kr}"

KEY_FILE="$KEY_PATH/$KEY_NAME.pem"

echo -e "${GREEN}${PROJECT_DISPLAY_NAME} 프로젝트 EC2 배포 시작 (Next.js)${NC}"

# 키 파일 확인
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}키 파일을 찾을 수 없습니다: $KEY_FILE${NC}"
    exit 1
fi

# SSH 연결 테스트
echo -e "${YELLOW}EC2 인스턴스 연결 테스트...${NC}"
if ! ssh -i $KEY_FILE -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@$PUBLIC_IP "echo '연결 성공'" &> /dev/null; then
    echo -e "${RED}EC2 인스턴스에 연결할 수 없습니다.${NC}"
    echo "인스턴스가 실행 중인지 확인해주세요."
    exit 1
fi

echo -e "${GREEN}EC2 인스턴스 연결 확인${NC}"

# 1. 서버 환경 설정 (Node.js + Nginx만)
echo -e "${YELLOW}서버 환경 설정 중...${NC}"
ssh -i $KEY_FILE ubuntu@$PUBLIC_IP << 'ENV_EOF'
# 한국 시간대 설정
echo "=== 한국 시간대 설정 ==="
sudo timedatectl set-timezone Asia/Seoul 2>/dev/null || true
export TZ=Asia/Seoul
echo "현재 시간: $(date)"

# Git 설치
echo "=== Git 설치 ==="
sudo apt-get update -qq
sudo apt-get install -y -qq git curl

# Node.js 설치 (nvm)
echo "=== Node.js 설치 (nvm) ==="
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20 2>/dev/null || true
nvm use 20
node -v
npm -v

# PM2 설치 (프로세스 관리)
echo "=== PM2 설치 ==="
npm install -g pm2 2>/dev/null || true

# Nginx 설치 (리버스 프록시)
echo "=== Nginx 설치 ==="
sudo apt-get install -y -qq nginx 2>/dev/null || true

# Let's Encrypt용 certbot (HTTPS)
echo "=== Certbot 설치 ==="
sudo apt-get install -y -qq certbot 2>/dev/null || true
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html 2>/dev/null || true

echo "서버 환경 설정 완료"
ENV_EOF

# 2. 프로젝트 클론 또는 풀
echo -e "${YELLOW}프로젝트 동기화 중...${NC}"
CLONE_URL="$GITHUB_REPO_URL"
if [ -n "$GITHUB_TOKEN" ]; then
    CLONE_URL="https://${GITHUB_TOKEN}@github.com/fornerds/${PROJECT_NAME}.git"
fi
ssh -i $KEY_FILE ubuntu@$PUBLIC_IP "bash -s" "$CLONE_URL" "$PROJECT_NAME" << 'REMOTE_SCRIPT'
CLONE_URL="$1"
PROJECT_NAME="$2"
cd /home/ubuntu

if [ -d "$PROJECT_NAME" ]; then
    echo "기존 프로젝트 폴더가 있습니다. git pull로 갱신합니다."
    cd "$PROJECT_NAME"
    git fetch origin
    git reset --hard origin/$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    git pull --rebase 2>/dev/null || git pull 2>/dev/null || true
    cd /home/ubuntu
else
    echo "저장소 클론 중..."
    git config --global user.name "EC2-Deploy"
    git config --global user.email "deploy@ec2.local"
  if git clone "$CLONE_URL" "$PROJECT_NAME"; then
    echo "Git 클론 성공"
  else
    echo "Git 클론 실패. 저장소 URL과 GITHUB_TOKEN(비공개일 때)을 확인하세요."
    echo "  저장소: https://github.com/fornerds/$PROJECT_NAME"
    exit 1
  fi
fi
REMOTE_SCRIPT

# 3. Next.js 빌드 및 PM2 실행
echo -e "${YELLOW}Next.js 빌드 및 서비스 시작...${NC}"
ssh -i $KEY_FILE ubuntu@$PUBLIC_IP "bash -s" "$PROJECT_NAME" << 'DEPLOY_EOF'
PROJECT_NAME="$1"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || true

cd /home/ubuntu/$PROJECT_NAME

echo "=== npm install ==="
npm ci 2>/dev/null || npm install

echo "=== Next.js 빌드 ==="
npm run build

echo "=== PM2로 Next.js 시작 ==="
pm2 delete $PROJECT_NAME 2>/dev/null || true
pm2 start npm --name "$PROJECT_NAME" -- start
pm2 save
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.*/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

echo "Next.js 서비스 시작 완료 (포트 3000)"
DEPLOY_EOF

# 4. Nginx 리버스 프록시 + Let's Encrypt HTTPS
echo -e "${YELLOW}Nginx 리버스 프록시 및 HTTPS 설정...${NC}"
BOOTSTRAP_NGINX='map $http_upgrade $connection_upgrade { default upgrade; '\'''\'' close; }
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name SSL_DOMAIN_PLACEHOLDER;
    root /var/www/html;
    location /.well-known/acme-challenge/ { default_type text/plain; try_files $uri =404; }
    location /_next/webpack-hmr {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}'
ssh -i $KEY_FILE ubuntu@$PUBLIC_IP "bash -s" "$PROJECT_NAME" "$SSL_DOMAIN" "$LETSENCRYPT_EMAIL" "$BOOTSTRAP_NGINX" << 'NGINX_EOF'
PROJECT_NAME="$1"
SSL_DOMAIN="$2"
LETSENCRYPT_EMAIL="$3"
BOOTSTRAP_NGINX="$4"
# Bootstrap(HTTP 전용) 설정으로 먼저 적용
echo "$BOOTSTRAP_NGINX" | sed "s/SSL_DOMAIN_PLACEHOLDER/$SSL_DOMAIN/g" | sudo tee /etc/nginx/sites-available/default > /dev/null
sudo nginx -t && sudo systemctl reload nginx
# 인증서 없으면 발급
if [ ! -f /etc/letsencrypt/live/"$SSL_DOMAIN"/fullchain.pem ]; then
    echo "=== Let's Encrypt 인증서 발급 (최초 1회) ==="
    sudo certbot certonly --webroot -w /var/www/html -d "$SSL_DOMAIN" --non-interactive --agree-tos --email "$LETSENCRYPT_EMAIL" --preferred-challenges http || true
fi
NGINX_EOF

# 인증서가 있으면 전체 설정(HTTPS) 적용
if ssh -i $KEY_FILE ubuntu@$PUBLIC_IP "test -f /etc/letsencrypt/live/$SSL_DOMAIN/fullchain.pem" 2>/dev/null; then
    sed "s/pmsim.kro.kr/$SSL_DOMAIN/g" "$SCRIPT_DIR/nginx-default.conf" | ssh -i $KEY_FILE ubuntu@$PUBLIC_IP "sudo tee /etc/nginx/sites-available/default > /dev/null"
    ssh -i $KEY_FILE ubuntu@$PUBLIC_IP "sudo nginx -t && sudo systemctl reload nginx"
    echo "Nginx 설정 완료 (HTTPS: https://$SSL_DOMAIN)"
else
    echo -e "${YELLOW}인증서가 없어 HTTP만 적용되었습니다. DNS에서 $SSL_DOMAIN 이 이 서버 IP를 가리키는지 확인한 뒤 배포를 다시 실행하세요.${NC}"
fi

# 5. 서비스 상태 확인
echo -e "${YELLOW}서비스 상태 확인...${NC}"
ssh -i $KEY_FILE ubuntu@$PUBLIC_IP << 'STATUS_EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
echo "=== PM2 목록 ==="
pm2 list
echo "=== Nginx 상태 ==="
sudo systemctl status nginx --no-pager | head -5
echo "=== 포트 80, 3000 확인 ==="
sudo ss -tlnp | grep -E ':(80|3000)\s' || true
STATUS_EOF

echo -e "${GREEN}배포 완료!${NC}"
echo -e "${GREEN}접속 정보:${NC}"
echo "  - 웹 앱 (HTTP):  http://$PUBLIC_IP"
echo "  - 웹 앱 (HTTPS): https://$SSL_DOMAIN  (DNS 연결 후)"
echo "  - SSH: ssh -i $KEY_FILE ubuntu@$PUBLIC_IP"

# 배포 정보 저장
mkdir -p "$KEY_PATH"
cat > "$KEY_PATH/deployment-info.txt" << EOF
${PROJECT_DISPLAY_NAME} 프로젝트 배포 정보
============================
Public IP: $PUBLIC_IP
웹 앱 (HTTP):  http://$PUBLIC_IP
웹 앱 (HTTPS): https://$SSL_DOMAIN (DNS 연결 후)
SSH: ssh -i $KEY_FILE ubuntu@$PUBLIC_IP
배포 시간: $(date)
EOF

echo -e "${GREEN}배포 정보가 $KEY_PATH/deployment-info.txt 에 저장되었습니다.${NC}"
