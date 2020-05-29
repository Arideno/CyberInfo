export const reply = (err, messageInstance, content) => {
  if (err) {
    if (err instanceof Error) {
      console.error('Handled error: ', err.message)
      messageInstance.reply(err.message)
    } else {
      console.error('Unhandled error: ', err)
      messageInstance.reply('Something wrong :( Try again later')
    }
  } else {
    messageInstance.reply(content)
  }
}