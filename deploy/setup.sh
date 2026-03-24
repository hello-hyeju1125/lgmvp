#!/bin/bash

# 통합 설정 스크립트
# 1) GitHub CLI(gh) 설치·인증
# 2) GitHub 원격 저장소 생성 및 푸시
# 3) AWS CLI 설치·자격 증명
# 4) EC2 인스턴스 생성
# 사용법: ./setup.sh
# 이미 완료된 단계는 자동으로 건너뜀

set -e
export TZ=Asia/Seoul

# 스크립트 기준 디렉터리
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 설정 파일 로드
if [ -f "$SCRIPT_DIR/config.sh" ]; then
    source "$SCRIPT_DIR/config.sh"
    echo -e "${GREEN}설정 파일을 로드했습니다: config.sh${NC}"
else
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
fi
if [ -z "${GREEN}" ]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
fi

echo -e "${GREEN}=== 통합 설정 시작 (gh + AWS CLI + EC2) ===${NC}"

# ==========================================
# 1. GitHub CLI(gh) 설치·인증
# ==========================================
echo -e "${YELLOW}[1/3] GitHub CLI 확인 중...${NC}"

if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}gh가 설치되어 있지 않습니다. 설치를 시작합니다...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo -e "${RED}Homebrew가 없습니다. 먼저 https://brew.sh 설치 후 다시 실행하세요.${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            type -p curl >/dev/null || (sudo apt-get update && sudo apt-get install -y curl)
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y gh
        else
            echo -e "${RED}지원되지 않는 Linux 환경입니다. 수동 설치: https://github.com/cli/cli#installation${NC}"
            exit 1
        fi
    else
        echo -e "${RED}이 스크립트는 macOS/Linux용입니다. Windows는 README의 gh 설치 방법을 따르세요.${NC}"
        exit 1
    fi
    hash -r
    export PATH="/usr/local/bin:/usr/bin:/opt/homebrew/bin:$PATH"
    echo -e "${GREEN}gh 설치 완료.${NC}"
else
    echo -e "${GREEN}gh가 이미 설치되어 있습니다.${NC}"
fi

if command -v gh &> /dev/null; then
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}GitHub에 로그인되어 있지 않습니다. 로그인을 진행합니다...${NC}"
        gh auth login
    else
        echo -e "${GREEN}gh 로그인 상태 확인됨.${NC}"
    fi
fi

# ==========================================
# 2. GitHub 원격 저장소 생성 및 푸시
# ==========================================
if [ -f "$SCRIPT_DIR/config.sh" ]; then
    source "$SCRIPT_DIR/config.sh" 2>/dev/null || true
fi
GIT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true

# deploy 폴더에서 실행 시, 상위가 프로젝트 루트인데 .git 이 없으면 여기서 init 유도
PROJECT_ROOT="$SCRIPT_DIR/.."
if [ -z "$GIT_ROOT" ] && [ -n "${PROJECT_NAME}" ] && [ -f "$PROJECT_ROOT/package.json" ]; then
    echo ""
    echo -e "${YELLOW}프로젝트 폴더($(cd "$PROJECT_ROOT" && pwd))에 Git 저장소가 없습니다.${NC}"
    read -p "지금 git init 하고 원격 저장소까지 만들까요? (Y/n): " DO_INIT
    DO_INIT="${DO_INIT:-Y}"
    if [ "$DO_INIT" = "y" ] || [ "$DO_INIT" = "Y" ]; then
        (cd "$PROJECT_ROOT" && git init)
        GIT_ROOT="$(cd "$PROJECT_ROOT" && git rev-parse --show-toplevel)"
        echo -e "${GREEN}git init 완료. 저장소 생성 단계로 진행합니다.${NC}"
    fi
fi

