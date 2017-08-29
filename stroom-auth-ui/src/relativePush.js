import { push } from 'react-router-redux'

export const relativePush = (path) => {
  const relativePath = process.env.REACT_APP_ROOT_PATH + path
  return push(relativePath)
}

export const relativePath = (path) => {
  const relativePath = process.env.REACT_APP_ROOT_PATH + path
  return relativePath
}