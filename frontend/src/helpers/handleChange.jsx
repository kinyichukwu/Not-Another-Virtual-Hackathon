export const handleChangeEvent = (e, setState, state) => {
    const {name, value} = e.target
    setState(prevData => ({
      ...prevData,
      [name]:value
    }))
  }