if [ -n "$GIT_ROOT" ] && [ -n "${PROJECT_NAME}" ]; then
    REPO_URL="https://github.com/fornerds/${PROJECT_NAME}.git"
    echo ""
    if ! gh repo view "fornerds/${PROJECT_NAME}" &>/dev/null; then
        echo -e "${YELLOW}GitHub에 fornerds/$PROJECT_NAME 저장소가 없습니다.${NC}"
        read -p "지금 만들고 코드를 푸시할까요? (Y/n): " DO_PUSH
        DO_PUSH="${DO_PUSH:-Y}"
    else
        read -p "fornerds/$PROJECT_NAME 레포에 코드를 푸시할까요? (y/N): " DO_PUSH
        DO_PUSH="${DO_PUSH:-N}"
    fi
    if [ "$DO_PUSH" = "y" ] || [ "$DO_PUSH" = "Y" ]; then
        cd "$GIT_ROOT"
        CURRENT_ORIGIN="$(git remote get-url origin 2>/dev/null || true)"
        if [ -z "$CURRENT_ORIGIN" ]; then
            git add .
            if [ -n "$(git status --short)" ]; then
                git commit -m "init: ${PROJECT_DISPLAY_NAME:-프로젝트} 초기 설정" 2>/dev/null || true
            else
                echo -e "${YELLOW}이미 커밋된 상태입니다. 푸시만 진행합니다.${NC}"
            fi
            if gh repo view "fornerds/${PROJECT_NAME}" &>/dev/null; then
                echo -e "${YELLOW}GitHub에 fornerds/$PROJECT_NAME 레포가 이미 있습니다. remote 추가 후 푸시합니다.${NC}"
                git remote add origin "$REPO_URL"
                BRANCH="$(git branch --show-current)"
                git push -u origin "$BRANCH" && echo -e "${GREEN}푸시 완료.${NC}" || echo -e "${YELLOW}푸시 실패. gh auth login 후 다시 시도하세요.${NC}"
            else
                gh repo create "fornerds/${PROJECT_NAME}" --private --source=. --remote=origin --push && echo -e "${GREEN}레포 생성 및 푸시 완료.${NC}" || echo -e "${YELLOW}실패. 권한을 확인하세요.${NC}"
            fi
        else
            if [ "$CURRENT_ORIGIN" != "$REPO_URL" ]; then
                git remote set-url origin "$REPO_URL"
            fi
            git add .
            if [ -n "$(git status --short)" ]; then
                git commit -m "init: ${PROJECT_DISPLAY_NAME:-프로젝트} 변경 사항 반영" 2>/dev/null || true
            else
                echo -e "${YELLOW}이미 커밋된 상태입니다. 푸시만 진행합니다.${NC}"
            fi
            BRANCH="$(git branch --show-current)"
            if ! gh repo view "fornerds/${PROJECT_NAME}" &>/dev/null; then
                echo -e "${YELLOW}원격 레포가 없습니다. fornerds/$PROJECT_NAME 생성 후 푸시합니다.${NC}"
                git remote remove origin 2>/dev/null || true
                gh repo create "fornerds/${PROJECT_NAME}" --private --source=. --remote=origin --push && echo -e "${GREEN}레포 생성 및 푸시 완료.${NC}" || echo -e "${YELLOW}실패. 권한을 확인하세요.${NC}"
            else
                git push -u origin "$BRANCH" && echo -e "${GREEN}푸시 완료.${NC}" || echo -e "${YELLOW}푸시 실패. gh auth login 후 다시 시도하세요.${NC}"
            fi
        fi
    fi
else
    if [ -z "$GIT_ROOT" ] && [ -n "${PROJECT_NAME}" ]; then
        echo ""
        echo -e "${YELLOW}[건너뜀] GitHub 저장소 생성: 프로젝트 폴더가 Git 저장소가 아니거나, 위에서 'n'을 선택하셨습니다.${NC}"
        echo -e "${YELLOW}      나중에 프로젝트 루트에서 'git init' 후 다시 ./setup.sh 를 실행하면 fornerds/$PROJECT_NAME 레포를 만들 수 있습니다.${NC}"
    fi
fi

cd "$SCRIPT_DIR"

