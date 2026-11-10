# ==============================================================================
# Giai đoạn 1: Biên dịch mã nguồn TypeScript (Builder Stage)
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Sao chép tệp cấu hình package để tận dụng bộ nhớ đệm (Docker cache)
COPY package*.json tsconfig.json ./

# Cài đặt toàn bộ dependencies (bao gồm devDependencies cho việc build TypeScript)
RUN npm ci

# Sao chép toàn bộ mã nguồn
COPY src ./src

# Biên dịch mã nguồn TypeScript sang JavaScript (thư mục dist)
RUN npm run build

# ==============================================================================
# Giai đoạn 2: Môi trường chạy thực tế tối ưu dung lượng (Production Runner)
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Thiết lập biến môi trường chuẩn Production
ENV NODE_ENV=production

# Sao chép tệp package
COPY package*.json ./

# Chỉ cài đặt dependencies cần thiết cho runtime (bỏ qua devDependencies để giảm nhẹ container)
RUN npm ci --omit=dev

# Sao chép bản build đã biên dịch từ giai đoạn builder
COPY --from=builder /app/dist ./dist

# Mở cổng 5000 cho dịch vụ Backend
EXPOSE 5000

# Lệnh khởi chạy máy chủ NodeJS
CMD ["node", "dist/server.js"]

