# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com
# 安装项目依赖
RUN npm install
RUN npm i groq-sdk

# 复制项目文件
COPY . .
# 安装 ffmpeg

# 暴露应用端口
EXPOSE 3000

# 运行开发服务器
CMD ["npm", "run", "dev"]