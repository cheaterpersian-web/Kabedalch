#!/usr/bin/env bash
set -euo pipefail

BLUE='\033[1;34m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; RED='\033[1;31m'; NC='\033[0m'

say() { echo -e "${BLUE}==>${NC} $*"; }
ok() { echo -e "${GREEN}✔${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }
err() { echo -e "${RED}✖${NC} $*"; }

compose() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    err "Docker Compose not found. Install Docker Desktop or docker-compose."
    exit 1
  fi
}

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

say "Checking prerequisites..."
if ! command -v docker >/dev/null 2>&1; then err "Docker is required"; exit 1; fi
ok "Docker found: $(docker --version | cut -d',' -f1)"

API_ENV="$ROOT_DIR/apps/api/.env"
API_ENV_EX="$ROOT_DIR/apps/api/.env.example"
if [ ! -f "$API_ENV" ]; then
  say "Creating API .env from example..."
  cp "$API_ENV_EX" "$API_ENV"
fi

# Generate encryption key if empty
if ! grep -q "^DATA_ENCRYPTION_KEY=" "$API_ENV" || [ -z "$(grep '^DATA_ENCRYPTION_KEY=' "$API_ENV" | cut -d'=' -f2-)" ]; then
  say "Generating DATA_ENCRYPTION_KEY (32 bytes base64)..."
  KEY=$(openssl rand -base64 32)
  if grep -q "^DATA_ENCRYPTION_KEY=" "$API_ENV"; then
    sed -i.bak "s|^DATA_ENCRYPTION_KEY=.*|DATA_ENCRYPTION_KEY=$KEY|" "$API_ENV"
  else
    printf "\nDATA_ENCRYPTION_KEY=%s\n" "$KEY" >> "$API_ENV"
  fi
  ok "DATA_ENCRYPTION_KEY set"
fi

# Create web env
WEB_ENV="$ROOT_DIR/apps/web/.env.local"
if [ ! -f "$WEB_ENV" ]; then
  say "Creating web .env.local..."
  cat > "$WEB_ENV" <<EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Optional
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_HCAPTCHA_SITEKEY=
EOF
  ok "Created apps/web/.env.local"
fi

say "Starting services with Docker Compose (you can override WEB_PORT/API_PORT)..."
WEB_PORT=${WEB_PORT:-3000}
API_PORT=${API_PORT:-3001}
export WEB_PORT API_PORT
compose up -d --build
ok "Services are starting"

say "Waiting for Postgres to become ready..."
TRIES=0
until compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
  TRIES=$((TRIES+1))
  if [ $TRIES -gt 60 ]; then err "Postgres not ready after 60s"; exit 1; fi
  sleep 1
  printf '.'
done
echo
ok "Postgres is ready"

say "Applying Prisma migrations..."
compose exec -T api npx prisma migrate deploy
ok "Migrations applied"

say "Seeding database (dev only)..."
compose exec -T api npm run prisma:seed || warn "Seed script returned non-zero (might already be seeded)"
ok "Seed complete"

say "Creating admin user (admin@example.com / Admin@123)..."
compose exec -T api node -e "(async()=>{const bcrypt=require('bcrypt');const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();const pw=await bcrypt.hash('Admin@123',10);await p.user.upsert({where:{email:'admin@example.com'},update:{role:'admin'},create:{name:'ادمین',family:'سیستم',phone:'09999999999',email:'admin@example.com',passwordHash:pw,role:'admin'}});console.log('admin ready');process.exit(0)})()" || warn "Admin creation skipped"
ok "Admin ready"

say "URLs"
echo "- Web:      ${GREEN}http://localhost:${WEB_PORT}${NC}"
echo "- API Docs: ${GREEN}http://localhost:${API_PORT}/api/docs${NC}"
echo "- MinIO:    ${GREEN}http://localhost:9001${NC} (user/pass: minioadmin/minioadmin)"

ok "Setup complete. Login with admin@example.com / Admin@123"
