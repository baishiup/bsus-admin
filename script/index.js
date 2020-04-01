const fs = require('fs');
const path = require('path');
const args = require('./getArgList')();

const environment = `// 构建时生成
export default{ 
    qiniuUrl: 'https://up-z2.qiniup.com',
    cdnUrl: 'https://cdn.baishiup.com',
    host:'${args.host || 'http://localhost:3000'}'
}`;
console.log(args);
console.log(environment);

fs.writeFileSync(path.resolve(__dirname, '../src/environment.ts'), environment);