# ==========================================
# 3. AWS CLI 설치·자격 증명
# ==========================================
echo -e "${YELLOW}[2/3] AWS CLI 확인 중...${NC}"

if command -v aws &> /dev/null && aws sts get-caller-identity &> /dev/null; then
    echo -e "${GREEN}AWS CLI가 이미 설정되어 있습니다. 자격 증명 설정 단계를 건너뜁니다.${NC}"
    AWS_ACCOUNT=$(aws sts get-caller-identity --query 'Account' --output text 2>/dev/null)
    echo -e "  Account: $AWS_ACCOUNT"
else
    if [ ! -f "./config.sh" ]; then
        read -p "AWS Account ID: " AWS_ACCOUNT_ID
        read -p "IAM Username: " AWS_IAM_USERNAME
        read -p "Access Key ID: " AWS_ACCESS_KEY_ID
        read -s -p "Secret Access Key: " AWS_SECRET_ACCESS_KEY
        echo
        read -p "Region (기본값: ap-northeast-2): " AWS_REGION
        AWS_REGION=${AWS_REGION:-ap-northeast-2}
        AWS_OUTPUT_FORMAT="json"
    fi

    echo -e "${YELLOW}계정 정보:${NC}"
    echo "  - Account ID: $AWS_ACCOUNT_ID"
    echo "  - IAM User: $AWS_IAM_USERNAME"
    echo "  - Region: $AWS_REGION"

    if ! command -v aws &> /dev/null; then
        echo -e "${YELLOW}AWS CLI 설치 중...${NC}"
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v apt-get &> /dev/null; then
                sudo apt-get update && sudo apt-get install -y awscli
            elif command -v yum &> /dev/null; then
                sudo yum install -y awscli
            else
                pip3 install awscli
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            command -v brew &> /dev/null && brew install awscli || pip3 install awscli
        else
            echo -e "${RED}지원되지 않는 운영체제입니다.${NC}"
            exit 1
        fi
        hash -r
        export PATH="/usr/local/bin:/usr/bin:/opt/homebrew/bin:$PATH"
        echo -e "${GREEN}AWS CLI 설치 완료${NC}"
    else
        echo -e "${GREEN}AWS CLI가 이미 설치되어 있습니다.${NC}"
    fi

    aws --version
    echo -e "${YELLOW}AWS 자격 증명 설정 중...${NC}"
    mkdir -p ~/.aws
    cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = $AWS_ACCESS_KEY_ID
aws_secret_access_key = $AWS_SECRET_ACCESS_KEY
EOF
    cat > ~/.aws/config << EOF
[default]
region = $AWS_REGION
output = ${AWS_OUTPUT_FORMAT:-json}
EOF
    echo -e "${GREEN}AWS 자격 증명 설정 완료${NC}"
fi

if command -v aws &> /dev/null; then
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}자격 증명 검증에 실패했습니다. config.sh 또는 입력값을 확인하세요.${NC}"
        exit 1
    fi
    echo -e "${YELLOW}EC2 권한 테스트 중...${NC}"
    aws ec2 describe-instances --max-items 1 &> /dev/null || echo -e "${YELLOW}EC2 권한이 없거나 제한됩니다. IAM에서 EC2 권한을 확인하세요.${NC}"
fi

# ==========================================
# 4. EC2 인스턴스 생성
# ==========================================
echo -e "${YELLOW}[3/3] EC2 인스턴스 생성 단계...${NC}"

if [ ! -f "$SCRIPT_DIR/config.sh" ]; then
    echo -e "${YELLOW}config.sh가 없어 EC2 생성은 건너뜁니다.${NC}"
    echo -e "${YELLOW}다음 단계: config.sh 작성 후 다시 ./setup.sh 실행하거나, ./deploy.sh <PUBLIC_IP> 로 배포하세요.${NC}"
    exit 0
fi

# config 재로드 (EC2용 변수)
source "$SCRIPT_DIR/config.sh"

echo -e "${GREEN}${PROJECT_DISPLAY_NAME} EC2 인스턴스 생성 시작${NC}"

