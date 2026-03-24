# AWS EC2 배포 스크립트 템플릿

이 템플릿은 AWS EC2에 프로젝트를 자동으로 배포하기 위한 스크립트 모음입니다.

## 파일 구성

- `config.sh` - 프로젝트별 설정 파일 (AWS 키, GitHub 토큰 등 비밀 포함. **반드시 `.gitignore`에 추가할 것**)
- `setup.sh` - 통합 설정 스크립트 (GitHub CLI + AWS CLI + EC2 인스턴스 생성. 이미 설정된 단계는 생략)
- `deploy.sh` - 프로젝트 배포 스크립트

## GitHub 레포 생성 (최초 1회)

팀 레포(fornerds/hemily)로 올리려면 **GitHub CLI(gh)** 가 필요합니다.  
gh는 Windows, macOS, Linux 모두 **기본 설치되어 있지 않으므로** 아래처럼 먼저 설치해야 합니다.

**1. gh 설치 (OS별)**

- **Windows:** `winget install --id GitHub.cli -e` 또는 https://cli.github.com/ 에서 설치 파일 다운로드
- **macOS:** `brew install gh` (Homebrew 없으면 https://brew.sh 설치 후 실행)
- **Linux:** https://github.com/cli/cli#installation 공식 문서 참고

수동으로 설치한 경우, PATH가 반영되도록 **새 터미널**을 열어야 `gh`를 쓸 수 있습니다.  
**`setup.sh`를 사용하면** 스크립트가 gh·AWS CLI를 설치한 뒤 같은 실행 안에서 바로 사용하므로, 새 터미널을 열 필요 없이 한 번에 진행됩니다.

**2. 로그인**  
`gh auth login` (GitHub.com, HTTPS, 브라우저/토큰 인증). 확인: `gh auth status`

**3. 프로젝트 루트에서 실행**

```powershell
git init
git add .
git commit -m "Initial commit"
gh repo create fornerds/repo-name --private --source=. --remote=origin --push
```

레포가 이미 있으면: `git remote add origin https://github.com/fornerds/repo-name.git` 후 `git push -u origin master`.  
인증 오류면 `gh auth login` 다시 실행.

---

## 사용 방법

### 1. 설정 파일 수정

먼저 `config.sh` 파일을 수정하여 프로젝트별 설정을 입력하세요.  
**주의:** `config.sh` 내 **AWS 설정(AWS_ACCOUNT_ID, AWS_IAM_USERNAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_OUTPUT_FORMAT)은 변경하지 마세요.**  
**추가 주의:** `config.sh`와 `keys/` 폴더에는 비밀 정보가 들어가므로 프로젝트 루트 `.gitignore`에 다음을 추가해 커밋되지 않도록 하세요.

```gitignore
deploy/config.sh
deploy/keys/
```

```bash
# 프로젝트 기본 정보
PROJECT_NAME="project-name"
PROJECT_DISPLAY_NAME="Project Name"

# AWS 설정
AWS_ACCOUNT_ID="account-id"
AWS_ACCESS_KEY_ID="access-key-id"
AWS_SECRET_ACCESS_KEY="secret-access-key"

# GitHub 저장소 설정 (fornerds 팀 레포 고정. PROJECT_NAME만 맞추면 됨)
GITHUB_REPO_URL="https://github.com/fornerds/project-name.git"
GITHUB_TOKEN="github-token"

# 기타 설정들...
```

### 2. 통합 설정 (gh + AWS CLI + EC2)

```bash
chmod +x setup.sh
./setup.sh
```

- **gh** / **AWS CLI**가 이미 설정되어 있으면 해당 단계를 건너뜁니다.
- **config.sh**가 있으면 EC2 인스턴스까지 생성합니다. 없으면 gh + AWS 설정만 하고, config.sh 작성 후 다시 실행하면 EC2가 생성됩니다.

### 3. 프로젝트 배포

```bash
chmod +x deploy.sh
./deploy.sh <PUBLIC_IP>
```

## Windows 환경에서의 실행 방법

Windows PowerShell에서는 `.sh` 파일을 직접 실행할 수 없습니다. 다음 방법 중 하나를 사용하세요:

### 방법 1: Git Bash 사용 (권장)

1. **파일 탐색기 사용**
   - 파일 탐색기에서 `deploy` 폴더를 엽니다
   - 우클릭 → "Git Bash Here" 선택
   - 터미널에서 스크립트 실행:
   ```bash
   ./setup.sh
   ```

2. **VS Code 사용**
   - VS Code에서 터미널 메뉴 선택
   - "새 터미널" → 터미널 오른쪽 상단의 "새 터미널" 드롭다운
   - "Git Bash" 선택
   - 스크립트 실행:
   ```bash
   cd deploy
   chmod +x *.sh
   ./setup.sh
   ```

### 방법 2: WSL 사용

WSL(Windows Subsystem for Linux)이 설치되어 있는 경우:
```powershell
cd deploy
wsl bash ./setup.sh
```

### 방법 3: Git Bash 직접 실행

Git Bash가 설치되어 있다면:
```powershell
"C:\Program Files\Git\bin\bash.exe" ./setup.sh
```

### Git 설치 확인

Git Bash가 설치되어 있지 않은 경우:
```powershell
# 설치 확인
where.exe git-bash
```

설치되지 않았다면 [Git for Windows](https://git-scm.com/downloads)를 다운로드하여 설치하세요.

## 설정 파일 상세 설명

### 필수 설정

- `PROJECT_NAME`: 프로젝트명 (소문자, 하이픈 사용)
- `PROJECT_DISPLAY_NAME`: 표시용 프로젝트명
- `AWS_ACCOUNT_ID`: AWS 계정 ID
- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키
- `GITHUB_REPO_URL`: GitHub 저장소 URL

### 선택적 설정

- `INSTANCE_TYPE`: EC2 인스턴스 타입 (기본값: t3.medium)
- `EBS_VOLUME_SIZE`: EBS 볼륨 크기 (기본값: 50GB)
- `REQUIRED_PORTS`: 필요한 포트 목록
- `CORS_ORIGIN`: CORS 허용 도메인

## 지원하는 서비스 (본 프로젝트)

- **프론트엔드**: Next.js 14 (SSR/정적)
- **웹 서버**: Nginx (리버스 프록시, 80 → 3000)
- **프로세스 관리**: PM2
- **런타임**: Node.js 20 (nvm)

## 보안 그룹 포트


- 22: SSH
- 80: HTTP (Nginx → Next.js 3000, Let's Encrypt 인증 갱신용)
- 443: HTTPS (Nginx → Next.js 3000)
- 3000: Next.js (내부용, Nginx에서 프록시)

## 주의사항

1. **AWS 설정 변경 금지**: `config.sh` 파일의 15~20라인에 위치한 AWS 설정(AWS_ACCOUNT_ID, AWS_IAM_USERNAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_OUTPUT_FORMAT)은 팀 공용 환경을 위한 것이므로 **절대 변경하지 마세요.**
2. **보안**: `config.sh`는 AWS 자격 증명·GitHub 토큰 등이 들어가고, `keys/` 폴더에는 EC2 키 파일이 있으므로 **둘 다 `.gitignore`에 포함**해야 합니다. (예: `deploy/config.sh`, `deploy/keys/`)
3. **비용**: EC2 인스턴스 사용에 따른 비용이 발생합니다
4. **리전**: 기본적으로 서울 리전(ap-northeast-2)을 사용합니다
5. **GitHub 토큰**: Private 저장소의 경우 Personal Access Token이 필요합니다

## 문제 해결

### Windows에서 스크립트가 실행되지 않음
- PowerShell에서는 `.sh` 파일을 직접 실행할 수 없습니다
- Git Bash 또는 WSL을 사용하세요
- 참고: [Windows 환경에서의 실행 방법](#windows-환경에서의-실행-방법)

### AWS CLI 설치 오류
```bash
pip install awscli
```

### AWS 자격 증명 설정
```bash
aws configure
```
또는 `config.sh`에 직접 입력한 후:
```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
```

### 권한 오류
Linux/Mac:
```bash
chmod +x *.sh
```
Windows (Git Bash):
```bash
chmod +x *.sh
```

### 연결 오류
- EC2 인스턴스가 실행 중인지 확인
- 보안 그룹에서 SSH 포트(22)가 열려있는지 확인
- 키 파일 권한이 올바른지 확인 (400)
- Elastic IP가 할당되었는지 확인

## 라이선스

이 템플릿은 MIT 라이선스 하에 제공됩니다.
