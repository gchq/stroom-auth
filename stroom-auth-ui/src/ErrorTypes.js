export function HttpError(status, text){
  this.status = status
  this.message = text
  this.stack = (new Error()).stack
}

HttpError.prototype = Object.create(Error.prototype)
HttpError.prototype.constructor = HttpError