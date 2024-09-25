# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 设置 npm 镜像源为国内镜像，加快依赖下载速度
RUN npm config set registry https://registry.npmmirror.com

# 安装项目依赖
RUN npm ci

# 复制项目文件到容器中
COPY . .

# 构建项目
RUN npm run build

# 暴露应用端口
EXPOSE 3000

# 运行应用
CMD ["npm", "run", "start"]