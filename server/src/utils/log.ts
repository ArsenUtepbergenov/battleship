export default abstract class Log {
  public static it(text: string, color: number = 0) {
    const begin = text.indexOf('%')
    const end = text.indexOf(' ', begin)
    let coloredPart = ''

    if (begin === -1) {
      process.stdout.write(text)
      return
    }
    coloredPart = end === -1 ? text.slice(begin + 1) : text.slice(begin + 1, end)
    let result = text.replace(coloredPart, `\u001b[${color}m${coloredPart}\u001b[0m`)

    process.stdout.write(`${result.replace('%', '')}\n`)
  }
}
