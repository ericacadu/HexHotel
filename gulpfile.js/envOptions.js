const srcPath = './app'
const distPath = './dist'
const nodePath = './node_modules'

const envOptions = {
  string: 'env',
  default: {
    env: 'dev'
  },
  html: {
    src: [
      `${srcPath}/**/*.html`,
      `${srcPath}/**/*.pug`,
      `!${srcPath}/**/_*.pug`
    ],
    path: distPath,
    layoutSrc: `${srcPath}/**/_*.pug`
  },
  style: {
    src: [
      `${srcPath}/assets/css/**/*.scss`,
      `${srcPath}/assets/css/**/*.sass`
    ],
    path: `${distPath}/assets/css`
  },
  javascript: {
    src: [
      `${srcPath}/assets/scripts/**/*.js`
    ],
    concat: 'all.js',
    path: `${distPath}/assets/scripts`
  },
  vendors: {
    src: [
      // `${nodePath}/jquery/dist/**/jquery.min.js`,
      `${nodePath}/axios/dist/**/axios.min.js`,
    ],
    concat: 'vendors.js',
    path: `${distPath}/assets/scripts`
  },
  img: {
    src: [
      `${srcPath}/assets/images/**/*`
    ],
    path: `${distPath}/assets/images`
  },
  clean: {
    src: distPath
  },
  browserDir: distPath,
  deploySrc: `${distPath}/**/*`
}

exports.envOptions = envOptions
