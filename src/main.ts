console.log("React.ts")

const React = (() => {
  let components = new Set<() => void>()
  let hooks: any[] = []
  let index = 0
  console.log("%chooks init:", "color: red", JSON.parse(JSON.stringify(hooks)))

  function useState(initialVal: any) {
    let state = hooks[index] || initialVal
    let _idx = index

    const setState = (newVal: any) => {
      hooks[_idx] = newVal
    }

    index++

    return [state, setState]
  }

  function useEffect(cb: () => void, deps: any[]) {
    let oldDeps = hooks[index]
    let hasChanged = true

    if (oldDeps) {
      hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]))
    }

    if (hasChanged) {
      cb()
    }

    hooks[index] = deps
    index++
  }

  function useRef(value: any) {
    return { current: value }
  }

  function render(comp: () => any) {
    // reset hooks:
    if (components.has(comp)) {
      index = 0
    }
    const C = comp()
    C.render()
    components.add(comp)
    console.log("%chooks:", "color: orange", JSON.parse(JSON.stringify(hooks)))

    return C
  }

  return {
    render,
    useState,
    useEffect,
    useRef,
  }
})()

function Component() {
  const [count, setCount] = React.useState(1)
  const [text, setText] = React.useState("foo")
  const myRef = React.useRef(100)

  React.useEffect(() => {
    console.log("effect")
    myRef.current = 200
  }, [count])

  return {
    render: () => {
      console.log({ count, text, myRef })
    },
    click: () => setCount(count + 1),
    type: (newText: string) => setText(newText),
  }
}

function ComponentB() {
  const [count, setCount] = React.useState(10)
  return {
    render: () => {
      console.log({ count })
    },
    click: () => setCount(count + 1),
  }
}

React.render(Component).click()
React.render(Component).type("bar")
React.render(Component)
React.render(ComponentB)

export default React
