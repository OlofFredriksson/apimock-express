# CHANGELOG

## [2.6.1](https://github.com/Forsakringskassan/apimock-express/compare/v2.6.0...v2.6.1) (2025-09-18)

### Bug Fixes

* do not append fix for malformed export if it returns a string ([f0791e5](https://github.com/Forsakringskassan/apimock-express/commit/f0791e502b838679a26557ad1d7c3d6587e13d50))

## [2.6.0](https://github.com/Forsakringskassan/apimock-express/compare/v2.5.0...v2.6.0) (2025-09-17)

### Features

* appendBasePath, append a prefix to your mock urls ([4bd3c78](https://github.com/Forsakringskassan/apimock-express/commit/4bd3c789fc1b1f01dd2e9777850dd2c420e70538))

### Bug Fixes

* api path incorrent in windows env (refs SB-4982) ([b8c82e0](https://github.com/Forsakringskassan/apimock-express/commit/b8c82e060ea17f636f1fad7a1034a353c66cf3d9))
* transform to pathToFileURL before import of file ([af507f0](https://github.com/Forsakringskassan/apimock-express/commit/af507f08f8dbd617be767f0fe4d87f8ab68f346a))

## [2.5.0](https://github.com/Forsakringskassan/apimock-express/compare/v2.4.0...v2.5.0) (2025-09-15)

### Features

* normalize response when using selectResponse (refs SB-4982) ([176b992](https://github.com/Forsakringskassan/apimock-express/commit/176b992f35274685b6d5afdee6d6dcc4e69cce23))
* support ESM mocks ([ffdfb9b](https://github.com/Forsakringskassan/apimock-express/commit/ffdfb9b6124d94ce6bc3ed56b67793e069fc5102))

### Bug Fixes

* should be able to pass full url when using matchResponseBrowser ([594cd46](https://github.com/Forsakringskassan/apimock-express/commit/594cd460807bcc3bd0f4a3d3fd475bda452878b0))

## [2.4.0](https://github.com/Forsakringskassan/apimock-express/compare/v2.3.0...v2.4.0) (2025-09-12)

### Features

* support .cjs-files ([e3f3708](https://github.com/Forsakringskassan/apimock-express/commit/e3f3708dcce9ec45b0344326bd032fc534eb3a3b))

## [2.3.0](https://github.com/Forsakringskassan/apimock-express/compare/v2.2.0...v2.3.0) (2025-06-30)

### Features

* **deps:** support vite v7 ([0d43750](https://github.com/Forsakringskassan/apimock-express/commit/0d43750a88f08a0a212e662b7bf64ef8214dd57b))

## [2.2.0](https://github.com/Forsakringskassan/apimock-express/compare/v2.1.1...v2.2.0) (2025-04-16)

### Features

* matchResponseBrowser ([fd4fdb7](https://github.com/Forsakringskassan/apimock-express/commit/fd4fdb72302cab2824e7215165f82075370a6061))

## [2.1.1](https://github.com/Forsakringskassan/apimock-express/compare/v2.1.0...v2.1.1) (2025-04-11)

### Bug Fixes

* matchResponse should support POST-method ([7a46b95](https://github.com/Forsakringskassan/apimock-express/commit/7a46b959e913328a81cd1303ab70f81892a5ea6e))

## [2.1.0](https://github.com/Forsakringskassan/apimock-express/compare/v2.0.3...v2.1.0) (2025-04-07)

### Features

* match-response ([8376200](https://github.com/Forsakringskassan/apimock-express/commit/8376200539d322bc8c7d7e7d96879e3c1463263b))

## [2.0.3](https://github.com/Forsakringskassan/apimock-express/compare/v2.0.2...v2.0.3) (2025-04-04)

### Bug Fixes

* helpers should be able to import both in browser and node ([6db770c](https://github.com/Forsakringskassan/apimock-express/commit/6db770c43af1a0431a188c905c6b545cd18ed7e1))

## [2.0.2](https://github.com/Forsakringskassan/apimock-express/compare/v2.0.1...v2.0.2) (2025-01-17)

### Bug Fixes

* **deps:** update dependency glob to v11.0.1 ([f9633bf](https://github.com/Forsakringskassan/apimock-express/commit/f9633bfb6e7f7c7801d2318270c4d66c87ec32e0))

## [2.0.1](https://github.com/Forsakringskassan/apimock-express/compare/v2.0.0...v2.0.1) (2024-12-20)

### Bug Fixes

* **deps:** update dependency debug to v4.4.0 ([26312eb](https://github.com/Forsakringskassan/apimock-express/commit/26312ebc2aca8f8446d691d24cd0527450f75b45))

## [2.0.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.6.0...v2.0.0) (2024-12-03)


### ⚠ BREAKING CHANGES

* **deps:** requires nodejs v20 or later

### Features

* **deps:** requires nodejs v20 or later ([fe51deb](https://github.com/Forsakringskassan/apimock-express/commit/fe51deb90f00ee1129b1998d0f34ada62b3ac020))
* **deps:** update dependency glob to v11 ([ae6eb8a](https://github.com/Forsakringskassan/apimock-express/commit/ae6eb8ac501bb417a581d82bd3fd4cce916d5d21))

## [1.6.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.5.0...v1.6.0) (2024-11-29)


### Features

* **deps:** support vite v6 ([1621431](https://github.com/Forsakringskassan/apimock-express/commit/1621431d33b0f6df14c6f430962c048d45e1a55d))

## [1.5.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.4.2...v1.5.0) (2024-10-08)


### Features

* add browser entrypoint ([56a976f](https://github.com/Forsakringskassan/apimock-express/commit/56a976f48194a51c2b4a732c9d439b21fd043e1f))
* export `selectResponse` function ([bfc2fc9](https://github.com/Forsakringskassan/apimock-express/commit/bfc2fc9adc16a45782ed51378a511c8e78866886))


### Bug Fixes

* print proper path in debug log ([883ee20](https://github.com/Forsakringskassan/apimock-express/commit/883ee2035fdadb062f6812be6e9e393ea36abd55))

## [1.4.2](https://github.com/Forsakringskassan/apimock-express/compare/v1.4.1...v1.4.2) (2024-09-13)


### Bug Fixes

* **deps:** update dependency debug to v4.3.7 ([5c5380e](https://github.com/Forsakringskassan/apimock-express/commit/5c5380ead53e3a130406ac1741d36d51a4f48e5d))

## [1.4.1](https://github.com/Forsakringskassan/apimock-express/compare/v1.4.0...v1.4.1) (2024-09-07)


### Bug Fixes

* fix esm named export for `vitePlugin` ([b80c6bd](https://github.com/Forsakringskassan/apimock-express/commit/b80c6bd28c6135cfb7c8ee821302c71fdc33b9f7))

## [1.4.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.3.2...v1.4.0) (2024-08-28)


### Features

* **deps:** require nodejs 18 or later ([717e6cb](https://github.com/Forsakringskassan/apimock-express/commit/717e6cb77cdaf87440282a2154341e2fe95f8556))

## [1.3.2](https://github.com/Forsakringskassan/apimock-express/compare/v1.3.1...v1.3.2) (2024-08-02)


### Bug Fixes

* **deps:** update dependency debug to v4.3.6 ([06e564e](https://github.com/Forsakringskassan/apimock-express/commit/06e564e569e61111618eb9b1428cb48838561f20))

## [1.3.1](https://github.com/Forsakringskassan/apimock-express/compare/v1.3.0...v1.3.1) (2024-07-13)


### Bug Fixes

* **deps:** update debug to v4.3.2 or later ([79fdc16](https://github.com/Forsakringskassan/apimock-express/commit/79fdc16747a2589ce879c7c5135e773fe1849f56))

## [1.3.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.2.5...v1.3.0) (2024-07-13)


### Features

* **vite:** configurable which commands to enable mocks for ([ef4ba33](https://github.com/Forsakringskassan/apimock-express/commit/ef4ba33e239f333fa35a58ecf72cf725987eb3d3))


### Bug Fixes

* **deps:** update dependency glob to v10.4.4 ([2cc46fb](https://github.com/Forsakringskassan/apimock-express/commit/2cc46fbc329e2cf63be7ca7219a110edd11e0f87))
* **deps:** update dependency glob to v10.4.5 ([508074f](https://github.com/Forsakringskassan/apimock-express/commit/508074f4bdd4d76a4d22ff06f49af090cde9b5c1))
* **typescript:** fix lack to default export in typescript typings ([cfd8e3d](https://github.com/Forsakringskassan/apimock-express/commit/cfd8e3d3130f31760c912b080d01a81e64878647))
* **vite:** enable mocks in preview mode ([572b030](https://github.com/Forsakringskassan/apimock-express/commit/572b030d7b68350fcd2901a2f2bd5bcaeb6af548))

## [1.2.5](https://github.com/Forsakringskassan/apimock-express/compare/v1.2.4...v1.2.5) (2024-07-12)


### Bug Fixes

* **deps:** update dependency glob to v10.4.3 ([3603f7e](https://github.com/Forsakringskassan/apimock-express/commit/3603f7ea813bfb76c56842643ae05693bb360e7b))

## [1.2.4](https://github.com/Forsakringskassan/apimock-express/compare/v1.2.3...v1.2.4) (2024-06-28)


### Bug Fixes

* **deps:** update dependency glob to v10.4.2 ([2ab4496](https://github.com/Forsakringskassan/apimock-express/commit/2ab4496e73282bcd9ade298f1f66ada4a5555e70))

## [1.2.3](https://github.com/Forsakringskassan/apimock-express/compare/v1.2.2...v1.2.3) (2024-06-07)


### Bug Fixes

* **deps:** update dependency debug to v4.3.5 ([9de73f9](https://github.com/Forsakringskassan/apimock-express/commit/9de73f9c769cbb826bd9773269e9a9048649fb3f))

## [1.2.2](https://github.com/Forsakringskassan/apimock-express/compare/v1.2.1...v1.2.2) (2024-05-31)


### Bug Fixes

* **deps:** update dependency glob to v10.3.16 ([60dbb64](https://github.com/Forsakringskassan/apimock-express/commit/60dbb64e171f42428d2ca1965b41e589c4f89430))
* **deps:** update dependency glob to v10.4.0 ([5da6c6c](https://github.com/Forsakringskassan/apimock-express/commit/5da6c6c74a34c797a8eee0244d5926e5b96cb815))
* **deps:** update dependency glob to v10.4.1 ([2bccb7d](https://github.com/Forsakringskassan/apimock-express/commit/2bccb7de40b5bc6c8b8bd96c718954bc07cbf698))

## [1.2.1](https://github.com/Forsakringskassan/apimock-express/compare/v1.2.0...v1.2.1) (2024-05-17)


### Bug Fixes

* **deps:** update dependency glob to v10.3.14 ([1dce60e](https://github.com/Forsakringskassan/apimock-express/commit/1dce60e806a37482c7fd3bf718d48277bb3827a2))
* **deps:** update dependency glob to v10.3.15 ([9c138df](https://github.com/Forsakringskassan/apimock-express/commit/9c138df6c43bdff204a0c056bfa9a207f9eaa16f))

## [1.2.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.1.0...v1.2.0) (2024-04-06)


### Features

* **deps:** update dependency glob to v10 ([62cd8a6](https://github.com/Forsakringskassan/apimock-express/commit/62cd8a6b862901f0180c522ec0a312be5bf6759c))

## [1.1.0](https://github.com/Forsakringskassan/apimock-express/compare/v1.0.0...v1.1.0) (2024-03-07)


### Features

* add Vite plugin ([8fe81ee](https://github.com/Forsakringskassan/apimock-express/commit/8fe81ee95e2ed52de541c14b36fe5f7f77ba9b8e))


### Bug Fixes

* **deps:** update dependency glob to v7.2.3 ([685b376](https://github.com/Forsakringskassan/apimock-express/commit/685b376e6cefcb52aaf9966c6c37ec7528f06f43))

## 1.0.0 (2024-03-05)


### Features

* initial public version ([cb23d18](https://github.com/Forsakringskassan/apimock-express/commit/cb23d18692acef70dcd05b8e112bb111f08d51e5))
