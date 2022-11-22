import Dom from '@/utils/dom'

const mainTag = 'app'
const numbers = new Array(10).fill(0).map((_, i) => i + 1)
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

export default class Layout {
  public create(): boolean {
    try {
      const create = Dom.create

      const userSide = create('section', { id: 'user-side' })
      const opponentSide = create('section', { id: 'opponent-side' })

      const field = create('div', { id: 'field' })
      const controls = create('div', { id: 'controls' })

      const fightField = create('div', { id: 'fight-field' })

      const axisX = create('div', { classList: ['axis-x'] })
      const axisY = create('div', { classList: ['axis-y'] })

      for (const n of numbers) {
        const span = create('span', {})
        span.innerHTML = `${n}`
        axisY.appendChild(span)
      }

      for (const l of letters) {
        const span = create('span', {})
        span.innerHTML = `${l}`
        axisX.appendChild(span)
      }

      field.append(axisX, axisY)
      fightField.append(axisX.cloneNode(true), axisY.cloneNode(true))

      userSide.appendChild(field)
      userSide.appendChild(controls)

      opponentSide.appendChild(fightField)

      const app = document.getElementById(mainTag)

      if (!app) throw new Error('A layout has not created!')

      app.appendChild(userSide)
      app.appendChild(opponentSide)

      return true
    } catch (error) {
      console.error(error)

      return false
    }
  }
}