# 동일 이름(태그) 실행 중인 인스턴스가 있으면 재사용
EXISTING_INSTANCE=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=${PROJECT_NAME}-server" "Name=instance-state-name,Values=running" --query 'Reservations[0].Instances[0].InstanceId' --output text 2>/dev/null)
if [[ -n "$EXISTING_INSTANCE" && "$EXISTING_INSTANCE" != "None" ]]; then
    echo -e "${GREEN}이미 동일 이름의 실행 중인 인스턴스가 있습니다. 생략합니다.${NC}"
    INSTANCE_ID="$EXISTING_INSTANCE"
    PUBLIC_IP=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    ALLOCATION_ID=$(aws ec2 describe-addresses --filters "Name=instance-id,Values=$INSTANCE_ID" --query 'Addresses[0].AllocationId' --output text 2>/dev/null) || ALLOCATION_ID="(기존 할당)"
    echo -e "${GREEN}=== 통합 설정 완료 (기존 인스턴스 사용) ===${NC}"
    echo "  - Instance ID: $INSTANCE_ID"
    echo "  - Public IP: $PUBLIC_IP"
    echo "  - SSH: ssh -i $KEY_PATH/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
    mkdir -p "$KEY_PATH"
    {
      echo "${PROJECT_DISPLAY_NAME} EC2 인스턴스 정보 (기존 인스턴스)"
      echo "====================================="
      echo "Instance ID: $INSTANCE_ID"
      echo "Public IP: $PUBLIC_IP"
      echo "SSH: ssh -i $KEY_PATH/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
      echo "생성 시간: $(date)"
    } > "$KEY_PATH/connection-info.txt"
    echo -e "${GREEN}연결 정보: $KEY_PATH/connection-info.txt${NC}"
    echo -e "${YELLOW}다음 단계: ./deploy.sh $PUBLIC_IP${NC}"
    exit 0
fi

mkdir -p $KEY_PATH

# 키 페어
echo -e "${YELLOW}키 페어 확인 중...${NC}"
if aws ec2 describe-key-pairs --key-names $KEY_NAME &> /dev/null; then
    if [ ! -f "$KEY_PATH/$KEY_NAME.pem" ]; then
        echo -e "${RED}로컬 키 파일이 없습니다: $KEY_PATH/$KEY_NAME.pem${NC}"
        echo -e "${YELLOW}이 키는 최초 생성 시에만 다운로드됩니다. 기존 키 페어를 AWS에서 삭제한 뒤 새로 생성하거나, 키를 처음 생성한 PC의 $KEY_PATH/$KEY_NAME.pem 을 이 폴더로 복사하세요.${NC}"
        echo ""
        read -p "기존 키 페어를 삭제하고 새로운 키 페어를 생성하시겠습니까? (y/N): " CREATE_NEW_KEY
        if [ "$CREATE_NEW_KEY" = "y" ] || [ "$CREATE_NEW_KEY" = "Y" ]; then
            aws ec2 delete-key-pair --key-name $KEY_NAME
            echo -e "${GREEN}기존 키 페어를 삭제했습니다. 새 키 페어를 생성합니다.${NC}"
            aws ec2 create-key-pair --key-name $KEY_NAME --query 'KeyMaterial' --output text > $KEY_PATH/$KEY_NAME.pem
            chmod 400 $KEY_PATH/$KEY_NAME.pem
            echo -e "${GREEN}키 페어 생성 완료: $KEY_PATH/$KEY_NAME.pem${NC}"
        else
            echo -e "${YELLOW}키 파일을 복사한 뒤 다시 ./setup.sh 를 실행하세요.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}키 페어가 이미 존재합니다: $KEY_NAME${NC}"
    fi
else
    aws ec2 create-key-pair --key-name $KEY_NAME --query 'KeyMaterial' --output text > $KEY_PATH/$KEY_NAME.pem
    chmod 400 $KEY_PATH/$KEY_NAME.pem
    echo -e "${GREEN}키 페어 생성 완료: $KEY_PATH/$KEY_NAME.pem${NC}"
