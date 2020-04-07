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
  const $display = document.querySelector('#display') as HTMLDivElement
  const $error = document.querySelector('#error') as HTMLDivElement
  const $success = document.querySelector('#success') as HTMLDivElement

  for (; i < length; i++) {
    $display.innerHTML = ''
    $success.innerHTML = ''
    $error.innerHTML = ''
    const item = items[i]
    const data: string[] = []
    if (item.html.length > 0) {
      const items: string[] = await Promise.all(
        item.html.map((name) => {
          if (HTML_FILE_RE.test(name)) {
            return get(name)
          }
          return name
        })
      )
      items.forEach(item => data.push(item))
      $display.innerHTML = data.join('')
    }
    try {
      item.callback(data.join(''))
      $success.innerHTML = `${item.desc} 通过`
    } catch (e) {
      $error.innerHTML = `${item.desc} 不通过, 失败原因: ${e.message}`
      break
    }
  }
}
/**获取html名 */
function get (name: string): Promise<string> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `/html?name=${name}`, false)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          resolve(xhr.responseText as string)
        }
      }
    }
    xhr.send()
  })
}