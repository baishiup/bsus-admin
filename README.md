# bsus-admin

## Related projects

[bsus](https://github.com/baishiup/bsus)
[bsus-front](https://github.com/baishiup/bsus-front)

# TODO

# instructions

#### AOT 生成配置/src/environment.ts

> npm run build --host=localhost:3000

```js
// script/index.js
const environment = `// 构建时生成
export default{ 
    qiniuUrl: 'https://up-z2.qiniup.com',
    cdnUrl: 'https://cdn.baishiup.com',
    host:'${args.host || 'http://localhost:3000'}'
}`;
fs.writeFileSync(path.resolve(__dirname, '../src/environment.ts'), environment);
```

```json
// package.json
// ...
"start": "node script && react-app-rewired start",
"build": "node script && react-app-rewired build",
// ...
```

#### 自动构建(本地 jenkins)

```bash
# execute shell
cd /Users/xxxxx/workspace/mywork/bsus-admin
npm run build --host=${host}
cp -r /Users/xxxxx/workspace/mywork/bsus-admin/build/ ${WORKSPACE}/build
```

```bash
# send build artifacts over SSH

# source files
build/**

# exec command
rm -rf /usr/share/nginx/html/bsus-admin
mv ./build /usr/share/nginx/html/bsus-admin
```
