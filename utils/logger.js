const info = (...params) => {
  console.log(...params)
}

const errorLog = (...params) => {
  console.error(...params)
}

export { info, errorLog }