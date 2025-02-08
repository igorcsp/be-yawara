warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/middleware/auth.js b/middleware/auth.js[m
[1mindex 3835897..7cb92b0 100644[m
[1m--- a/middleware/auth.js[m
[1m+++ b/middleware/auth.js[m
[36m@@ -2,7 +2,10 @@[m [mconst jwt = require('jsonwebtoken')[m
 const config = require('config')[m
 [m
 module.exports = function (req, res, next) {[m
[31m-    const token = req.header('yawara-token')[m
[32m+[m[32m    const authHeader = req.header("Authorization");[m
[32m+[m[32m    if (!authHeader) return res.status(401).send("Access denied. No token provided.");[m
[32m+[m
[32m+[m[32m    const token = authHeader.split(" ")[1];[m
     if (!token) return res.status(401).send('Acess denied. No token provided.')[m
 [m
     try {[m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex f7d6eb2..3b502b7 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -19,6 +19,7 @@[m
         "jsonwebtoken": "^9.0.2",[m
         "lodash": "^4.17.21",[m
         "mongoose": "^8.9.5",[m
[32m+[m[32m        "multer": "^1.4.5-lts.1",[m
         "winston": "^3.17.0",[m
         "winston-mongodb": "^6.0.0"[m
       },[m
[36m@@ -1353,6 +1354,12 @@[m
         "node": ">= 8"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/append-field": {[m
[32m+[m[32m      "version": "1.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/append-field/-/append-field-1.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-klpgFSWLW1ZEs8svjfb7g4qWY0YS5imI82dTg+QahUvJ8YqAY0P10Uk8tTyh9ZGuYEZEMaeJYCF5BFuX552hsw==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/aproba": {[m
       "version": "2.0.0",[m
       "resolved": "https://registry.npmjs.org/aproba/-/aproba-2.0.0.tgz",[m
[36m@@ -1674,9 +1681,19 @@[m
       "version": "1.1.2",[m
       "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",[m
       "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",[m
[31m-      "dev": true,[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/busboy": {[m
[32m+[m[32m      "version": "1.6.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/busboy/-/busboy-1.6.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "streamsearch": "^1.1.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=10.16.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/bytes": {[m
       "version": "3.1.2",[m
       "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",[m
[36m@@ -2080,6 +2097,51 @@[m
       "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/concat-stream": {[m
[32m+[m[32m      "version": "1.6.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/concat-stream/-/concat-stream-1.6.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-27HBghJxjiZtIk3Ycvn/4kbJk/1uZuJFfuPEns6LaEvpvG1f0hTea8lilrouyo9mVc2GWdcEZ8OLoGmSADlrCw==",[m
[32m+[m[32m      "engines": [[m
[32m+[m[32m        "node >= 0.8"[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "buffer-from": "^1.0.0",[m
[32m+[m[32m        "inherits": "^2.0.3",[m
[32m+[m[32m        "readable-stream": "^2.2.2",[m
[32m+[m[32m        "typedarray": "^0.0.6"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/concat-stream/node_modules/readable-stream": {[m
[32m+[m[32m      "version": "2.3.8",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.8.tgz",[m
[32m+[m[32m      "integrity": "sha512-8p0AUk4XODgIewSi0l8Epjs+EVnWiK7NoDIEGU0HhE7+ZyY8D1IMY7odu5lRrFXGg71L15KG8QrPmum45RTtdA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "core-util-is": "~1.0.0",[m
[32m+[m[32m        "inherits": "~2.0.3",[m
[32m+[m[32m        "isarray": "~1.0.0",[m
[32m+[m[32m        "process-nextick-args": "~2.0.0",[m
[32m+[m[32m        "safe-buffer": "~5.1.1",[m
[32m+[m[32m        "string_decoder": "~1.1.1",[m
[32m+[m[32m        "util-deprecate": "~1.0.1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/concat-stream/node_modules/safe-buffer": {[m
[32m+[m[32m      "version": "5.1.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/concat-stream/node_modules/string_decoder": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "safe-buffer": "~5.1.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/config": {[m
       "version": "3.3.12",[m
       "resolved": "https://registry.npmjs.org/config/-/config-3.3.12.tgz",[m
[36m@@ -2148,6 +2210,12 @@[m
       "dev": true,[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/core-util-is": {[m
[32m+[m[32m      "version": "1.0.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-ZQBvi1DcpJ4GDqanjucZ2Hj3wEO5pZDS89BWbkcrvdxksJorwUDDZamX9ldFkp9aw2lmBDLgkObEA4DWNJ9FYQ==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/cors": {[m
       "version": "2.8.5",[m
       "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.5.tgz",[m
[36m@@ -3221,6 +3289,12 @@[m
         "url": "https://github.com/sponsors/sindresorhus"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/isarray": {[m
[32m+[m[32m      "version": "1.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/isexe": {[m
       "version": "2.0.0",[m
       "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",[m
[36m@@ -4315,6 +4389,15 @@[m
         "node": "*"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/minimist": {[m
[32m+[m[32m      "version": "1.2.8",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",[m
[32m+[m[32m      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/sponsors/ljharb"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/minipass": {[m
       "version": "5.0.0",[m
       "resolved": "https://registry.npmjs.org/minipass/-/minipass-5.0.0.tgz",[m
[36m@@ -4501,6 +4584,36 @@[m
       "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/multer": {[m
[32m+[m