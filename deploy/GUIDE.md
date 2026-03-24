# deploy 활용 가이드

이 문서는 **deploy** 템플릿으로 프로젝트를 AWS EC2에 올리고, fornerds 팀 GitHub 저장소와 연동하는 **전체 흐름**을 단계별로 안내합니다.

---

## 1. 사전 준비

| 항목 | 설명 |
|------|------|
| **실행 환경** | Windows는 Git Bash 또는 WSL 필요. macOS/Linux는 터미널에서 바로 실행 가능. |
| **config.sh** | 프로젝트마다 한 번 설정. AWS 설정은 **수정 금지**. |
| **.gitignore** | `deploy_v2/config.sh`, `deploy_v2/keys/` 추가하여 비밀 정보 커밋 방지. |

---

## 2. 최초 1회: 설정 및 인프라 만들기

### 2-1. config.sh 수정

`deploy` 폴더의 `config.sh`를 열어 **아래만** 프로젝트에 맞게 수정합니다.

- **PROJECT_NAME**: 소문자, 하이픈 사용 (예: `my-app`)
- **PROJECT_DISPLAY_NAME**: 화면에 보일 이름 (예: `My App`)
- **GITHUB_TOKEN**: 비공개 저장소일 때만 필요. [GitHub → Settings → Developer settings → Personal access tokens]에서 발급.

**변경하지 말 것**: `AWS_ACCOUNT_ID`, `AWS_IAM_USERNAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_OUTPUT_FORMAT`

### 2-2. setup.sh 실행

프로젝트 루트 또는 `deploy` 폴더에서:

```bash
chmod +x setup.sh
./setup.sh
```

**진행 순서**:

1. **GitHub CLI(gh)**  
   - 미설치 시 자동 설치 후 `gh auth login` 안내.  
   - 로그인 완료 후 다음 단계로 진행.

2. **fornerds 팀 저장소 생성 및 푸시**  
   - "fornerds/&lt;PROJECT_NAME&gt; 레포를 만들고 코드를 푸시할까요? (y/N)"  
   - `y` 입력 시:  
     - 저장소 없음 → `gh repo create` 후 푸시  
     - 저장소 있음 → `origin` 설정 후 푸시  
   - 이미 커밋된 상태면 "이미 커밋된 상태입니다. 푸시만 진행합니다." 후 푸시만 수행.

3. **AWS CLI**  
   - 미설정 시 설치 및 자격 증명 설정. 이미 설정돼 있으면 건너뜀.

4. **EC2 인스턴스 생성**  
   - `config.sh`가 있으면 키 페어·보안 그룹·EC2·Elastic IP 생성.  
   - 완료 시 **Public IP**와 `keys/<PROJECT_NAME>-key.pem` 경로가 출력됨.

**키 페어가 이미 AWS에만 있고 로컬에 .pem이 없는 경우**  
- "기존 키 페어를 삭제하고 새로운 키 페어를 생성하시겠습니까? (y/N)"  
- `y` → 기존 키 삭제 후 새로 생성. `n` → 키 파일을 처음 생성한 PC에서 복사한 뒤 다시 `./setup.sh` 실행.

---

## 3. 배포하기

setup.sh 완료 후 출력된 **Public IP**를 사용합니다.

```bash
./deploy.sh <PUBLIC_IP>
```

예: `./deploy.sh 1.23.456.789`

**동작 요약**:

1. EC2 접속 테스트  
2. 서버 환경 설정 (시간대, Docker, NVM/Node, Python, Flutter 등)  
3. GitHub에서 프로젝트 클론 (토큰 있으면 자동으로 인증 URL 사용)  
4. Docker Compose·Nginx 설정 파일 복사  
5. 백엔드·프론트엔드 빌드 및 컨테이너 기동  
6. 접속 정보 및 `keys/deployment-info.txt` 출력  

배포가 끝나면 `deployment-info.txt`에 웹 URL, SSH 접속 방법이 저장됩니다.

---

## 4. 자주 쓰는 명령어

| 목적 | 명령어 |
|------|--------|
| 설정·EC2까지 한 번에 | `./setup.sh` |
| 배포만 다시 실행 | `./deploy.sh <PUBLIC_IP>` |
| EC2 SSH 접속 | `ssh -i keys/<PROJECT_NAME>-key.pem ubuntu@<PUBLIC_IP>` |
| 배포 정보 확인 | `keys/deployment-info.txt` 또는 `keys/connection-info.txt` |

---

## 5. 폴더 구조 권장

프로젝트 루트에 `deploy`를 두고 사용하는 형태를 가정합니다.

```
프로젝트_루트/
├── deploy/
│   ├── config.sh    # 비밀 포함 → .gitignore
│   ├── keys/        # .pem 등 → .gitignore
│   ├── setup.sh
│   ├── deploy.sh
│   ├── docker-compose.yml
│   └── nginx.conf
├── backend/         # NestJS, FastAPI 등
├── frontend/        # React, Flutter 등
└── ...
```

다른 위치에 두어도 되며, `setup.sh`는 스크립트 기준 디렉터리(`SCRIPT_DIR`)를 사용해 `config.sh`와 EC2 단계를 처리합니다.

---

## 6. 문제 해결

| 현상 | 확인 사항 |
|------|-----------|
| "키 파일을 찾을 수 없습니다" | `keys/<PROJECT_NAME>-key.pem` 존재 여부. 없으면 setup.sh에서 키 재생성하거나 다른 PC에서 복사. |
| Git 클론 실패 | 비공개 저장소면 `config.sh`의 `GITHUB_TOKEN` 설정. `gh auth login` 상태 확인. |
| "config.sh가 없어 EC2 생성은 건너뜁니다" | `deploy` 폴더에서 실행했는지, 또는 `config.sh`가 `SCRIPT_DIR` 기준으로 있는지 확인. |
| Windows에서 .sh 실행 안 됨 | Git Bash 또는 WSL에서 실행. PowerShell에서는 `.\setup.sh` 불가. |

---

## 7. 참고

- **공개 저장소**: `GITHUB_TOKEN` 없이도 클론 가능. 있으면 토큰 포함 URL로 클론.
- **비공개 저장소**: `GITHUB_TOKEN` 필수. config.sh에 Personal Access Token 설정.
- **포트**: `config.sh`의 `REQUIRED_PORTS`에서 프로젝트에 맞게 불필요한 포트는 삭제해도 됨.
- 상세 옵션·설정 설명은 **README.md**를 참고하세요.