fi

# 보안 그룹
echo -e "${YELLOW}보안 그룹 확인 중...${NC}"
SG_ID=$(aws ec2 describe-security-groups --group-names "$SECURITY_GROUP" --query 'SecurityGroups[0].GroupId' --output text 2>&1) || true
if [[ ! "$SG_ID" =~ ^sg- ]]; then
    [ -n "$SG_ID" ] && echo -e "${YELLOW}기존 보안 그룹 없음 또는 조회 실패: $SG_ID${NC}"
    SG_ID=""
fi
if [ -z "$SG_ID" ] || [ "$SG_ID" = "None" ]; then
    echo -e "${YELLOW}보안 그룹 생성 중...${NC}"
    SG_ID=$(aws ec2 create-security-group --group-name "$SECURITY_GROUP" --description "Security group for $PROJECT_NAME app" --query 'GroupId' --output text)
fi
echo -e "${GREEN}보안 그룹 ID: $SG_ID${NC}"

echo -e "${YELLOW}인바운드 규칙 설정 중...${NC}"
for port in "${REQUIRED_PORTS[@]}"; do
    case $port in
        22) port_name="SSH";; 80) port_name="HTTP";; 443) port_name="HTTPS";;
        3000) port_name="API";; 8000) port_name="AI API";; 5432) port_name="PostgreSQL";;
        *) port_name="Port $port";;
    esac
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port $port --cidr 0.0.0.0/0 &> /dev/null || true
done
echo -e "${GREEN}보안 그룹 규칙 설정 완료${NC}"

# EC2 인스턴스
echo -e "${YELLOW}EC2 인스턴스 생성 중...${NC}"
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SG_ID \
    --block-device-mappings "[{\"DeviceName\":\"/dev/sda1\",\"Ebs\":{\"VolumeSize\":$EBS_VOLUME_SIZE,\"VolumeType\":\"$EBS_VOLUME_TYPE\",\"DeleteOnTermination\":true}}]" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$PROJECT_NAME-server},{Key=Project,Value=$PROJECT_NAME}]" \
    --query 'Instances[0].InstanceId' --output text)
echo -e "${GREEN}인스턴스 생성 완료: $INSTANCE_ID${NC}"

echo -e "${YELLOW}인스턴스 실행 대기 중...${NC}"
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Elastic IP
echo -e "${YELLOW}Elastic IP 할당 중...${NC}"
ALLOCATION_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOCATION_ID
aws ec2 create-tags --resources $ALLOCATION_ID --tags Key=Project,Value=$PROJECT_NAME Key=Name,Value=$PROJECT_NAME-elastic-ip

PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo -e "${GREEN}Elastic IP 할당 완료: $PUBLIC_IP${NC}"

echo -e "${GREEN}=== 통합 설정 완료 ===${NC}"
echo "  - Instance ID: $INSTANCE_ID"
echo "  - Public IP: $PUBLIC_IP (Elastic IP)"
echo "  - SSH: ssh -i $KEY_PATH/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
echo "  - 보안 그룹: $SECURITY_GROUP ($SG_ID)"

mkdir -p "$KEY_PATH"
{
  echo "${PROJECT_DISPLAY_NAME} EC2 인스턴스 정보"
  echo "====================================="
  echo "Instance ID: $INSTANCE_ID"
  echo "Public IP: $PUBLIC_IP (Elastic IP)"
  echo "Elastic IP Allocation ID: $ALLOCATION_ID"
  echo "SSH: ssh -i $KEY_PATH/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
  echo "보안 그룹: $SECURITY_GROUP ($SG_ID)"
  echo "생성 시간: $(date)"
} > "$KEY_PATH/connection-info.txt"

echo -e "${GREEN}연결 정보: $KEY_PATH/connection-info.txt${NC}"
echo -e "${YELLOW}다음 단계: ./deploy.sh $PUBLIC_IP${NC}"