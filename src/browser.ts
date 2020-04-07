interface UnitMap {
  desc: string;
  html: string[];
  callback: Function;
}

const items: UnitMap[] = [];

const describe = (desc: string, html: string[] = [], callback: Function) => {
  items.push({
    desc,
    callback,
    html,
  })
}

;(window as any).describe = describe

type AssertFN = () => boolean;
const assert = (callback: AssertFN, msg: string) => {
  try {
    if (callback()) {
      return true
    } else {
      throw new Error(msg)
    }
  } catch (e) {
    throw new Error(msg)
  }
}

;(window as any).assert = assert

const HTML_FILE_RE = /\.html$/

window.onload = async () => {
  let i = 0;
  const length = items.length
  const $display = $('#display')
  const $error = $('#error')
  const $success = $('#success')

  for (; i < length; i++) {
    $display.html('')
    $success.html('')
    $error.html('')
    const item = items[i]
    const data: string[] = []
    if (item.html.length > 0) {
      const items: string[] = await Promise.all(
        item.html.map((name) => {
          if (HTML_FILE_RE.test(name)) {
            return $.ajax(`/html?name=${name}`)
          }
          return name
        })
      )
      items.forEach(item => data.push(item))
      $display.html(data.join(''))
    }
    try {
      item.callback(data.join(''))
      $success.html(`${item.desc} 通过`)
    } catch (e) {
      $error.html(`${item.desc} 不通过, 失败原因: ${e.message}`)
      break
    }
  }
}